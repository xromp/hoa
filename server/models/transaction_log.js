const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'transaction_log',
  {
    id: {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    billId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'bill',
        key: 'id'
      }
    },
    gateway: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    remoteStatus: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    transRefId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    paid_by: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    completed: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    currencyId: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
  },
  {
    timestamps: false,
    tableName: 'transaction_log'
  }
)