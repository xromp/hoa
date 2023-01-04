'use strict';

const data = [
  {"id":1, "name":"Move In Fees"},
  {"id":2, "name":"Document Fees"},
  {"id":3, "name":"HOA Fees"},
  {"id":4, "name":"Reservation Fees"},
  {"id":5, "name":"Late Fees"},
  {"id":6, "name":"Association Fees"},
  {"id":7, "name":"Violation Fees"},
  {"id":8, "name":"Service Fee"},
  {"id":9, "name":"Maintenance Fee"},
  {"id":10, "name":"Other Fees"},
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('bill_type', data, {
      fields: ['id'],
      ignoreDuplicates: true
     });  },

  down: async (queryInterface, { Op }) => {
    return queryInterface.bulkDelete('bill_type', {id: {[Op.in]: data.map(({ id }) => id)}}, {});  }
};
