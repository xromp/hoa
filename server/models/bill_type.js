const DataTypes = require('sequelize');
const db = require('../database/db.js');

module.exports = db.sequelize.define(
	'bill_type',
	{
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		parent_org_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'pmc',
				key: 'id',
			},
		},
		property_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'property',
				key: 'id',
			},
		},
		insight_tag: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		created_by: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'user',
				key: 'id',
			},
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		code: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		timestamps: false,
		tableName: 'bill_type',
	}
);
