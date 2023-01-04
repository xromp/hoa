'use strict';

const data = [
  { "name": "Approvals", "is_active": true, "val":"approval"}
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('user_module', data, {
      fields: ['val'],
      ignoreDuplicates: true
     });  },

  down: async (queryInterface, { Op }) => {
    return queryInterface.bulkDelete('user_module', {val: {[Op.in]: data.map(({ val }) => val)}}, {});  }
};

