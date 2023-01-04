const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'maintenance',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    unit_resident_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    m_request_status_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    resolved_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    building_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    maintenance_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    urgency: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: 'M'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image_filename: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    m_type_other_value: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    assigned_to: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    rfp_type: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    vendor_category_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    is_seen: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    property_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    unit_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  {
    timestamps: false,
    tableName: 'maintenance'
  }
)