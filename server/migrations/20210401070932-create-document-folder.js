'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('document_folder', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      parent_document_folder_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      property_id: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      is_deleted: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: '0'
      },
      pmc_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      permissions_json: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      unit_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      prop_permissions_json: {
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
    await queryInterface.dropTable('document_folder');
  }
};