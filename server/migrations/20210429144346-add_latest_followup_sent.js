'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('approval_item', 'latest_followup_sent', { 
      after: 'completed_at',
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('approval_item', 'latest_followup_sent');
  }
};
