const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'work_week',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    val: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: 'work_week'
  }
)
