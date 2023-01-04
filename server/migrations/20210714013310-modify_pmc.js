'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('pmc', 'is_deleted', { 
      type: Sequelize.TINYINT(1),
      allowNull: true
    });
    await queryInterface.sequelize.query(`UPDATE pmc SET is_deleted=false WHERE is_deleted IS NULL`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('pmc', 'is_deleted');
  }
};
