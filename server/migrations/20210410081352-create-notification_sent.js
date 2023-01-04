'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notification_sent', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      notification_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      is_seen: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: '0'
      },
      account_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      is_delivered: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: '0'
      },
      message: {
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
    await queryInterface.dropTable('notification_sent');
  }
};
