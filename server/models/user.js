const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_activated: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    profile_json: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone1: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true
    },
    middle_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone2: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    salutation_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    property_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    suffix: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    avatar_filename: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    country_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    address_line_1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    province: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    address_line_2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    postcode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    user_role_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    vendor_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    push_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    emergency_contact_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    relation: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    emergency_contact_no: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pmc_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    socket_id: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    full_name: {
      type: DataTypes.VIRTUAL,
      get () {
        return `${this.getDataValue('first_name')} ${this.getDataValue('last_name')}`
      }
    },
    company_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_deleted: {
      type: DataTypes.TINYINT(1),
      allowNull: true
    },
    is_reset: {
      type: DataTypes.TINYINT(1),
      allowNull: true
    },
  },
  {
    timestamps: false,
    tableName: 'user'
  }
)
