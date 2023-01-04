const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'unit',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    number: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    parent_org_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    building_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    unit_square_feet: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    hoa_fee: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0,
    },
    parking_stall_number: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    wine_locker_number: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    storage_unit_number: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    surfboard_storage: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    bike_storage: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    kayak_storage_number: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    boat_storage_number: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    unit_status_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    is_high_security: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    high_security_note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    votes_pci: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    maint_fee: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    reserve_fee: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    rec_fee: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    is_active: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  },
  {
    timestamps: false,
    tableName: 'unit'
  }
)
