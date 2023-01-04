const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const emailTemplate = require('./utils/email-template')
const MaintenanceRequest = require('../models/maintenance_request')
const Building = require('../models/building')
const MaintenanceType = require('../models/maintenance_type')
const Property = require('../models/property')
const PropertyManager = require('../models/property_manager')
const User = require('../models/user')
const VendorCategory = require('../models/vendor_category_master')
const Vendor = require('../models/vendor')
const Unit = require('../models/unit')
const UnitResident = require('../models/unit_resident')
const Thread = require('../models/maintenance_request_thread')
const RequestStatus = require('../models/m_request_status')
const UserRole = require('../models/user_role')
const MaintenanceRequestVendor = require('../models/maintenance_request_vendor')
const MaintenanceRequestStaff  = require('../models/maintenance_request_staff')
const VendorUser = require('../models/vendor_user')
const MaintenanceStaff  = require('../models/maintenance_staff')
const MaintenanceDt = require('../models/maintenance_request_dt')
const Approval = require('../models/approval')
const ApprovalItem = require('../models/approval_item')
const pushNotif = require('../controllers/push_notif')
const mailController = require('../controllers/mail')
const mainController = require('../controllers/main')
const notificationController = require('../controllers/notification.controller');
const { getMaintenanceOrder, createUniqueNo } = require('./maintenance_order.controller');

MaintenanceRequest.belongsTo(MaintenanceType, {targetKey:'id',foreignKey: 'maintenance_type_id'})
MaintenanceRequest.belongsTo(Building, {targetKey:'id',foreignKey: 'building_id'})
MaintenanceRequest.belongsTo(Property, {targetKey:'id',foreignKey: 'property_id'})
MaintenanceRequest.belongsTo(User, {targetKey:'id',foreignKey: 'user_id'})
MaintenanceRequest.belongsTo(VendorCategory, {targetKey:'id',foreignKey: 'vendor_category_id'})
MaintenanceRequest.belongsTo(Unit, {targetKey:'id',foreignKey: 'unit_id'})
MaintenanceRequest.belongsTo(UnitResident, {targetKey:'id',foreignKey: 'unit_resident_id'})
MaintenanceRequest.belongsTo(Vendor, {targetKey:'id',foreignKey: 'assigned_to'})
MaintenanceRequest.belongsTo(RequestStatus, {targetKey:'id',foreignKey: 'm_request_status_id'})
MaintenanceRequest.belongsTo(MaintenanceRequestVendor, {targetKey:'maintenance_request_id',foreignKey: 'id'})
MaintenanceRequest.belongsTo(MaintenanceRequestStaff, {targetKey:'maintenance_request_id',foreignKey: 'id'})
MaintenanceRequest.belongsTo(Approval, {targetKey:'reference_id',foreignKey: 'id'})
Approval.hasMany(ApprovalItem, { targetKey:'reference_id', foreignKey: 'approval_id' })
MaintenanceRequest.hasMany(MaintenanceDt, {foreignKey: 'maintenance_request_id'})
User.hasMany(VendorUser, {foreignKey: 'vendor_id'})

exports.getMaintenanceRequest = async (data) => {
  let result = []
  const userRole = await module.exports.findUserRole(data.decodedUserRoleId)
  const property = await module.exports.findPropertyByPropertyRef(data.headersPropertyRef)
  const vendor = await module.exports.findVendor(data.decodedId)
  data.propertyId = !property ? null : property['dataValues']['id']
  data.vendorId = !vendor ? null : vendor['dataValues']['vendor_id']
  let asAdmin = ['admin', 'parent', 'super', 'manager']

  if( asAdmin.includes(data.current_env.role_val) ) {
    result = await module.exports.findMaintenanceRequestByPropertyId(data.propertyId)
  } else {
    data.assignedTo = data.current_env.role_val === 'vendor' ? data.vendorId : data.decodedId
    result = await module.exports.findMaintenanceRequestByAssignedTo(data)
  }

  return result
}

exports.getMaintenanceRequestById = async (data) => {
  const result = await module.exports.findMaintenanceRequestById(data.paramsId)

  return result
}

exports.getMaintenanceRequestByOrderId = async (data) => {
  const result = await module.exports.findMaintenanceRequestByOrderId(data.paramsId, { user_id: data.decodedId })

  return result
}

