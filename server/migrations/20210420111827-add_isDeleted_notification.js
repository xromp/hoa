'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('notification', 'is_deleted', { 
      after: 'is_seen',
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('notification', 'is_deleted');
  }
};
