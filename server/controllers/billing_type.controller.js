const BillType = require('../models/bill_type');
const Property = require('../models/property');
const ParentOrg = require('../models/pmc');
const User = require('../models/user');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const today = new Date();

BillType.belongsTo(Property, { targetKey: 'id', foreignKey: 'property_id' });
BillType.belongsTo(ParentOrg, { targetKey: 'id', foreignKey: 'parent_org_id' });
BillType.belongsTo(User, { targetKey: 'id', foreignKey: 'created_by' });

exports.getBillingTypeByParams = async (data) => {
	const property = await Property.findOne({
		where: { ref: data.property_ref },
	});
	const result = await BillType.findAll({
		include: [{ model: Property }, { model: ParentOrg }, { model: User }],
		// where: {
		//   parent_org_id: {
		//     [Op.$or]: [data.parent_org_id, 0],
		//   },
		//   property_id: {
		//     [Op.$or]: [property.id, 0],
		//   },
		// },
		where: { parent_org_id: data.parent_org_id },
		order: [['id', 'DESC']],
	});

	return result;
};

exports.getBillingTypeById = async (id) => {
	const result = await BillType.findOne({
		include: [{ model: Property }, { model: ParentOrg }, { model: User }],
		where: { id },
	});

	return result;
};

exports.deleteBillingTypeById = async (id) => {
	const result = await BillType.destroy({
		where: { id },
	});

	return 'success';
};

exports.postBillingType = async (data) => {
	const property = await Property.findOne({
		where: { ref: data.property_ref },
	});
	data.property_id = property.id;
	let result = [];

	if (data.paramsId == -1) {
		result = await this.createBillType(data);
	} else {
		await this.updateBillType(data);
	}

	return { message: 'success', data, result };
};

exports.createBillType = async (data) => {
	const result = await BillType.create({
		parent_org_id: data.parent_org_id,
		property_id: data.property_id,
		created_by: data.created_by,
		name: data.name,
		code: data.code,
		updatedAt: today,
		createdAt: today,
	});

	return result;
};

exports.updateBillType = async (data) => {
	const result = await BillType.update(
		{
			name: data.name,
			code: data.code,
			updatedAt: today,
		},
		{
			where: { id: data.paramsId },
		}
	);
	return result;
};

export const getTypesByPmcId = async ({ parent_org_id }) => {
	return await BillType.findAll({
		where: { parent_org_id },
	});
};

export const createDefaultBillTypesByPmcId = async (parent_org_id) => {
	const types = [
		{
			parent_org_id,
			property_id: 0,
			name: 'Service Fee',
			code: 'TRANSACTION_FEE',
			insight_tag: '',
		},
		{
			parent_org_id,
			property_id: 0,
			name: 'Maintenance Fees',
			code: 'MAINTENANCE_FEE',
			insight_tag: '',
		},
		{
			parent_org_id,
			property_id: 0,
			name: 'Facility Rentals',
			code: 'FACILITY_RENTALS',
			insight_tag: '',
		},
		{
			parent_org_id,
			property_id: 0,
			name: 'Security Deposits',
			code: 'SECURITY_DEPOSITS',
			insight_tag: '',
		},
		{
			parent_org_id,
			property_id: 0,
			name: 'HOA Dues',
			code: 'HOA_DUES',
			insight_tag: '',
		},
		{
			parent_org_id,
			property_id: 0,
			name: 'Rent/Lease Payments',
			code: 'RENT_LEASE',
			insight_tag: '',
		},
	];
	return await BillType.bulkCreate(types);
};