exports.getMaintenanceRequestByStatusId = async (data) => {
  const result = await module.exports.findMaintenanceRequestByStatusId(data)
  
  return result  
}

exports.postMaintenanceRequest = async (data) => {  
  if (data.paramsId === -1) {
    const type = 'RFP'
    const assignedTo = data.rfp_recipients
    const property = await module.exports.findPropertyByPropertyRef(data.property_ref)
    data.propertyId = property['dataValues']['id']

    if (!!data.id) {
      await module.exports.destroyMaintenanceRequest(data.id)
    }

    for (const [key, value] of Object.entries(assignedTo)) {
      data.assigned_to = value
      data.request_no = await createUniqueNo({ property_id: data.propertyId, type })
      await module.exports.createMaintenanceRequest(data)
    }

    let userData = []
    let userEmails = []
    const vendor = await module.exports.findUserByVendorId(data.rfp_recipients)
    vendor.filter( async(res) => {
      if (res['dataValues'] !== null) {
        userData.push({
          userId: res['dataValues']['id'],
          userEmail: res['dataValues']['email']
        }) 

        userEmails.push(res['dataValues']['email'])
      }
    }) 

    data.notificationType = 'multiple'
    data.userId = null
    data.userEmail = null

    const d = {
      title: 'Maintenance Request',

      webBody: `A Request For Proposal from ${property['dataValues']['name']} has been broadcast. Check your list to bid`,
      mobileBody: `A Request For Proposal from ${property['dataValues']['name']} has been broadcast. Check your list to bid`,
      emailBody: `A Request For Proposal from ${property['dataValues']['name']} has been broadcast.<br> Sign in to bid`,
      propertyId: data.propertyId,
      decodedId: data.decodedId,
      send_by: data.decodedId,
      type: data.notificationType,
      userData: userData,
      user_id: data.userId,
      email: data.userEmail,
      emails: userEmails,
      updatedAt: new Date(),
      createdAt: new Date()
    }
    await notificationController.webMobileEmailNotification(d)

  } else {
    const requestStatus = await module.exports.findMaintenanceRequestStatus(data.m_request_status.val)
    data.m_request_status_id = requestStatus['dataValues']['id']
    await module.exports.updateMaintenanceRequest(data)
  }

  return {message:'success'}
}

exports.postMaintenanceRequestStatus = async (data) => {
  const requestStatus = await module.exports.findMaintenanceRequestStatus(data.m_request_status.val)
  data.requestStatusId = requestStatus['dataValues']['id']
  const result = await module.exports.updateMaintenanceRequestStatus(data)


  let userData = []
  let userEmails = []
  let name = data.vendor.business_name
  let statusMessage = (data.m_request_status.val === 'out_for_rfp_submitted') ? 'made an update and submitted the job.' :  (data.m_request_status.val === 'out_for_rfp_review') ? 'accepted the Work Order.' : 'declines the Work Order'
  const property = await module.exports.findPropertyByPropertyRef(data.property_ref)
  data.propertyId = property['dataValues']['id']

  property['dataValues']['property_managers'].filter( async(res) => {
    if (res['user'] !== null) {
      userData.push({
        userId: res['user']['id'],
        userEmail: res['user']['email']
      }) 

      userEmails.push(res['user']['email'])
    }
  }) 

  const d = {
    title: 'Maintenance Request',
    webBody: name + ' ' + statusMessage,
    mobileBody: name + ' ' + statusMessage,
    emailBody: name + ' ' + statusMessage,
    propertyId: data.propertyId,
    decodedId: data.decodedId,
    send_by: data.decodedId,
    type: 'multiple',
    userData,
    user_id: null,
    email: null,
    emails: userEmails,
    updatedAt: new Date(),
    createdAt: new Date()
  }
  await notificationController.webMobileEmailNotification(d)

  return result
}

exports.findMaintenanceRequestById = async (id) => {
  const result = await MaintenanceRequest.findOne({
    include: [
      { model: MaintenanceType },
      { model: Building },
      { model: Property },
      { model: User },
      { model: VendorCategory },
      { model: Unit },
      { model: UnitResident } ,
      { model: Vendor },
      { model: RequestStatus },
      { model: MaintenanceDt },
      { model: MaintenanceRequestVendor },
      { model: MaintenanceRequestStaff }
    ],    
    where: {
      id
    }
  })

  return result
}

