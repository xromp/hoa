const DataTypes = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'maintenance_order',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    unit_resident_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    m_request_status_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    resolved_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    building_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    maintenance_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    urgency: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: 'M'
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image_filename: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    m_type_other_value: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    assigned_to: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    assigned_to_type: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    rfp_type: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    vendor_category_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
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
    property_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    unit_id: {
      type: DataTypes.INTEGER(11),
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
    start_date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },    
    eta_dt: {
      type: DataTypes.DATE,
      allowNull: true
    },    
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },    
    request_no: {
      type: DataTypes.TEXT,
      allowNull: true
    },    
    overview: {
      type: DataTypes.TEXT,
      allowNull: true
    },    
    scope: {
      type: DataTypes.TEXT,
      allowNull: true
    },    
    request_to: {
      type: DataTypes.INTEGER,
      allowNull: true
    },    
    vendor_email: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    direction: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    issued_by_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rfp_issue_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    send_question_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rfp_due_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    decision_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    questions_to_vendor: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    qoutation: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    availability: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    other_comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_submitted: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
      allowNull: true
    },
    rfp_recipients: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    other_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_assigned: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
      allowNull: true
    },
    preferred_timing: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    closed_date: {
      type: DataTypes.DATE,
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
  },
  {
    timestamps: false,
    tableName: 'maintenance_order'
  }
)