'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('user', 'property_id', { 
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.changeColumn('user', 'pmc_id', { 
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('user', 'property_id', { 
      type: Sequelize.INTEGER,
      allowNull: false
    });
    await queryInterface.changeColumn('user', 'pmc_id', { 
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};
