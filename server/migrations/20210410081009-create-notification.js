'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notification', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      notification_message_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      is_seen: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: '0'
      },
      is_delivered: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: '0'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
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
     await queryInterface.dropTable('notification');
  }
};
