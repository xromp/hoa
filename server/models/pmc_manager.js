const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'pmc_manager',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    pmc_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    permissions_json: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    role_status: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: 'l'
    }
  },
  {
    timestamps: false,
    tableName: 'pmc_manager'
  }
)
