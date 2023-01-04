'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`UPDATE document SET is_deleted=false WHERE is_deleted IS NULL`);
    return await queryInterface.changeColumn('document', 'is_deleted', {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
      allowNull: false,
    });
  
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
