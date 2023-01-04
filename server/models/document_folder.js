const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'document_folder',
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
    val: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    parent_document_folder_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    property_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    pmc_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    permissions_json: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    unit_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    prop_permissions_json: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
  },
  {
    timestamps: false,
    tableName: 'document_folder'
  }
)
