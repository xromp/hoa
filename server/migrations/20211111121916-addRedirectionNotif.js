'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn('notification', 'redirect_url', {
			after: 'message',
			type: Sequelize.TEXT,
			allowNull: true,
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn('notification', 'redirect_url');
	},
};
