'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('notification', 'property_id', { 
      after: 'id',
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('notification', 'notification_template_id', { 
      after: 'property_id',
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('notification', 'title', { 
      after: 'notification_template_id',
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn('notification', 'message', { 
      after: 'title',
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('notification', 'property_id');
    await queryInterface.removeColumn('notification', 'notification_template_id');    
    await queryInterface.removeColumn('notification', 'title');
    await queryInterface.removeColumn('notification', 'message');
  }
};
