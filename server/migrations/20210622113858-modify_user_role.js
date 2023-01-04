'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn('user_role', 'user_role_default_id', { 
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('user_role', 'permission', { 
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.changeColumn('user_role', 'createdAt', { 
      after: 'permission',
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.changeColumn('user_role', 'parent_id', { 
      after: 'id',
      type: Sequelize.INTEGER,
      allowNull: true
    });  
    await queryInterface.changeColumn('user_role', 'pmc_id', { 
      after: 'parent_id',
      type: Sequelize.INTEGER,
      allowNull: true
    });    
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('user_role', 'user_role_default_id');
    await queryInterface.removeColumn('user_role', 'permission');
  }
};
