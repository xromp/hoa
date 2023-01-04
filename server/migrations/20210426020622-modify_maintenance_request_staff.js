'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.removeColumn('maintenance_request_staff', 'due_date'),
      queryInterface.removeColumn('maintenance_request_staff', 'due_time'),
      queryInterface.removeColumn('maintenance_request_staff', 'instructions'),
      queryInterface.changeColumn('maintenance_request_staff', 'status', {
        type: Sequelize.INTEGER(),
        defaultValue: 0,
        allowNull: true,
      }),
      queryInterface.sequelize.query(`UPDATE maintenance_request_staff SET status=0 WHERE status IS NULL`)
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.changeColumn('maintenance_request_staff', 'status', {
        type: Sequelize.TEXT(),
        allowNull: true,
      }),
      queryInterface.addColumn('maintenance_request_staff', 'instructions', {
        type: Sequelize.TEXT(),
        allowNull: true,
      }),
      queryInterface.addColumn('maintenance_request_staff', 'due_date', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.addColumn('maintenance_request_staff', 'due_time', {
        type: Sequelize.DATE,
        allowNull: true,
      }),

    ]);
  }
};
