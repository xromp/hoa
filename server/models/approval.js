const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'approval',
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    reference_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    reference_no: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    property_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'property',
        key: 'id'
      }
    },
    createdby_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    completed_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'Open',
    },
    other_data_obj: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: true
    },
  },  
  {
    timestamps: false,
    tableName: 'approval'
  }
)