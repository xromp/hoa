'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('maintenance_order', 'is_assigned', { 
      after: 'other_notes',
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    });
    await queryInterface.addColumn('maintenance_order', 'preferred_timing', { 
      after: 'is_assigned',
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn('maintenance_request', 'is_assigned', { 
      after: 'other_notes',
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    });
    await queryInterface.addColumn('maintenance_request', 'preferred_timing', { 
      after: 'is_assigned',
      type: Sequelize.TEXT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('maintenance_order', 'is_assigned');
    await queryInterface.removeColumn('maintenance_order', 'preferred_timing');
    await queryInterface.removeColumn('maintenance_request', 'is_assigned');
    await queryInterface.removeColumn('maintenance_request', 'preferred_timing');
  }
};
