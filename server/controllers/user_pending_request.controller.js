import UserPendingRequest from '../models/user_pending_request';
import Property from '../models/property';
import User from '../models/user';
import UserOrgRole from '../models/user_org_role';
import UserRole from '../models/user_role';
import { createUser, isEmailExist } from './user.controller';
const UserOrgRoleController = require('../controllers/user_org_role.controller');
const {
	webMobileEmailNotification,
} = require('../controllers/notification.controller');

UserRole.hasMany(UserOrgRole, {
	foreignKey: 'user_role_id',
});
UserOrgRole.belongsTo(User, { targetKey: 'id', foreignKey: 'user_id' });

const notifyPendingRequestParentAdmin = async ({ property_id }) => {
	const admins = await UserRole.findAll({
		include: [{ model: UserOrgRole, include: [User] }],
		where: { slug: 'parent_pmc', property_id },
	});
	for (const { user_org_role } of admins) {
		const notif = {
			title: `Join request pending approval.`,
			webBody: `Requesting your approval on new user request. Please check your invites list..`,
			mobileBody: `Requesting your approval on new user request. Please check your approval list..`,
			emailBody: `Requesting your approval on new user request. Please click here to check your approval list..`,
			propertyId: property_id,
			propertyResId: property_id,
			decodedId: user_org_role.user.id,
			send_by: 0,
			user_id: user_org_role.user.id,
			email: user_org_role.user.email,
			updatedAt: new Date(),
			createdAt: new Date(),
		};
		await webMobileEmailNotification(notif);
	}
};
const notifyRequestAction = async ({
	user_id,
	name,
	email,
	property_id,
	action,
	comment,
}) => {
	const title =
		action === 'approved'
			? `Welcome aboard, ${name}!`
			: 'Your request has been denied';
	const message =
		action === 'approved'
			? `Your request has been ${action}. Please login into the app with the username & password provided during the registration`
			: `Reason for denying: '${comment}'. Contact your property manager(s) for further clarifications/questions`;
	const notif = {
		title,
		webBody: message,
		mobileBody: message,
		emailBody: message,
		propertyId: property_id,
		propertyResId: property_id,
		decodedId: user_id,
		send_by: 0,
		user_id: user_id,
		email: email,
		updatedAt: new Date(),
		createdAt: new Date(),
	};
	await webMobileEmailNotification(notif);
};

const createRequest = async (data) => {
	notifyPendingRequestParentAdmin({ ...data });
	return await UserPendingRequest.create(data, {
		returning: true,
	});
};

const update = async (updateData, filter) => {
	return await UserPendingRequest.update(
		{ ...updateData },
		{ where: { ...filter } }
	);
};

const findRequestsQry = async ({ property_id }) => {
	return await UserPendingRequest.findAll({ where: { property_id } });
};

const approveUserRequest = async (data) => {
	const emailExists = await isEmailExist(data.email);
	if (emailExists) throw new Error(`Email ${data.email} exists.`);

	const user = { ...data };
	const createdUser = await createUser(user);
	const { id: user_id, first_name, email } = createdUser;
	const { pmc_id } = await Property.findOne({
		where: { id: data.property_id },
	});
	const role = {
		user_id,
		pmc_id,
		user_role_id: data.role_id,
		property_id: data.property_id,
		is_clone: false,
	};
	const createdUserOrgRole = await UserOrgRoleController.saveUserOrgRole(role);
	await update({ status: 'Approved' }, { id: data.id });
	notifyRequestAction({
		user_id,
		name: first_name,
		property_id: data.property_id,
		email,
		action: 'approved',
	});
	return {
		createdUserOrgRole,
		createdUser,
	};
};

const denyUserRequest = async (data) => {
	const emailExists = await isEmailExist(data.email);
	if (emailExists) throw new Error(`Email ${data.email} exists.`);

	notifyRequestAction({
		user_id: 0,
		name: data.first_name,
		property_id: data.property_id,
		email: data.email,
		action: 'denied',
		comment: data.comment,
	});

	return await update(
		{ status: 'Denied', comment: data.comment },
		{ id: data.id }
	);
};

export { createRequest, findRequestsQry, approveUserRequest, denyUserRequest };
