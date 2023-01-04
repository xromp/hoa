const DataTypes = require('sequelize');
const db = require('../database/db.js');

module.exports = db.sequelize.define(
	'notification',
	{
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		is_seen: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '0',
		},
		is_deleted: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: '0',
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		is_delivered: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '0',
		},
		is_automated: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: 1,
		},
		user_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
		},
		property_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
		},
		notification_message_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
		},
		notification_template_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
		},
		title: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		redirect_url: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		send_by: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
		},
	},
	{
		timestamps: false,
		tableName: 'notification',
	}
);
