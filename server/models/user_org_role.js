const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'user_org_role',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    user_role_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'user_role',
        key: 'id'
      }
    },
    pmc_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    property_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    is_clone: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 0,
    },
    other_data_obj: {
      type: Sequelize.TEXT,
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
    tableName: 'user_org_role'
  }
)