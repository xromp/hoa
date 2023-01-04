const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'incident_report_photo',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    incident_report_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    original_file_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    mime_type: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: 'incident_report_photo'
  }
)