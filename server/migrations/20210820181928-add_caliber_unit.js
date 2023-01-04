'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('caliber_unit', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      caliber_unit_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      unit_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'unit',
          key: 'id'
        }
      },
      last_modified: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      last_modified_by: {
        type: Sequelize.ENUM('caliber', 'AXP'),
        allowNull: false,
      },
      audit_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.dropTable('caliber_unit');
  }
};