exports.findMaintenanceRequestByOrderId = async (order_id, options = {}) => {
  const result = await MaintenanceRequest.findAll({
    include: [
      { model: MaintenanceType },
      { model: Building },
      { model: Property },
      { model: User },
      { model: VendorCategory },
      { model: Unit },
      { model: UnitResident } ,
      { model: Vendor },
      { model: RequestStatus },
      { model: MaintenanceDt },
      { model: MaintenanceRequestVendor },
      { model: MaintenanceRequestStaff },
      { model: Approval, 
        include: [ 
          { model: User },
          { 
            model: ApprovalItem,
            attributes: {
              include: [
                [Sequelize.literal('IF(`approval->approval_items`.`user_id` = '+ options.user_id +', 1, 0)'), 'is_self']
              ]
            },
            include: [ User ] 
          }
        ]
      },
    ],    
    where: {
      order_id
    },
    order: [
      ['id', 'DESC']
    ]
  })

  return result
}

exports.findMaintenanceRequestByStatusId = async (data) => {
  const result = await MaintenanceRequest.findAll({
    include: [
      { model: RequestStatus },
      { 
        model: MaintenanceRequestVendor,
        where: {
          vendor_id: data.decodedVendorId
        }
      },
    ],
    order: [
      ['id', 'DESC']
    ],
    where: {
      m_request_status_id: data.paramsId
    }  
  })

  return result
}

exports.findMaintenanceRequestByPropertyId = async (property_id) => {
  const result = await MaintenanceRequest.findAll({
    include: [
      { model: MaintenanceType },
      { model: Building },
      { model: Property },
      { model: User },
      { model: VendorCategory },
      { model: Unit },
      { model: UnitResident } ,
      { model: Vendor },
      { model: RequestStatus },
      { model: MaintenanceDt },
      { model: MaintenanceRequestVendor }
    ],    
    where: {
      property_id
    },
    order: [
      ['id', 'DESC']
    ]
  })

  return result
}

exports.findMaintenanceRequestByAssignedTo = async (data) => {
  const result = await MaintenanceRequest.findAll({
    include: [
      { model: MaintenanceType },
      { model: Building },
      { model: Property },
      { model: User },
      { model: VendorCategory },
      { model: Unit },
      { model: UnitResident } ,
      { model: Vendor },
      { 
        model: RequestStatus,
        where: {
          val: {
            [Op.or]: data.queryDataType
          }
        }
      }, 
      { model: MaintenanceDt },
      { model: MaintenanceRequestVendor },
      { model: MaintenanceRequestStaff }
    ],    
    where: {
      assigned_to: data.assignedTo
    },
    order: [
      ['id', 'DESC']
    ]
  })

  return result
}

exports.findPropertyByPropertyRef = async (ref) => {
  const result = await Property.findOne({
    include: [
      { 
        model: PropertyManager,
        include: [
          { model: User },
        ],          
      },
    ],
    where: {
      ref
    },
  })

  return result
}

exports.findUserRole = async (id) => {
  const result = await UserRole.findOne({
    where: {
      id
    }
  })

  return result
}

exports.findVendor = async (user_id) => {
  const result = await VendorUser.findOne({
    where: {
      user_id
    }
  })

  return result
}

exports.findUserByVendorId = async (vendor_id) => {
  const result = await User.findAll({
    include: [
      { 
        model: VendorUser,
        where: {vendor_id},
        include: [{model: Vendor}]
      },
    ],
    required: true,
    right: true,    
  })

  return result
}

exports.findMaintenanceRequestStatus = async (val) => {
  const result = await RequestStatus.findOne({   
    where: {
      val
    }
  })

  return result
}

