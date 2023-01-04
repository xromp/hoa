const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'user_role',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    property_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pmc_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    val: {
      type: DataTypes.STRING,
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true
    },
    access_level: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_role_default_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    permission: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    }  
  },
  {
    timestamps: false,
    tableName: 'user_role'
  }
)
