const Sequelize = require('sequelize');
const db = require('../database/db.js');

module.exports = db.sequelize.define(
	'user_pending_request',
	{
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		property_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'property',
				key: 'id',
			},
		},
		type: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		description: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		requestDataObj: {
			type: Sequelize.TEXT,
			allowNull: true,
		},
		is_approved: {
			type: Sequelize.BOOLEAN,
			allowNull: true,
			defaultValue: false,
		},
		status: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		comment: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		approved_by: {
			type: Sequelize.INTEGER,
			allowNull: true,
			references: {
				model: 'user',
				key: 'id',
			},
		},
		is_active: {
			type: Sequelize.BOOLEAN,
			allowNull: true,
		},
		is_deleted: {
			type: Sequelize.BOOLEAN,
			allowNull: true,
		},
		createdAt: {
			type: Sequelize.DATE,
			allowNull: true,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		},
		updatedAt: {
			type: Sequelize.DATE,
			allowNull: true,
		},
	},
	{
		timestamps: false,
		tableName: 'user_pending_request',
	}
);
