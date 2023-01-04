'use strict';

const data = [
  {"id":1, "name":"Dashboard", "is_active":true, "val":"dashboard-analytics"},
  {"id":4, "name":"Users", "is_active":true, "val":"user"},
  {"id":5, "name":"Role", "is_active":true, "val":"role"},
  {"id":6, "name":"Maintenance Request", "is_active":false, "val":"maintenance"},
  {"id":7, "name":"Maintenance Equipment", "is_active":false, "val":"equipment"},
  {"id":8, "name":"Maintenance Thread", "is_active":false, "val":"thread"},
  {"id":9, "name":"Maintenance Component", "is_active":false, "val":"component"},
  {"id":10, "name":"Maintenance Vendor", "is_active":false, "val":"vendor"},
  {"id":11, "name":"Billing List", "is_active":true, "val":"billing"},
  {"id":12, "name":"Accounting Reports", "is_active":true, "val":"caliber-report"},
  {"id":13, "name":"Accounting Invoice", "is_active":false, "val":"caliber-invoice"},
  {"id":14, "name":"Accounting Financials", "is_active":false, "val":"caliber-financial"},
  {"id":15, "name":"Logout", "is_active":false, "val":"logout"},
  {"id":16, "name":"Chat", "is_active":false, "val":"chat"},
  {"id":17, "name":"Reservation Calendar", "is_active":true, "val":"reservation-calendar"},
  {"id":18, "name":"Portfolio", "is_active":true, "val":"portfolio"},
  {"id":19, "name":"Property", "is_active":true, "val":"property"},
  {"id":20, "name":"Unit", "is_active":true, "val":"unit"},
  {"id":21, "name":"Amenities", "is_active":true, "val":"amenity"},
  {"id":22, "name":"Zones", "is_active":false, "val":"zone"},
  {"id":23, "name":"Notification Template", "is_active":true, "val":"notification-template"},
  {"id":24, "name":"Maintenance Parts", "is_active":false, "val":"part"},
  {"id":25, "name":"Maintenance Work Order", "is_active":true, "val":"order"},
  {"id":26, "name":"Notification", "is_active":true, "val":"notification"},
  {"id":27, "name":"Notification Sent", "is_active":false, "val":"notification-sent"},
  {"id":28, "name":"Accounting Client", "is_active":true, "val":"caliber-client"},
  {"id":29, "name":"User Profile", "is_active":true, "val":"user-profile"},
  {"id":30, "name":"Reservation List", "is_active":true, "val":"reservation"},
  {"id":31, "name":"Management", "is_active":true, "val":"management"},
  {"id":32, "name":"File Manager", "is_active":true, "val":"file-manager"}
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('user_module', data, {
      fields: ['id'],
      ignoreDuplicates: true
     });  },

  down: async (queryInterface, { Op }) => {
    return queryInterface.bulkDelete('user_module', {id: {[Op.in]: data.map(({ id }) => id)}}, {});  }
};
