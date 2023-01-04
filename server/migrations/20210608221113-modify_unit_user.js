'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('unit_user', 'name');
    await queryInterface.removeColumn('unit_user', 'notes');
    await queryInterface.removeColumn('unit_user', 'avatar_filename');
    await queryInterface.removeColumn('unit_user', 'user_type');
    await queryInterface.changeColumn('unit_user', 'user_id', { 
      after: 'unit_id',
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
    await queryInterface.addColumn('unit_user', 'name', { 
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn('unit_user', 'notes', { 
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn('unit_user', 'avatar_filename', { 
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn('unit_user', 'user_type', { 
      type: Sequelize.TEXT,
      allowNull: true
    });
  }
};
