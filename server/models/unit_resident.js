const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'unit_resident',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    unit_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    resident_type: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    purchase_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    move_in_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    move_out_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    resident_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    resident_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    resident_email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    resident_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    move_in_note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    move_out_note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_primary: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    contact_type: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    role_status: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: 'l'
    },
    role_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  },
  {
    timestamps: false,
    tableName: 'unit_resident'
  }
)
