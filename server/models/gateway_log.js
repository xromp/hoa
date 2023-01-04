const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'gateway_log',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }, 
    data: {
      type: DataTypes.TEXT,
      allowNull: true
    }, 
    gateway: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    transaction_log_id: {
      type: DataTypes.INTEGER(12),
      allowNull: true,
      references: {
        model: 'transaction_log',
        key: 'id'
      }
    },
    result: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    resultDetail: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  },
  {
    timestamps: false,
    tableName: 'gateway_log'
  }
)