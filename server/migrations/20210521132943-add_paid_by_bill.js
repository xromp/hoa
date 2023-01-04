'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('transaction_log', 'paid_by', { 
      after: 'amount',
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('transaction_log', 'paid_by');
  }
};
