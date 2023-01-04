'use strict';

const data = [
  {"id":"1","name":"New Unassigned","val":"new_unassigned","createdAt":"0000-00-00","updatedAt":null},
  {"id":"2","name":"Work Scheduled","val":"work_scheduled","createdAt":"2018-12-06","updatedAt":null},
  {"id":"3","name":"Under Review","val":"under_review","createdAt":"2018-12-06","updatedAt":null},
  {"id":"4","name":"On Hold","val":"on_hold","createdAt":"2018-12-06","updatedAt":null},
  {"id":"5","name":"Assigned Not Started","val":"assigned_not_started","createdAt":"2018-12-06","updatedAt":null},
  {"id":"6","name":"Work Started","val":"work_started","createdAt":"2018-12-06","updatedAt":null},
  {"id":"7","name":"Late","val":"late","createdAt":"2018-12-06","updatedAt":null},
  {"id":"8","name":"Completed","val":"completed","createdAt":"2018-12-06","updatedAt":"2021-03-24"},
  {"id":"9","name":"Completed(Vendor Work Completed)","val":"completed_vendor","createdAt":"2018-12-06","updatedAt":null},
  {"id":"10","name":"Closed - No Work Done","val":"closed_no_work","createdAt":"2018-12-06","updatedAt":null},
  {"id":"11","name":"Open","val":"open","createdAt":"2020-12-01","updatedAt":null},
  {"id":"12","name":"Requested","val":"requested","createdAt":"2021-03-24","updatedAt":"2021-03-24"},
  {"id":"13","name":"Assigned","val":"assigned","createdAt":"2021-03-24","updatedAt":"2021-03-24"},
  {"id":"14","name":"Closed","val":"closed","createdAt":"2021-03-24","updatedAt":"2021-03-24"},
  {"id":"15","name":"Out for RFP","val":"out_for_rfp","createdAt":"2021-04-23","updatedAt":"2021-04-23"},
  {"id":"16","name":"Reopen","val":"reopen","createdAt":"2021-04-23","updatedAt":"2021-04-23"},
  {"id":"17","name":"RFP Review","val":"out_for_rfp_review","createdAt":"0000-00-00","updatedAt":null},
  {"id":"18","name":"RFP Decline","val":"out_for_rfp_decline","createdAt":"0000-00-00","updatedAt":null},
  {"id":"19","name":"RFP Submitted","val":"out_for_rfp_submitted","createdAt":"0000-00-00","updatedAt":null}
]; 

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('m_request_status', data, {
      fields: ['id'],
      ignoreDuplicates: true
     });  
  },

  down: async (queryInterface, { Op }) => {
    return queryInterface.bulkDelete('m_request_status', {id: {[Op.in]: data.map(({ id }) => id)}}, {});  
  }
};