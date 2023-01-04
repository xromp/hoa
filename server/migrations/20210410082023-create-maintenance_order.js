'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('maintenance_order', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      unit_resident_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      m_request_status_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      resolved_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      building_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      location: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      maintenance_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      urgency: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'M'
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      image_filename: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      m_type_other_value: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      assigned_to: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      assigned_to_type: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      rfp_type: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      vendor_category_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      is_seen: {
        type: Sequelize.INTEGER(1),
        allowNull: true,
        defaultValue: '0'
      },
      property_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      unit_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      start_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      end_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      start_date: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true
      },    
      eta_dt: {
        type: Sequelize.DATE,
        allowNull: true
      },    
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },    
      request_no: {
        type: Sequelize.TEXT,
        allowNull: true
      },    
      overview: {
        type: Sequelize.TEXT,
        allowNull: true
      },    
      scope: {
        type: Sequelize.TEXT,
        allowNull: true
      },    
      request_to: {
        type: Sequelize.TEXT,
        allowNull: true
      },    
      vendor_email: {
        type: Sequelize.TEXT,
        allowNull: true
      },    
      direction: {
        type: Sequelize.TEXT,
        allowNull: true
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('maintenance_order');
  }
};
