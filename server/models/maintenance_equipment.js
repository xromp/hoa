const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'maintenance_equipment',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    device_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    service_reminders: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    frequency_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },    
    components: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    files: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    serviced_by: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    model_no: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    part_no: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    unit_price: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    longtitude: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    latitude: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    input_location: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    warranty_start: {
      type: DataTypes.DATE,
      allowNull: true
    },
    warranty_end: {
      type: DataTypes.DATE,
      allowNull: true
    },
    standard_warranty: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    extended_warranty: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    expiration_reminder: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reminder_type: {
      type: DataTypes.TEXT,
      allowNull: true
    }, 
    notes: {
      type: DataTypes.TEXT,
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
    }, 
  },
  {
    timestamps: false,
    tableName: 'maintenance_equipment'
  }
)
