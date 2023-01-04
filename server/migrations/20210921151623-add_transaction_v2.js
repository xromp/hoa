'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transaction_line_v2',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      balance: {
        type: Sequelize.DECIMAL,
        allowNull: true
      },
      unit_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      account_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      trans_account_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      caliberObj: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transaction_line_v2');
  }
};
