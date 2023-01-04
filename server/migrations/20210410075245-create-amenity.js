'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('amenity', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      property_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      max_hours: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      is_deposit_required: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      amount: {
        type: Sequelize.DECIMAL,
        allowNull: true
      },
      is_key_required: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      approved_color: {
        type: Sequelize.STRING(7),
        allowNull: true
      },
      requested_color: {
        type: Sequelize.STRING(7),
        allowNull: true
      },
      blocked_color: {
        type: Sequelize.STRING(7),
        allowNull: true
      },
      amenity_color: {
        type: Sequelize.STRING(7),
        allowNull: true
      },
      buffer_time: {
        type: Sequelize.STRING(5),
        allowNull: true,
        defaultValue: '0'
      },
      available_from_time: {
        type: Sequelize.STRING(5),
        allowNull: true
      },
      available_to_time: {
        type: Sequelize.STRING(5),
        allowNull: true
      },
      deposit_amount: {
        type: Sequelize.DECIMAL,
        allowNull: true
      },
      photo_filename: {
        type: Sequelize.STRING(64),
        allowNull: true
      },
      booking_message: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      terms_conditions: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      min_hours: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      inventory_items_json: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_all_day: {
        type: Sequelize.INTEGER(4),
        allowNull: true
      },
      operational_days_json: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      buffer_time_unit: {
        type: "SET('H','M')",
        allowNull: true
      },
      booking_limit: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      booking_limit_unit: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      notification_message_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      amenity_f_color: {
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
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('amenity');
  }
};
