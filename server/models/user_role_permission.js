const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'user_role_permission',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_role_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    permissions_json: {
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
    tableName: 'user_role_permission'
  }
)
