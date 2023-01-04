'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('gateway_log', 
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      }, 
      data: {
        type: Sequelize.TEXT,
        allowNull: true
      }, 
      gateway: {
        type: Sequelize.STRING,
        allowNull: true
      },
      transaction_log_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      result: {
        type: Sequelize.TEXT,
        allowNull: true
      },  
      resultDetail: {
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
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('gateway_log');
  }
};
