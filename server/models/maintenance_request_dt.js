const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'maintenance_request_dt',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    maintenance_request_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    start_date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    end_time: {
      type: DataTypes.TIME,
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
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }   
  },
  {
    timestamps: false,
    tableName: 'maintenance_request_dt'
  }
)