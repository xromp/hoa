const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'user_designation',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    pmc_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'pmc',
        key: 'id'
      }
    },
    property_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'property',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    d_maintenance: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    d_reservation: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    d_bulletin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
  },
  {
    timestamps: false,
    tableName: 'user_designation'
  }
)
