const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'property',
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
    address_line_1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    address_line_2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    postal_code: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    country_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    radius: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_deleted: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    created_by_manager_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    manager_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    property_type: {
      type: DataTypes.STRING(11),
      allowNull: false
    },
    permissions1_json: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    permissions2_json: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    domain: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pmc_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    photo_filename: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ref: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    settings_json: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    email_signature: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    caliber_client_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    BillingAddress1: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    BillingAddress2: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    BillingAddress3: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    BillingCity: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    BillingCountry: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    BillingFax: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    BillingPhoneArea: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    BillingPhone: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    BillingPhoneType: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    BillingState: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    BillingZip: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  },
  {
    timestamps: false,
    tableName: 'property'
  }
)
