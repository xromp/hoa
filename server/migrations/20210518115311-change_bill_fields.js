'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('bill', 'ledger_type', {
      after: 'unit_resident_id',
      type: Sequelize.ENUM('AP', 'AR'),
    });
    await queryInterface.addColumn('bill', 'paid', {
      after: 'ledger_type',
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.renameColumn('bill', 'amount', 'total_amount')
    await queryInterface.removeColumn('bill', 'bill_type_id');
    await queryInterface.removeColumn('bill', 'description');

    await queryInterface.removeColumn('bill', 'status');
    await queryInterface.removeColumn('bill', 'createdAt');
    await queryInterface.removeColumn('bill', 'updatedAt');
    await queryInterface.removeColumn('bill', 'unit_resident_id');
    
    await queryInterface.addColumn('bill', 'createdAt', {
      after: 'createdby_id',
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
    await queryInterface.addColumn('bill', 'updatedAt', {
      after: 'createdAt',
      type: Sequelize.DATE,
      allowNull: true
    });
    
  },

  down: async (queryInterface, Sequelize) => {
  }
};
