'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('bill_type', 'user_id', 'created_by', { 
      after: 'createdAt',
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('bill_type', 'user_id', 'created_by', { 
      after: 'createdAt',
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};
