const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'caliber_property',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    client_id: {
      type: Sequelize.INTEGER,
    },
    property_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    last_modified: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    last_modified_by: {
      type: Sequelize.ENUM('caliber', 'AXP'),
      allowNull: true,
    },
    audit_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: true
    },
  },
  {
    timestamps: false,
    tableName: 'caliber_property'
  }
)