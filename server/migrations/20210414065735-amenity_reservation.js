'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.createTable('amenity_reservation', 
     {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      amenity_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      unit_resident_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      from_time: {
        type: Sequelize.STRING,
        allowNull: false
      },
      to_time: {
        type: Sequelize.STRING,
        allowNull: false
      },
      people: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      comments: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      from_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      to_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      is_seen: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: '0'
      },
      from_datetime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      to_datetime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      property_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      unit_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      rejection_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      internal_comments: {
        type: Sequelize.TEXT,
        allowNull: true
      },
  
      startDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      label: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      classes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      style: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_block: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      block_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_buffer: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('amenity_reservation');
  }
};
