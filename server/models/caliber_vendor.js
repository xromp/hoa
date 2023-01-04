const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'caliber_vendor',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    caliber_vendor_id: {
      type: Sequelize.INTEGER,
    },
    vendor_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'vendor',
        key: 'id'
      }
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
    tableName: 'caliber_vendor'
  }
)