exports.createMaintenanceRequest = async (data) => {
  const result = await MaintenanceRequest.create({
    unit_resident_id: data.decodedId,
    order_id: data.order_id,
    m_request_status_id: data.m_request_status_id,
    resolved_date: data.resolved_date,
    building_id: data.propertyId,
    location: data.location,
    maintenance_type_id: data.maintenance_type_id,
    urgency: data.urgency,
    title: data.title,
    description: data.description,
    image_filename: data.image_filename,
    m_type_other_value: data.m_type_other_value,
    assigned_to: data.assigned_to,
    assigned_to_type: data.assigned_to_type,
    rfp_type: data.rfp_type,
    vendor_category_id: data.vendor_category_id,
    user_id: data.decodedId,
    is_seen: data.is_seen,
    property_id: data.propertyId,
    unit_id: data.unit_id,
    start_time: data.start_time,
    end_time: data.end_time,
    start_date: data.start_date,
    end_date: data.end_date,
    eta_dt: data.eta_dt,
    notes: data.notes,
    request_no: data.request_no,
    overview: data.overview,
    scope: data.scope,
    request_to: data.request_to,
    vendor_email: data.vendor_email,
    direction: data.direction,
    issued_by_id: data.issued_by_id,
    rfp_issue_date: data.rfp_issue_date,
    send_question_date: data.send_question_date,
    rfp_due_date: data.rfp_due_date,
    decision_date: data.decision_date,
    questions_to_vendor: JSON.stringify(data.questions_to_vendor),
    qoutation: JSON.stringify(data.qoutation),
    availability: data.availability,
    other_comments: data.other_comments,
    is_submitted: data.is_submitted,
    rfp_recipients: JSON.stringify(data.rfp_recipients),
    other_notes: data.other_notes,
    preferred_timing: data.preferred_timing,
    is_assigned: data.is_assigned,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  })

  return result
}

exports.updateMaintenanceRequest = async (data) => {
  const result = await MaintenanceRequest.update({
    unit_resident_id: data.decodedId,
    m_request_status_id: data.m_request_status_id,
    resolved_date: data.resolved_date,
    building_id: data.propertyId,
    location: data.location,
    maintenance_type_id: data.maintenance_type_id,
    urgency: data.urgency,
    title: data.title,
    description: data.description,
    image_filename: data.image_filename,
    m_type_other_value: data.m_type_other_value,
    // assigned_to: JSON.stringify(data.assigned_to),
    assigned_to_type: data.assigned_to_type,
    rfp_type: data.rfp_type,
    vendor_category_id: data.vendor_category_id,
    // user_id: data.user_id,
    is_seen: data.is_seen,
    property_id: data.propertyId,
    unit_id: data.unit_id,
    start_time: data.start_time,
    end_time: data.end_time,
    start_date: data.start_date,
    end_date: data.end_date,
    eta_dt: data.eta_dt,
    notes: data.notes,
    request_no: data.request_no,
    overview: data.overview,
    scope: data.scope,
    request_to: data.request_to,
    vendor_email: data.vendor_email,
    direction: data.direction,
    issued_by_id: data.issued_by_id,
    rfp_issue_date: data.rfp_issue_date,
    send_question_date: data.send_question_date,
    rfp_due_date: data.rfp_due_date,
    decision_date: data.decision_date,
    questions_to_vendor: JSON.stringify(data.questions_to_vendor),
    qoutation: JSON.stringify(data.qoutation),
    total_qoutation: data.total_qoutation,
    availability: data.availability,
    other_comments: data.other_comments,
    is_submitted: data.is_submitted,
    rfp_recipients: JSON.stringify(data.rfp_recipients),
    other_notes: data.other_notes,
    preferred_timing: data.preferred_timing,
    is_assigned: data.is_assigned,
    submitted_date: data.submitted_date,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }, {
    where: {
      id: data.paramsId
    }
  })

  return result
}

exports.updateMaintenanceRequestStatus = async (data) => {
  const result = await MaintenanceRequest.update({
    m_request_status_id: data.requestStatusId
  }, {
    where: {
      id: data.paramsId
    }
  })

  return result
}

exports.updateForApprovalById = async ({ id, order_id, for_approval}) => {
  await MaintenanceRequest.update(
    { for_approval: false }, 
    { where: { order_id },
  });
  const response = await MaintenanceRequest.update(
    { for_approval }, 
    { where: { id },
  });

  return response;
}

exports.destroyMaintenanceRequest = async (order_id) => {
  const result = await MaintenanceRequest.destroy({
    where: {
      order_id
    }
  })

  return result
}