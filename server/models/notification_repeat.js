const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'notification_repeat',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    notification_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    isRecurring: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    weekly: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    repeat_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },  
  {
    timestamps: false,
    tableName: 'notification_repeat'
  }
)