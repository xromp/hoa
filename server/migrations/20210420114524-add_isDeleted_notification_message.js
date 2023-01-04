'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('notification_message', 'is_deleted', { 
      after: 'message',
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('notification_message', 'is_deleted');
  }
};
