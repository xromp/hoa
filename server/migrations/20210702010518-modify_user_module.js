'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_module', 'is_maintenance', { 
      after: 'is_active',
      defaultValue: 0,
      type: Sequelize.BOOLEAN,
      allowNull: true
    });
    await queryInterface.sequelize.query(`UPDATE user_module SET is_maintenance=false WHERE is_maintenance IS NULL`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user_module', 'is_maintenance');
  }
};
