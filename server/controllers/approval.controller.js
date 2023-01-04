const sequelize = require('sequelize');
const Approval = require('../models/approval');
const ApprovalItem = require('../models/approval_item');
const User = require('../models/user');
const approvalItemController = require('../controllers/approval_item.controller');
const Approver = require('../models/approver');
const UserRole = require('../models/user_role');
const { webMobileEmailNotification } = require('./notification.controller');

Approval.hasMany(ApprovalItem, { foreignKey: 'approval_id' });
ApprovalItem.belongsTo(Approval, { foreignKey: 'approval_id' });
User.belongsTo(UserRole, { targetKey: 'id', foreignKey: 'user_role_id' });

exports.getApprovals = async () => {
	const result = await Approval.findAll({
		include: [
			{
				model: User,
			},
		],
		order: [['id', 'DESC']],
	});
	return result;
};

exports.saveApprovers = async (data) => {
	const isCreator = await this.isApproverCreator({
		user_id: data.createdby_id,
	});
	if (isCreator || data.forceInsert) {
		return await this.upsertByReferenceId(data);
	} else {
		throw new Error(`Don't have enough access to assign approver(s)`);
	}
};
exports.sendAssignedNotifByApprovalId = async ({
	approval_id,
	sender_id,
	reference_no,
	reference_id,
	property_id,
}) => {
	const items = await ApprovalItem.findAll({
		include: [User, Approval],
		where: { approval_id },
		raw: true,
	});
	const type = {
		mo: {
			name: 'Maintenance Order',
			redirect_url: `orders/view/${reference_id}`,
		},
		wo: {
			name: 'Work Order',
			redirect_url: JSON.stringify({ web: `orders/edit/71?t=1` }),
		},
		bill: {
			name: 'Bill',
			redirect_url: JSON.stringify({ web: `billings/view/${reference_id}` }),
		},
		invoice: {
			name: 'Invoice',
			redirect_url: JSON.stringify({ web: `billings/view/${reference_id}` }),
		},
		rfp: {
			name: 'RFP',
			redirect_url: JSON.stringify({ web: `orders/view/${reference_id}` }),
		},
	};

	for (const item of items) {
		const { name, redirect_url } = type[item['approval.type']];
		const notif = {
			title: `Your Approval is Requested for ${name}.`,
			webBody: `Requesting your approval on this ${reference_no} request. Please check your approval list..`,
			mobileBody: `Requesting your approval on this ${reference_no} request. Please check your approval list..`,
			emailBody: `Requesting your approval on this ${reference_no} request. Please click here to check your approval list..`,
			propertyId: property_id,
			propertyResId: property_id,
			decodedId: item['user.id'],
			send_by: sender_id,
			user_id: item['user.id'],
			redirect_url,
			email: item['user.email'],
			updatedAt: new Date(),
			createdAt: new Date(),
		};
		await webMobileEmailNotification(notif);
	}
};

exports.upsertByReferenceId = async ({
	reference_id,
	reference_no,
	type,
	property_id,
	createdby_id,
	other_data_obj,
	approval_item,
}) => {
	const approval = await Approval.findOne({ where: { reference_id, type } });
	let approvalId;
	if (approval) {
		const { id: approval_id } = approval.dataValues;
		approvalId = approval_id;
		await approvalItemController.upsertByApprovalId({
			approval_id,
			data: approval_item,
		});
		await this.sendAssignedNotifByApprovalId({
			approval_id: approval.dataValues.id,
			sender_id: createdby_id,
			reference_no,
			reference_id,
			property_id,
		});
	} else {
		const { id: approval_id } = await Approval.create({
			reference_id,
			reference_no,
			type,
			property_id,
			createdby_id,
			other_data_obj,
		});
		approvalId = approval_id;
		await approvalItemController.upsertByApprovalId({
			approval_id,
			data: approval_item,
		});
		await this.sendAssignedNotifByApprovalId({
			approval_id,
			sender_id: createdby_id,
			reference_no,
			reference_id,
			property_id,
		});
	}
	await approvalItemController.checkAndUpdateApprovalToComplete({
		approval_id: approvalId,
	});
	await Approval.update(
		{ createdby_id, updatedAt: new Date() },
		{ where: { reference_id, type, property_id } }
	);
	return await approvalItemController.findApprovalsById({
		approval_id: approvalId,
	});
};

exports.deleteApproval = async (id) => {
	return await Approval.delete(Approval);
};

