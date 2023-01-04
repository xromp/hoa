const http = require('http');
const Notification = require('../models/notification');
const NotificationTemplate = require('../models/notification_template');
const NotificationMessage = require('../models/notification_message');
const NotificationRepeat = require('../models/notification_repeat');
const Property = require('../models/property');
const User = require('../models/user');
const UserOrgRole = require('../models/user_org_role');
const UserRole = require('../models/user_role');
const mailController = require('../controllers/mail');
const NotificationSent = require('../models/notification_sent');
const pushNotif = require('../controllers/push_notif');
const PmcManager = require('../models/pmc_manager');
const PmcUser = require('../models/pmc_user');
const { io } = require('../beta-axp');
const { findPropertyByRef } = require('./property.controller');

// Notification.belongsTo(NotificationTemplate, {targetKey:'id',foreignKey: 'notification_message_id'})
// Notification.belongsTo(NotificationMessage, {targetKey:'id',foreignKey: 'notification_message_id'})
// Notification.hasMany(NotificationSent, {foreignKey: 'notification_id'})
NotificationMessage.hasMany(Notification, {
	foreignKey: 'notification_message_id',
});
NotificationMessage.belongsTo(Property, {
	targetKey: 'id',
	foreignKey: 'property_id',
});
Notification.belongsTo(NotificationSent, {
	targetKey: 'notification_id',
	foreignKey: 'id',
});
User.hasMany(PmcManager, { targetKey: 'id', foreignKey: 'user_id' });
User.hasMany(PmcUser, { targetKey: 'id', foreignKey: 'user_id' });
NotificationMessage.belongsTo(User, { targetKey: 'id', foreignKey: 'user_id' });
UserRole.belongsTo(UserOrgRole, {
	targetKey: 'user_role_id',
	foreignKey: 'id',
});
User.belongsTo(UserOrgRole, { targetKey: 'user_id', foreignKey: 'id' });

exports.getNotificationMessageByUserId = async (id) => {
	const result = await NotificationMessage.findAll({
		include: [
			{ model: Property },
			{
				model: Notification,
				where: {
					user_id: id,
				},
				include: [{ model: NotificationSent }],
			},
		],
		order: [['id', 'DESC']],
	});

	return result;
};

exports.getNotificationMessageById = async (id) => {
	const result = await NotificationMessage.findAll({
		include: [
			{ model: Property },
			{
				model: Notification,
				include: [{ model: NotificationSent }],
			},
		],
		where: {
			id,
		},
	});

	return result;
};

exports.getNotificationMessageAll = async (decoded, property_ref) => {
	const pmcUser = await User.findOne({
		include: [
			{
				model: PmcManager,
				where: {
					user_id: decoded.id,
				},
			},
		],
	});

	let pmcids = [];
	pmcUser['dataValues']['pmc_managers'].map((v, k) => {
		pmcids[k] = v['pmc_id'];
	});

	const result = await NotificationMessage.findAll({
		include: [
			{
				model: Property,
				where: {
					ref: property_ref,
				},
			},
			{
				model: Notification,
				where: {
					send_by: decoded.id,
				},
				include: [{ model: NotificationSent }],
			},
		],
		required: true,
		right: true,
		where: { is_deleted: false },
		order: [['id', 'DESC']],
	});

	return result;
};

exports.getReceivedNotifications = async ({
	user_id,
	property_ref: ref,
	parent_org_id,
}) => {
	const { id: property_id } = await findPropertyByRef({ ref });

	const result = await Notification.findAll({
		include: [
			{
				model: NotificationMessage,
				include: [
					{ model: User },
					{
						model: Property,
						where: { ref },
					},
				],
			},
		],
		where: { user_id, is_deleted: false, property_id },
		order: [['createdAt', 'DESC']],
		required: true,
		right: true,
	});
	return result;
};

exports.getReceivedNotificationById = async ({
	userId: user_id,
	id,
	property_ref,
}) => {
	const data = { property_ref };
	const propertyRes = await module.exports.findPropertyByPropertyRef(data);
	const result = await Notification.findOne({
		include: [
			{
				model: NotificationMessage,
				include: [{ model: User }],
			},
		],
		// where: { user_id, id, property_id: propertyRes['dataValues']['id'] },
		where: { user_id, id },
		order: [['createdAt', 'DESC']],
	});
	return result;
};

exports.removeReceivedNotification = async ({ userId: user_id, id }) => {
	const result = await Notification.update(
		{ is_deleted: true },
		{ where: { user_id, id } }
	);
	return result;
};

exports.removeSentNotification = async ({ userId: user_id, id }) => {
	const result = await NotificationMessage.update(
		{ is_deleted: true },
		{ where: { id } }
	);
	return result;
};

