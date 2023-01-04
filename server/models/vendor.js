const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'vendor',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(255),
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
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    available_units: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    available_building: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    property_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    category_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    billing_address_line_1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    billing_city: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    billing_state: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    billing_country: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    billing_zip: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    billing_email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    billing_phone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    business_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    business_address_line_1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    business_city: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    business_state: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    business_country: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    business_zip: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    business_email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    business_phone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    business_license: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    business_license_exp: {
      type: DataTypes.DATE,
      allowNull: true
    },
    insurance_license: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    insurance_license_exp: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bond_docs: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    bond_docs_exp: {
      type: DataTypes.DATE,
      allowNull: true
    },
    service_radius: {
      type: DataTypes.STRING(255),
      allowNull: true
    },

  },
  {
    timestamps: false,
    tableName: 'vendor'
  }
)