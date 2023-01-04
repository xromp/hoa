const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'incident_report',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    property_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    building_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    unit_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    incident_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    occured_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    occured_time: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    reported_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    reported_time: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    witness1_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    witness1_address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    witness1_telephone: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    witness2_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    witness2_address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    witness2_telephone: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    action_taken: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    additional_comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    police_called: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    police_called_time: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    police_arrived_time: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    police_departed_time: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    fire_called: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    fire_called_time: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    fire_arrived_time: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    fire_departed_time: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    ambulance_called: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    ambulance_called_time: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    ambulance_arrived_time: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    ambulance_departed_time: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    unit_resident1_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    unit_resident2_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  },
  {
    timestamps: false,
    tableName: 'incident_report'
  }
)