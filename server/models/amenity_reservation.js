const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'amenity_reservation',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    amenity_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'amenity',
        key: 'id'
      }
    },
    unit_resident_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    from_time: {
      type: DataTypes.STRING(7),
      allowNull: false
    },
    to_time: {
      type: DataTypes.STRING(7),
      allowNull: false
    },
    people: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    from_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    to_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    is_seen: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    from_datetime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    to_datetime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    property_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    unit_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    internal_comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    startDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    label: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    classes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    style: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_block: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    block_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_buffer: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    is_all_day: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  },  
  {
    timestamps: false,
    tableName: 'amenity_reservation'
  }
)