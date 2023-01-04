'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('amenity_reservation_detail', 'amenity_id', { 
      after: 'id',
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('amenity_reservation_detail', 'unit_resident_id', { 
      after: 'amenity_reservation_id',
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('amenity_reservation_detail', 'people', { 
      after: 'unit_resident_id',
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('amenity_reservation_detail', 'comments', { 
      after: 'people',
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn('amenity_reservation_detail', 'status', { 
      after: 'comments',
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('amenity_reservation_detail', 'user_id', { 
      after: 'status',
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('amenity_reservation_detail', 'is_seen', { 
      after: 'user_id',
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
      allowNull: true
    });
    await queryInterface.addColumn('amenity_reservation_detail', 'unit_id', { 
      after: 'is_seen',
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('amenity_reservation_detail', 'rejection_reason', { 
      after: 'unit_id',
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn('amenity_reservation_detail', 'internal_comments', { 
      after: 'rejection_reason',
      type: Sequelize.TEXT,
      allowNull: true
    });    
    await queryInterface.addColumn('amenity_reservation_detail', 'startDate', { 
      after: 'internal_comments',
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('amenity_reservation_detail', 'endDate', { 
      after: 'startDate',
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('amenity_reservation_detail', 'title', { 
      after: 'endDate',
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn('amenity_reservation_detail', 'label', { 
      after: 'title',
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn('amenity_reservation_detail', 'classes', { 
      after: 'label',
      type: Sequelize.TEXT,
      allowNull: true
    });    
    await queryInterface.addColumn('amenity_reservation_detail', 'style', { 
      after: 'classes',
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn('amenity_reservation_detail', 'is_block', { 
      after: 'style',
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
      allowNull: true
    });
    await queryInterface.addColumn('amenity_reservation_detail', 'block_reason', { 
      after: 'is_block',
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn('amenity_reservation_detail', 'is_buffer', { 
      after: 'block_reason',
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
      allowNull: true
    }); 
    await queryInterface.addColumn('amenity_reservation_detail', 'is_all_day', { 
      after: 'is_buffer',
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
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
    await queryInterface.removeColumn('amenity_reservation_detail', 'unit_resident_id');
    await queryInterface.removeColumn('amenity_reservation_detail', 'people');
    await queryInterface.removeColumn('amenity_reservation_detail', 'comments');
    await queryInterface.removeColumn('amenity_reservation_detail', 'status');
    await queryInterface.removeColumn('amenity_reservation_detail', 'user_id');
    await queryInterface.removeColumn('amenity_reservation_detail', 'is_seen');
    await queryInterface.removeColumn('amenity_reservation_detail', 'unit_id');
    await queryInterface.removeColumn('amenity_reservation_detail', 'rejection_reason');
    await queryInterface.removeColumn('amenity_reservation_detail', 'internal_comments');
    await queryInterface.removeColumn('amenity_reservation_detail', 'startDate');
    await queryInterface.removeColumn('amenity_reservation_detail', 'endDate');
    await queryInterface.removeColumn('amenity_reservation_detail', 'title');
    await queryInterface.removeColumn('amenity_reservation_detail', 'label');
    await queryInterface.removeColumn('amenity_reservation_detail', 'classes');
    await queryInterface.removeColumn('amenity_reservation_detail', 'style');
    await queryInterface.removeColumn('amenity_reservation_detail', 'is_block');
    await queryInterface.removeColumn('amenity_reservation_detail', 'block_reason');
    await queryInterface.removeColumn('amenity_reservation_detail', 'is_buffer');
    await queryInterface.removeColumn('amenity_reservation_detail', 'is_all_day');
  }
};
