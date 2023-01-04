'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('notification', 'is_automated', { 
      after: 'is_delivered',
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('notification', 'is_automated');
  }
};