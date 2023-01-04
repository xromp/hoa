'use strict';

const data = [
  {"id":1, "parent_document_folder_id":0, "name":"docs", "val":"docs", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":2, "parent_document_folder_id":1, "name":"user", "val":"user", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":3, "parent_document_folder_id":2, "name":"avatar", "val":"avatar", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":4, "parent_document_folder_id":1, "name":"maintenance_request", "val":"maintenance_request", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":5, "parent_document_folder_id":4, "name":"gallery", "val":"gallery", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":6, "parent_document_folder_id":1, "name":"maintenance_equipment", "val":"maintenance_equipment", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":7, "parent_document_folder_id":6, "name":"avatar", "val":"avatar", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":8, "parent_document_folder_id":6, "name":"gallery", "val":"gallery", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":9, "parent_document_folder_id":1, "name":"maintenance_component", "val":"maintenance_component", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":10, "parent_document_folder_id":9, "name":"avatar", "val":"avatar", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":11, "parent_document_folder_id":9, "name":"gallery", "val":"gallery", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":12, "parent_document_folder_id":1, "name":"service_provider", "val":"service_provider", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":13, "parent_document_folder_id":12, "name":"avatar", "val":"avatar", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":14, "parent_document_folder_id":12, "name":"bl", "val":"bl", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":15, "parent_document_folder_id":12, "name":"il", "val":"il", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":16, "parent_document_folder_id":12, "name":"ol", "val":"ol", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},

  {"id":17, "parent_document_folder_id":1, "name":"maintenance_proposal", "val":"maintenance_proposal", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":18, "parent_document_folder_id":17, "name":"gallery", "val":"gallery", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":19, "parent_document_folder_id":1, "name":"maintenance_order", "val":"maintenance_order", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":20, "parent_document_folder_id":19, "name":"gallery", "val":"gallery", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":21, "parent_document_folder_id":1, "name":"notification", "val":"notification", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":22, "parent_document_folder_id":21, "name":"gallery", "val":"gallery", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":23, "parent_document_folder_id":1, "name":"notification_template", "val":"notification_template", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":24, "parent_document_folder_id":23, "name":"gallery", "val":"gallery", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":25, "parent_document_folder_id":1, "name":"property", "val":"property", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":26, "parent_document_folder_id":25, "name":"avatar", "val":"avatar", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":27, "parent_document_folder_id":25, "name":"code", "val":"code", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":28, "parent_document_folder_id":1, "name":"unit", "val":"unit", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":29, "parent_document_folder_id":28, "name":"avatar", "val":"avatar", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""},
  {"id":30, "parent_document_folder_id":28, "name":"gallery", "val":"gallery", "property_id":"0", "is_deleted":0, "pmc_id":0, "permissions_json":"", "unit_id":0, "prop_permissions_json":""}
];  

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkInsert('document_folder', data, {
       fields: ['id'],
       ignoreDuplicates: true
      });
  },
  
  down: async (queryInterface, { Op }) => {
    return queryInterface.bulkDelete('document_folder', {id: {[Op.in]: data.map(({ id }) => id)}}, {});
  }
};
