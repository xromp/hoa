'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('transaction_line_v2', 'ref', { 
      after: 'trans_account_id',
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('transaction_line_v2', 'posting_date', { 
      after: 'transaction_id',
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('transaction_line_v2', 'ref');
    await queryInterface.removeColumn('transaction_line_v2', 'posting_date');
  }
};