exports.findOpenApprovalByUser = async ({ user_id, property_id }) => {
	const itemFilter = { user_id };
	const approvalFilter = { status: 'Open', property_id };

	const isCreator = await this.isApproverCreator({ user_id });
	if (isCreator) delete itemFilter.user_id;

	const data = await Approval.findAll({
		attributes: {
			include: [
				[
					sequelize.literal(`( 
          SELECT COUNT(status) FROM approval_item 
          WHERE approval_item.approval_id = approval.id
          AND status <> 'Open'
          )`),
					'completed_count',
				],
				[
					sequelize.literal(`( 
          SELECT COUNT(status) FROM approval_item 
          WHERE approval_item.approval_id = approval.id
          AND status = 'Open'
          )`),
					'pending_count',
				],
				[
					sequelize.literal(`DATEDIFF(NOW(), approval_items.createdAt)`),
					'outstanding_days',
				],
				// TODO: Check user role permission
				[sequelize.literal(true), 'is_approval_creator'],
				[
					sequelize.literal(`
          CASE 
            WHEN approval.type = "mo" THEN "Maintenance Order"
            WHEN approval.type = "wo" THEN "Work Order" 
            WHEN approval.type = "bill" THEN "Bill" 
            WHEN approval.type = "invoice" THEN "Invoice"
            WHEN approval.type = "rfp" THEN "RFP"
          ELSE approval.type
          END`),
					'type_name',
				],
				[
					sequelize.literal(`( 
          SELECT status FROM approval_item 
          WHERE approval_item.approval_id = approval.id
          AND approval_item.user_id = ${user_id}
          LIMIT 1
          )`),
					'self_status',
				],
			],
		},
		include: [
			{
				model: ApprovalItem,
				include: [User],
				where: { ...itemFilter },
			},
			{ model: User },
		],
		where: { ...approvalFilter },
		order: [['createdAt', 'DESC']],
	});
	return data;
};

exports.findHistoryApprovalByUser = async ({ user_id, property_id }) => {
	const itemFilter = { user_id };
	const approvalFilter = {
		[sequelize.Op.or]: [{ status: 'Approved' }, { status: 'Denied' }],
		property_id,
	};
	const isCreator = await this.isApproverCreator({ user_id });
	if (isCreator) delete itemFilter.user_id;

	const data = await Approval.findAll({
		attributes: {
			include: [
				[
					sequelize.literal(`( 
          SELECT COUNT(status) FROM approval_item 
          WHERE approval_item.approval_id = approval.id
          AND status = 'Approved'
          )`),
					'approved_count',
				],
				[
					sequelize.literal(`( 
          SELECT COUNT(status) FROM approval_item 
          WHERE approval_item.approval_id = approval.id
          AND status <> 'Approved'
          )`),
					'pending_count',
				],
				[
					sequelize.literal(
						`DATEDIFF(approval_items.completed_at, approval_items.createdAt)`
					),
					'completed_days',
				],
				[
					sequelize.literal(`
          CASE 
            WHEN approval.type = "mo" THEN "Maintenance Order"
            WHEN approval.type = "wo" THEN "Work Order" 
            WHEN approval.type = "bill" THEN "Bill" 
            WHEN approval.type = "invoice" THEN "Invoice"
            WHEN approval.type = "rfp" THEN "RFP"
          ELSE approval.type
          END`),
					'type_name',
				],
				[
					sequelize.literal(`( 
          SELECT status FROM approval_item 
          WHERE approval_item.approval_id = approval.id
          AND approval_item.user_id = ${user_id}
          LIMIT 1
          )`),
					'self_status',
				],
			],
		},
		include: [
			{
				model: ApprovalItem,
				include: [User],
				where: { ...itemFilter },
			},
			{ model: User },
		],
		where: { ...approvalFilter },
		order: [['createdAt', 'DESC']],
	});
	return data;
};

exports.exportApprovals = async ({ requestedby_id }) => {
	const filter = {
		user_id: requestedby_id,
	};

	const isCreator = await this.isApproverCreator({ user_id: requestedby_id });
	if (isCreator) delete filter.user_id;
	return await ApprovalItem.findAll({
		attributes: {
			include: [
				[
					sequelize.literal(`( 
          SELECT COUNT(status) FROM approval_item 
          WHERE approval_item.approval_id = approval.id
          AND status = 'Approved'
          )`),
					'approved_count',
				],
				[
					sequelize.literal(`( 
          SELECT COUNT(status) FROM approval_item 
          WHERE approval_item.approval_id = approval.id
          AND status <> 'Approved'
          )`),
					'pending_count',
				],
				[
					sequelize.literal(
						`DATEDIFF(approval_item.completed_at, approval_item.createdAt)`
					),
					'completed_days',
				],
				[
					sequelize.literal(`DATEDIFF(NOW(), approval_item.createdAt)`),
					'pending_days',
				],
				[
					sequelize.literal(`
          CASE 
            WHEN approval.type = "mo" THEN "Maintenance Order"
            WHEN approval.type = "wo" THEN "Work Order" 
            WHEN approval.type = "bill" THEN "Bill" 
            WHEN approval.type = "invoice" THEN "Invoice"
            WHEN approval.type = "rfp" THEN "RFP"
          ELSE approval.type
          END`),
					'approval.type_name',
				],
				[
					sequelize.literal(
						`DATEDIFF(approval.completed_at, approval.createdAt)`
					),
					'approval.completed_days',
				],
				[
					sequelize.literal(`DATEDIFF(NOW(), approval.createdAt)`),
					'approval.pending_days',
				],
			],
		},
		include: [
			{ model: Approval, include: [{ model: User, include: [UserRole] }] },
			{ model: User, include: [UserRole] },
		],
		where: { ...filter },
	});
};

exports.isApproverCreator = async ({ user_id }) => {
	return await Approver.findOne({
		where: {
			user_id,
			is_creator: true,
			is_active: true,
			is_deleted: false,
		},
	});
};

exports.isApprover = async ({ user_id }) => {
	return await Approver.findOne({
		where: {
			user_id,
			is_creator: false,
			is_active: true,
			is_deleted: false,
		},
	});
};
