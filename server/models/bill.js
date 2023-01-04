const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'bill',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    unit_resident_id: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    ledger_type: {
      type: DataTypes.ENUM('AP', 'AR'),
      allowNull: false
    },
    total_amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    generated_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    from_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    to_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    payer_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    payer_email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    payer_address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    payer_phone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    payee_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    payee_email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    payee_phone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    payee_address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    paid: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bill_config_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    unit_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    property_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    vendor_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    invoice_no: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    createdby_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {
    timestamps: false,
    tableName: 'bill'
  }
)