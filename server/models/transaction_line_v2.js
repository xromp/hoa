const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'transaction_line_v2',
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    transaction_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    posting_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
    },
    balance: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    unit_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    account_number: {
      type: Sequelize.STRING,
      allowNull: true
    },
    trans_account_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    ref: {
      type: Sequelize.STRING,
      allowNull: true
    },
    caliberObj: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: true
    }
  },
  {
    timestamps: false,
    tableName: 'transaction_line_v2'
  }
)