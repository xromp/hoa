'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('user_org_role', 'property_id', { 
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('user_org_role', 'property_id', { 
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
