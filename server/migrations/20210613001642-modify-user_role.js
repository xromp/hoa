'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('user_role', 'slug', { 
      after: 'val',
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.changeColumn('user_role', 'pmc_id', { 
      after: 'property_id',
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: true
    });
    await queryInterface.changeColumn('user_role', 'description', { 
      after: 'name',
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.changeColumn('user_role', 'createdAt', { 
      after: 'access_level',
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.sequelize.query(`UPDATE user_role SET pmc_id=0 WHERE pmc_id IS NULL`);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('user_role', 'slug');
  }
};
