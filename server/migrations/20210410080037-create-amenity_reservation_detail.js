'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('amenity_reservation_detail', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      amenity_reservation_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      property_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      amenity_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      from_time: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      to_time: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      from_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      to_date: {
        type: Sequelize.DATEONLY,
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
    await queryInterface.dropTable('amenity_reservation_detail');
  }
};
