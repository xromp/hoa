'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn('maintenance_order', 'issued_by_id',
        {
          type: Sequelize.INTEGER(),
          allowNull: true
        },
      ),
      queryInterface.addColumn('maintenance_order', 'rfp_issue_date',
        {
          type: Sequelize.DATE(),
          allowNull: true
        },
      ),
      queryInterface.addColumn('maintenance_order', 'send_question_date',
        {
          type: Sequelize.DATE(),
          allowNull: true
        },
      ),
      queryInterface.addColumn('maintenance_order', 'rfp_due_date',
        {
          type: Sequelize.DATE(),
          allowNull: true
        },
      ),
      queryInterface.addColumn('maintenance_order', 'decision_date',
        {
          type: Sequelize.DATE(),
          allowNull: true
        },
      ),
      queryInterface.addColumn('maintenance_order', 'questions_to_vendor',
        {
          type: Sequelize.TEXT(),
          allowNull: true
        },
      ),
      queryInterface.addColumn('maintenance_order', 'qoutation',
        {
          type: Sequelize.TEXT(),
          allowNull: true
        },
      ),
      queryInterface.addColumn('maintenance_order', 'availability',
        {
          type: Sequelize.TEXT(),
          allowNull: true
        },
      ),
      queryInterface.addColumn('maintenance_order', 'other_comments',
        {
          type: Sequelize.TEXT(),
          allowNull: true
        },
      ),
      queryInterface.addColumn('maintenance_order', 'is_submitted',
        {
          type: Sequelize.TINYINT(1),
          defaultValue: 0,
          allowNull: true
        },
      ),
      queryInterface.addColumn('maintenance_order', 'rfp_recipients',
        {
          type: Sequelize.TEXT,
          allowNull: true
        },
      ),
      queryInterface.addColumn('maintenance_order', 'other_notes',
        {
          type: Sequelize.TEXT,
          defaultValue: 0,
          allowNull: true
        },
      ),
      queryInterface.changeColumn('maintenance_order', 'createdAt', {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        after: 'other_notes'
      }),
      queryInterface.changeColumn('maintenance_order', 'updatedAt', {
        type: Sequelize.DATE,
        allowNull: true,
        after: 'createdAt'
      }),
      queryInterface.changeColumn('maintenance_order', 'request_to', {
        type: Sequelize.INTEGER,
        allowNull: true,
      })
    ]);     
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeColumn('maintenance_order', 'issued_by_id'),
      queryInterface.removeColumn('maintenance_order', 'rfp_issue_date'),
      queryInterface.removeColumn('maintenance_order', 'send_question_date'),
      queryInterface.removeColumn('maintenance_order', 'rfp_due_date'),
      queryInterface.removeColumn('maintenance_order', 'decision_date'),
      queryInterface.removeColumn('maintenance_order', 'questions_to_vendor'),
      queryInterface.removeColumn('maintenance_order', 'qoutation'),
      queryInterface.removeColumn('maintenance_order', 'availability'),
      queryInterface.removeColumn('maintenance_order', 'other_comments'),
      queryInterface.removeColumn('maintenance_order', 'is_submitted'),
      queryInterface.removeColumn('maintenance_order', 'rfp_recipients'),
      queryInterface.removeColumn('maintenance_order', 'other_notes'),
      queryInterface.changeColumn('maintenance_order', 'request_to', {
        type: Sequelize.TEXT
      })
    ]); 
  }
};
