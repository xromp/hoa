const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'country_af',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    country_master_id: {
      type: DataTypes.INTEGER(11)
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    code: {
      type: DataTypes.CHAR(2),
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: 'country_af'
  }
)
