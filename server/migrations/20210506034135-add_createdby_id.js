'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('bill', 'createdby_id', { 
      after: 'invoice_no',
      type: Sequelize.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('bill', 'createdby_id');
  }
};
