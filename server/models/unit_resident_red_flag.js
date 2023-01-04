const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'unit_resident_red_flag',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    unit_resident_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    from_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    to_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    unit_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: 'unit_resident_red_flag'
  }
)