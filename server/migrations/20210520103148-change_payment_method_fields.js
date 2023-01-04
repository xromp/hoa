'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('payment_method', 'isDefault', { 
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    });
    await queryInterface.changeColumn('payment_method', 'createdAt', { 
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
    await queryInterface.changeColumn('payment_method', 'updatedAt', { 
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
  }
};
