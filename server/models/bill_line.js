const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'bill_line',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    bill_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'bill',
        key: 'id'
      }
    },
    fee_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
  },
  {
    timestamps: false,
    tableName: 'bill_line'
  }
)