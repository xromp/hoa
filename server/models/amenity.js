const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'amenity',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    property_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    max_hours: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    is_deposit_required: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    is_key_required: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    approved_color: {
      type: DataTypes.STRING(7),
      allowNull: true
    },
    requested_color: {
      type: DataTypes.STRING(7),
      allowNull: true
    },
    blocked_color: {
      type: DataTypes.STRING(7),
      allowNull: true
    },
    amenity_color: {
      type: DataTypes.STRING(7),
      allowNull: true
    },
    buffer_time: {
      type: DataTypes.STRING(5),
      allowNull: true,
      defaultValue: '0'
    },
    available_from_time: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    available_to_time: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    deposit_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    photo_filename: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    booking_message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    terms_conditions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    min_hours: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    inventory_items_json: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_all_day: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    operational_days_json: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    buffer_time_unit: {
      type: "SET('H','M')",
      allowNull: true
    },
    booking_limit: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    booking_limit_unit: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    notification_message_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    amenity_f_color: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    max_user_allowed: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
  },
  {
    timestamps: false,
    tableName: 'amenity'
  }
)