exports.postNotification = async (data) => {
	if (data.paramsId == -1) {
		const category_id = data.user_id;
		let h1_title = 'You have new notification: ' + data.title;
		let p_body = data.message;
		let userF = [];
		let userEmails = [];
		let userIds = [];
		let userEmailPush = [];

		const { id: property_id } = await findPropertyByRef({
			ref: data.property_ref,
		});
		data.property_id = property_id;

		if (parseInt(data.recipient_type) === 1) {
			userF = await User.findAll({
				attributes: ['id', 'email'],
				where: {
					id: category_id,
				},
			});
		} else {
			userF = await UserOrgRole.findAll({
				include: [
					{
						model: UserRole,
						where: {
							id: category_id,
						},
					},
					{
						model: User,
						attributes: ['id', 'email'],
					},
				],
				required: true,
				right: true,
			}).map(({ user }) => user);
		}

		userF.filter(async (res) => {
			if (res['dataValues']['email'] !== null) {
				userEmails.push(res['dataValues']['email']);
				userIds.push(res['dataValues']['id']);

				await mailController.sendEmail(
					res['dataValues']['email'],
					h1_title,
					p_body
				);
			}
		});

		userEmailPush = userEmails;
		userEmails = userEmails + '';

		const notificationMessage = await module.exports.createNotificationMessage(
			data
		);
		data.notificationMessageId = notificationMessage['dataValues']['id'];

		userIds.map(async (v, k) => {
			data.user_id = userIds[k];
			data.send_by = data.decodedId;
			const notification = await module.exports.createNotification(data);
			data.notificationId = notification['dataValues']['id'];
			await module.exports.createNotificationSent(data);
			await module.exports.notifyUser({ userId: userIds[k], data });

			if (data.isRepeat == 1) {
				const nfr = await module.exports.createNotificationRepeat(
					nf.dataValues,
					data
				);
			}
		});

		pushNotif.sendMessage(userEmailPush, h1_title, p_body);
		// mailController.sendEmail(userEmails, h1_title, p_body)

		return { message: 'success', result: notificationMessage };
	}
};

exports.findPropertyByPropertyRef = async (data) => {
	const result = await Property.findOne({
		where: {
			ref: data.property_ref,
		},
	});

	return result;
};

exports.createNotificationMessage = async (data) => {
	const result = await NotificationMessage.create({
		title: data.title,
		message: data.message,
		property_id: data.property_id,
		user_id: data.decodedId,
		updatedAt: data.updatedAt,
		createdAt: data.createdAt,
	});

	return result;
};

exports.createNotificationRepeat = async (nf, data) => {
	const result = await NotificationRepeat.create({
		notification_id: nf.id,
		start_date: data.start_date,
		start_time: data.start_time,
		end_date: data.end_date,
		end_time: data.end_time,
		isRecurring: data.isRepeat,
		weekly: JSON.stringify(data.repeatDay),
		repeat_type: data.repeat_type,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	});

	return result;
};

exports.getReceivedMessages = async ({ user_id }) => {
	const result = await Notification.findAll({
		include: [{ model: NotificationMessage }],
		where: { user_id },
		limit: 10,
		order: [['createdAt', 'DESC']],
	});
	return result;
};

exports.updateSeenNotif = async ({ user_id }) => {
	const seen = await Notification.update(
		{ is_seen: true, updatedAt: new Date() },
		{ where: { user_id, is_seen: false } }
	);
	return seen;
};

exports.notifyUser = async ({ userId: id, data }) => {
	try {
		const { io } = require('../beta-axp');
		const { title, message } = data;
		const { socket_id } = await User.findOne({ where: { id } });
		io.sockets.to(socket_id).emit('notify-user', { title, message });
	} catch (err) {
		console.log('notifyUser Error: ', err.toString('utf8'));
		return false;
	}
};

exports.createNotification = async (data) => {
	const result = await Notification.create({
		notification_message_id: data.notificationMessageId,
		notification_template_id: data.notification_template_id,
		property_id: !!data.property_id ? data.property_id : data.propertyId,
		title: data.title,
		message: data.message,
		redirect_url: data.redirect_url,
		is_seen: 0,
		is_delivered: 0,
		is_automated: data.is_automated,
		user_id: data.user_id,
		send_by: data.send_by,
		updatedAt: data.updatedAt,
		createdAt: data.createdAt,
	});

	return result;
};

exports.createNotificationSent = async (data) => {
	const result = await NotificationSent.create({
		notification_id: data.notificationId,
		is_seen: 0,
		is_delivered: 0,
		user_id: data.user_id,
		updatedAt: data.updatedAt,
		createdAt: data.createdAt,
		account_id: 0,
		is_delivered: 0,
		message: data.message,
	});

	return result;
};

exports.notifyUser_2 = async (data) => {
	try {
		const { io } = require('../beta-axp');
		const { title, message, email } = data;
		const { socket_id } = await User.findOne({ where: { email } });
		io.sockets.to(socket_id).emit('notify-user', { title, message });
	} catch (err) {
		console.log('notifyUser Error: ', err.toString('utf8'));
		return false;
	}
};

exports.webMobileEmailNotification = async (data) => {
	const notificationMessageData = {
		title: data.title,
		message: data.webBody,
		property_id: data.propertyId,
		decodedId: data.decodedId,
		updatedAt: data.updatedAt,
		createdAt: data.createdAt,
	};
	data.message = data.webBody;

	const notificationMessage = await module.exports.createNotificationMessage(
		notificationMessageData
	);
	data.notificationMessageId = notificationMessage['dataValues']['id'];

	if (data.type === 'multiple') {
		data.userData.filter(async (r) => {
			data.user_id = r.userId;
			const notification = await module.exports.createNotification(data);
			data.notificationId = notification['dataValues']['id'];
			await module.exports.createNotificationSent(data);
			await module.exports.notifyUser({ userId: r.userId, data });
			mailController.sendEmail(r.userEmail, data.title, data.emailBody);
		});
		pushNotif.sendMessage(data.emails, data.title, data.mobileBody);
	} else {
		const notification = await module.exports.createNotification(data);
		data.notificationId = notification['dataValues']['id'];
		await module.exports.createNotificationSent(data);
		await module.exports.notifyUser_2(data);
		mailController.sendEmail(data.email, data.title, data.emailBody);
		pushNotif.sendMessage(data.email, data.title, data.mobileBody);
	}
};
