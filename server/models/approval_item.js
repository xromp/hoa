const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'approval_item',
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    approval_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'approval',
        key: 'id'
      }
    },
    status: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['Open', 'Approved', 'Denied'],
      defaultValue: 'Open',
    },
    comment: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    level: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    completed_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    latest_followup_sent: {
      type: Sequelize.DATE,
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
    tableName: 'approval_item'
  }
)