'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.changeColumn('bill_type', 'insight_tag', {
			type: Sequelize.STRING,
			allowNull: true,
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.changeColumn('bill_type', 'insight_tag', {
			type: Sequelize.STRING,
			allowNull: false,
		});
	},
};
