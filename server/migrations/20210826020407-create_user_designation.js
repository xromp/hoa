'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_designation', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      pmc_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      property_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      d_maintenance: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      d_reservation: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      d_bulletin: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
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
    await queryInterface.dropTable('user_designation');
  }
};
