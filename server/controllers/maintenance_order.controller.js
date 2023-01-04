const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const emailTemplate = require('./utils/email-template')
const MaintenanceOrder = require('../models/maintenance_order')
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
const MaintenanceRequest = require('../models/maintenance_request')
const MaintenanceDt = require('../models/maintenance_request_dt')
const VendorUser = require('../models/vendor_user')
const pushNotif = require('../controllers/push_notif')
const mailController = require('../controllers/mail')
const mainController = require('../controllers/main')
const notificationController = require('../controllers/notification.controller');
const NotificationMessage = require('../models/notification_message')
const Notification = require('../models/notification')
const NotificationSent = require('../models/notification_sent')
const Approval = require('../models/approval')
const ApprovalItem = require('../models/approval_item')
const { notifyUser } = require('./notification.controller');
const UserOrgRole = require('../models/user_org_role')
const { getUserDesignationByPPO } = require('./user_designation.controller');

MaintenanceOrder.belongsTo(MaintenanceType, {targetKey:'id',foreignKey: 'maintenance_type_id'})
MaintenanceOrder.belongsTo(Building, {targetKey:'id',foreignKey: 'building_id'})
MaintenanceOrder.belongsTo(Property, {targetKey:'id',foreignKey: 'property_id'})
MaintenanceOrder.belongsTo(User, {targetKey:'id',foreignKey: 'user_id'})
MaintenanceOrder.belongsTo(VendorCategory, {targetKey:'id',foreignKey: 'vendor_category_id'})
MaintenanceOrder.belongsTo(Unit, {targetKey:'id',foreignKey: 'unit_id'})
MaintenanceOrder.belongsTo(UnitResident, {targetKey:'id',foreignKey: 'unit_resident_id'})
MaintenanceOrder.belongsTo(Vendor, {targetKey:'id',foreignKey: 'assigned_to'})
MaintenanceOrder.belongsTo(RequestStatus, {targetKey:'id',foreignKey: 'm_request_status_id'})
MaintenanceOrder.belongsTo(MaintenanceRequestVendor, {targetKey:'maintenance_request_id',foreignKey: 'id'})
MaintenanceOrder.belongsTo(MaintenanceRequestStaff, {targetKey:'maintenance_request_id',foreignKey: 'id'})
MaintenanceOrder.hasMany(MaintenanceDt, {foreignKey: 'maintenance_request_id'})
MaintenanceOrder.belongsTo(Approval, { targetKey:'reference_id', foreignKey: 'id' })
User.hasMany(VendorUser, {foreignKey: 'vendor_id'})
Approval.belongsTo(User, { targetKey:'id',foreignKey: 'createdby_id' })
Approval.hasMany(ApprovalItem, { targetKey:'reference_id', foreignKey: 'approval_id' })
ApprovalItem.belongsTo(User, { targetKey:'id',foreignKey: 'user_id' })
MaintenanceOrder.hasMany(MaintenanceRequest, {foreignKey: 'order_id'})
User.hasMany(UserOrgRole, { targetKey:'id',foreignKey: 'user_id' })
UserRole.belongsTo(UserOrgRole, { targetKey:'user_role_id',foreignKey: 'id' })
Property.belongsTo(UserOrgRole, { targetKey:'property_id',foreignKey: 'id' })

exports.getMaintenanceOrder = async (data) => {
  const userRole = await module.exports.findUserRole(data.role_id)
  const property = await module.exports.findPropertyByPropertyRef(data.property_ref)
  const vendor = await module.exports.findVendor(data.decodedId)
  data.vendorId = vendor === null ? null : vendor['dataValues']['vendor_id']
  data.propertyId = property['dataValues']['id']
  let result = []
  let asAdmin = ['admin', 'parent', 'super', 'manager']

  if( asAdmin.includes(userRole['dataValues']['val']) ) {
    result = await module.exports.findMaintenanceOrderByPropertyId(data.propertyId)
  } else if (userRole['dataValues']['val'] === 'staff' ) {   
    result = await module.exports.findMaintenanceOrderByStaffId(data.decodedId, data.propertyId)    
  } else if (userRole['dataValues']['val'] === 'vendor') {
    result = await module.exports.findMaintenanceOrderByVendorId(data)
  } else {
    result = await module.exports.findMaintenanceOrderByUserId(data.decodedId, data.propertyId)
  }

  return result
}

exports.getMaintenanceOrderById = async (data) => {
  const property = await module.exports.findPropertyByPropertyRef(data.property_ref)
  data.property_id = property['dataValues']['id']
  const result = await module.exports.findMaintenanceOrderById(data.paramsId, { ...data, user_id: data.decodedId, formType: data.formType })

  return result
}

exports.getManager = async (data) => {
  const property = await Property.findOne({
    where: {
      ref: data.property_ref
    }
  })

  let managers = await UserOrgRole.findAll({
    include: [
      { model: User },
      { 
        model: UserRole,
        where: {
          val: 'manager',
          parent_id: {
            [Op.ne]: 0
          },
        }          
      }        
    ],
    where: {
      pmc_id: data.parent_org_id,
      property_id: property.dataValues.id
    },
    required: true,
    right: true
  })

  return managers.map(({user})=>user)
}

exports.postMaintenanceOrder = async (data) => {
  const managers = await this.getManager(data)

  let maintenaceOrder = ''

  const property = await module.exports.findPropertyByPropertyRef(data.property_ref)
  data.propertyId = property['dataValues']['id']
  data.parentOrgId = data.parent_org_id
  data.designation_type = 'maintenance'

  const user_delegate_maintenance = await getUserDesignationByPPO(data)

  if(data.paramsId == -1) {
    const type = 'MTR'
    data.request_no = await this.createUniqueNo({ property_id: data.propertyId, type })
    maintenaceOrder = await module.exports.createMaintenanceOrder(data)

    let userData = []
    let userEmails = []

    if (user_delegate_maintenance.length > 0) {
      user_delegate_maintenance.filter( async(res) => {
        if (res !== null) {
          userData.push({
            userId: res['id'],
            userEmail: res['email']
          }) 

          userEmails.push(res['email'])
        }
      }) 
    } else {
      managers.filter( async(res) => {
        if (res !== null) {
          userData.push({
            userId: res['id'],
            userEmail: res['email']
          }) 

          userEmails.push(res['email'])
        }
      }) 
    }

    const d = {
      title: 'Maintenance Request',
      webBody: 'You have a new maintenance request. Click here.',
      mobileBody: 'You have a new maintenance request. Click here.',
      emailBody: 'You have a new maintenance request. Click here.',
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
  } else {
    maintenaceOrder = await module.exports.updateMaintenanceOrder(data)
  }
  
  return {message:'success', result:maintenaceOrder}
}

exports.notifyTenant = async (data) => {
  const tenant = await module.exports.findUserById(data.user_id)    
  const tenant_notificationData = {
    title: 'Maintenance Request',
    webBody: data.messageToTenant,
    mobileBody: data.messageToTenant,
    emailBody: data.messageToTenant,
    propertyId: data.propertyId,
    decodedId: data.decodedId,
    send_by: data.decodedId,
    type: 'single',
    userData: null,
    user_id: tenant.id,
    email: tenant.email,
    emails: null,
    updatedAt: new Date(),
    createdAt: new Date()
  } 

  await notificationController.webMobileEmailNotification(tenant_notificationData) 
}

exports.notifyAssignee = async (data) => {
  const notificationData = {
    title: 'Maintenance Request',
    webBody: data.webBody,
    mobileBody: data.mobileBody,
    emailBody: data.emailBody,
    propertyId: data.propertyId,
    decodedId: data.decodedId,
    send_by: data.decodedId,
    type: data.notificationType,
    userData: data.userData,
    user_id: data.userId,
    email: data.userEmail,
    emails: data.userEmails,
    updatedAt: new Date(),
    createdAt: new Date()
  }
  await notificationController.webMobileEmailNotification(notificationData)
}


exports.postMaintenanceOrderAssign = async (data) => {
  try {
    data.createdAt = new Date(data.createdAt)
    data.maintenaceOrderId = data.id

    let requestStatus = []
    let property = []

    await module.exports.destroyMaintenanceRequestStaff(data.paramsId)
    await module.exports.destroyMaintenanceRequestVendor(data.maintenaceOrderId)
    requestStatus = await module.exports.findMaintenanceRequestStatus('assigned')
    data.m_request_status_id = requestStatus['dataValues']['id']

    property = await module.exports.findPropertyByPropertyRef(data.property_ref)
    data.propertyId = property['dataValues']['id']

    if(parseInt(data.assigned_to_type) == 1) {
      await module.exports.createMaintenanceRequestStaff(data)

      const user = await module.exports.findUserById(data.assigned_to)    
      data.notificationType = 'single'
      data.userId = user['dataValues']['id']
      data.userEmail = user['dataValues']['email']
      data.userFullName = user['dataValues']['first_name']
      data.webBody = `A work order: ${data.title} has been assigned to you, click here to view`
      data.mobileBody = `A work order: ${data.title} has been assigned to you, click here to view`
      data.emailBody = `A work order: ${data.title} has been assigned to you.<br> Sign in to view`
      await this.notifyAssignee(data)

      data.messageToTenant = `Your work order is being attended to by Staff Member ${data.userFullName}`
      await this.notifyTenant(data)      
    } else {
      data.vendorId = data.assigned_to
      await module.exports.createMaintenanceRequestVendor(data)
      
      data.userData = []
      data.userEmails = []
      const userVendor = await module.exports.findUserByVendorId(data.assigned_to)
      userVendor.filter( async(res) => {
        if (res['dataValues'] !== null) {
          data.userData.push({
            userId: res['dataValues']['id'],
            userEmail: res['dataValues']['email']
          }) 

          data.userEmails.push(res['dataValues']['email'])
        }
      }) 

      data.notificationType = 'multiple'
      data.userId = null
      data.userEmail = null
      data.webBody = `Congratulations, you have been selected by ${property['dataValues']['name']} to begin Work Order ${data.request_no}, check your list to manage`
      data.mobileBody = `Congratulations, you have been selected by ${property['dataValues']['name']} to begin Work Order ${data.request_no}, singin here to manage`
      data.emailBody = `Congratulations, you have been selected by ${property['dataValues']['name']} to begin Work Order ${data.request_no}, singin here to manage`      
      await this.notifyAssignee(data)
      
      data.messageToTenant = `Your work order has been assigned to Service Provider ${userVendor[0]['vendor']['business_name']}. If a site visit is required your manager will be in touch with you to set a date according to the Availability you submitted with your request`
      await this.notifyTenant(data)

      data.messageToTenant = `Date and Time of site visit will be on ${data.availability}`
      await this.notifyTenant(data)

      //notify non-selected vendors
      data.userData = []
      data.userEmails = []
      let unassingedVendor = data.rfp_recipients.filter(x => x!==data.assigned_to)
      const unassingedVendors = await module.exports.findUserByVendorId(unassingedVendor)
      unassingedVendors.filter( async(res) => {
        if (res['dataValues'] !== null) {
          data.userData.push({
            userId: res['dataValues']['id'],
            userEmail: res['dataValues']['email']
          }) 

          data.userEmails.push(res['dataValues']['email'])
        }
      }) 

      data.title = 'Maintenance Request',
      data.webBody = `Request for Proposal for Work Order ${data.request_no} at Property ${property['dataValues']['name']} has been closed. Another service provider was selected. Please keep an eye out for more RFPs`,
      data.mobileBody = `Request for Proposal for Work Order ${data.request_no} at Property ${property['dataValues']['name']} has been closed. Another service provider was selected. Please keep an eye out for more RFPs`,
      data.emailBody = `Request for Proposal for Work Order ${data.request_no} at Property ${property['dataValues']['name']} has been closed. Another service provider was selected. Please keep an eye out for more RFPs`,
      data.type = 'multiple'    
      await this.notifyAssignee(data)      
    }

    await module.exports.updateMaintenanceOrder(data)
    requestStatus = await module.exports.findMaintenanceRequestStatus('closed')
    data.m_request_status_id = requestStatus['dataValues']['id']
    await this.updateMaintenanceRequestStatusByOrderId(data)

    return 'success'
  } catch(err){
    return err.toString('utf8')
  }
}

exports.postMaintenanceOrderStatus = async (data, params) => {
  const userRole = params.role_val
  let requestStatus = await module.exports.findMaintenanceRequestStatus(data.m_request_status_val)
  data.requestStatusId = requestStatus['dataValues']['id']
  data.closed_date = data.m_request_status_val === 'closed' ? new Date() : null
  await module.exports.updateMaintenanceOrderStatus(data)

  requestStatus = await module.exports.findMaintenanceRequestStatus('closed')
  data.m_request_status_id = requestStatus['dataValues']['id']
  await this.updateMaintenanceRequestStatusByOrderId(data)

  let userData = []
  let userEmails = []
  let name = params.role_val !== 'vendor' ? data.decodedFullName : data.vendor.business_name
  let statusMessage = data.m_request_status_val === 'completed' ? 'has updated the job status to COMPLETED. Click here.' : 'declines the Work Order'
  const property = await module.exports.findPropertyByPropertyRef(data.property_ref)
  data.propertyId = property['dataValues']['id']
  params.property_id = property['dataValues']['id']

  const userOrg = await this.findUserOrgRoleByParams(params)

  userOrg.filter( async(res) => {
    if (res['user'] !== null) {
      userData.push({
        userId: res['user']['id'],
        userEmail: res['user']['email']
      }) 

      userEmails.push(res['user']['email'])
    }
  }) 
  
  if(params.role_val === 'admin' ) {  
    if(data.assigned_to_type === 1) {
      const user = await module.exports.findUserById(data.assigned_to)    
      userData.push({
        userId: user['dataValues']['id'],
        userEmail: user['dataValues']['email']
      }) 
    }  

    userData.push({
      userId: data['user']['id'],
      userEmail: data['user']['email']
    }) 
    userEmails.push(data['user']['email'])

    let vendorIds = data.assigned_to_type === 2 ? parseInt(data.assigned_to) : JSON.parse(data.rfp_recipients)
    const vendor = await module.exports.findUserByVendorId(vendorIds)
    vendor.filter( async(res) => {
      if (res['dataValues'] !== null) {
        userData.push({
          userId: res['dataValues']['id'],
          userEmail: res['dataValues']['email']
        }) 

        userEmails.push(res['dataValues']['email'])
      }
    })     
  }

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

  return 'success'
}

exports.postMaintenanceOrderReopen = async (data) => {
  const requestStatus = await module.exports.findMaintenanceRequestStatus(data.m_request_status_val)
  data.requestStatusId = requestStatus['dataValues']['id']

  const result = await MaintenanceOrder.update({
    is_seen: 0,
    m_request_status_id: data.requestStatusId,
    is_assigned: data.is_assigned,
    is_submitted: data.is_submitted
  }, {
    where: {
      id: data.paramsId
    }
  })

  data.m_request_status_id = requestStatus['dataValues']['id']
  await this.updateMaintenanceRequestStatusByOrderId(data)

  let userData = []
  let userEmails = []
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

  if(data.assigned_to_type === 1) {
    const user = await module.exports.findUserById(data.assigned_to)    
    userData.push({
      userId: user['dataValues']['id'],
      userEmail: user['dataValues']['email']
    }) 
  }     

  let vendorIds = data.assigned_to_type === 2 ? parseInt(data.assigned_to) : JSON.parse(data.rfp_recipients)
  const vendor = await module.exports.findUserByVendorId(vendorIds)
  vendor.filter( async(res) => {
    if (res['dataValues'] !== null) {
      userData.push({
        userId: res['dataValues']['id'],
        userEmail: res['dataValues']['email']
      }) 

      userEmails.push(res['dataValues']['email'])
    }
  }) 

  let statusMessage = 'Property Manager reopens the job.'

  const d = {
    title: 'Maintenance Request',
    webBody: statusMessage,
    mobileBody: statusMessage,
    emailBody: statusMessage,
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

exports.postMaintenanceOrderReceived = async (data) => {
  const property = await module.exports.findPropertyByPropertyRef(data.property_ref)
  data.property_id = property['dataValues']['id']
  const maintenanceOrder = await module.exports.findMaintenanceOrderById(data.paramsId, { user_id : data.decodedId, property_id: data.property_id })

  if (maintenanceOrder['dataValues']['request_to'] === null) {
    await MaintenanceOrder.update({
      request_to: data.decodedId
    }, {
      where: {
        id: data.paramsId
      }
    })

    const property = await module.exports.findPropertyByPropertyRef(data.property_ref)
    data.propertyId = property['dataValues']['id']
    const d = {
      title: 'Maintenance Request',
      webBody: 'Your request has received.',
      mobileBody: 'Your request has received.',
      emailBody: 'Your request has been received.<br> Click here to see the progress.',
      propertyId: data.propertyId,
      decodedId: data.decodedId,
      send_by: data.decodedId,
      type: 'single',
      userData: null,
      user_id: data.user.id,
      email: data.user.email,
      emails: null,
      updatedAt: new Date(),
      createdAt: new Date()
    }
    await notificationController.webMobileEmailNotification(d)
  }

  return true
}

exports.postMaintenanceOrderAccept = async (data) => {
  const managers = await this.getManager(data)

  let requestStatus = await module.exports.findMaintenanceRequestStatus('work_started')
  data.m_request_status_id = requestStatus['dataValues']['id']

  const result = await MaintenanceOrder.update({
    m_request_status_id: data.m_request_status_id,
    is_seen: 1,
    rfp_due_date: data.rfp_due_date,
    updatedAt: data.updatedAt
  }, {
    where: {
      id: data.paramsId
    }
  })

  requestStatus = await module.exports.findMaintenanceRequestStatus('closed')
  data.m_request_status_id = requestStatus['dataValues']['id']
  await this.updateMaintenanceRequestStatusByOrderId(data)
  
  let userData = []
  let userEmails = []
  const property = await module.exports.findPropertyByPropertyRef(data.property_ref)
  data.propertyId = property['dataValues']['id']

  data.designation_type = 'maintenance'
  data.parentOrgId = data.parent_org_id    
  const user_delegate_maintenance = await getUserDesignationByPPO(data)

  if (user_delegate_maintenance.length > 0) {
    user_delegate_maintenance.filter( async(res) => {
      if (res !== null) {
        userData.push({
          userId: res['id'],
          userEmail: res['email']
        }) 

        userEmails.push(res['email'])
      }
    }) 
  } else {
    managers.filter( async(res) => {
      if (res !== null) {
        userData.push({
          userId: res['id'],
          userEmail: res['email']
        }) 

        userEmails.push(res['email'])
      }
    }) 
  }

  const notificationData = {
    title: 'Maintenance Request',
    webBody: data.decodedFullName + ' accepted the Work Order. Please check your list to manage.',
    mobileBody: data.decodedFullName + ' accepted the Work Order. Click here to manage',
    emailBody: data.decodedFullName + ' accepted the Work Order. <br> Sign in to manage.',
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
  await notificationController.webMobileEmailNotification(notificationData)

  return result
}

exports.findMaintenanceOrderByPropertyId = async (id) => {
  const result = await MaintenanceOrder.findAll({
    include: [
      { model: MaintenanceType },
      { model: Building },
      { 
        model: Property,
        where: {
          id
        },          
      },
      { model: User },
      { model: VendorCategory },
      { model: Unit },
      { model: UnitResident },
      { model: Vendor },
      { model: RequestStatus },
      { model: MaintenanceDt }
    ],
    required: true,
    right: true,
    order: [
      ['id', 'DESC']
    ]
  })

  return result
}

exports.findMaintenanceRequestByPropertyId = async (id) => {
  const result = await MaintenanceRequest.findAll({
    include: [
      { 
        model: Property,
        where: {
          id
        },          
      },
    ],
    required: true,
    right: true,
    order: [
      ['id', 'DESC']
    ]
  })

  return result
}

exports.findMaintenanceOrderByStaffId = async (staffId, propertyId) => {
  const result = await MaintenanceOrder.findAll({
    include: [
      { model: MaintenanceType },
      { model: Building },
      { 
        model: Property,
        where: {
          id: propertyId,
        },          
      },
      { model: User },
      { model: VendorCategory },
      { model: Unit },
      { model: UnitResident },
      { model: Vendor },
      { model: RequestStatus },
      { model: MaintenanceDt },
      { 
        model: MaintenanceRequestStaff,
        where: {
          staff_id: staffId
        } 
      }
    ],
    required: true,
    right: true,
    order: [
      ['id', 'DESC']
    ]
  })

  return result
}

exports.findMaintenanceOrderByVendorId = async (data) => {
  const result = await MaintenanceOrder.findAll({
    include: [
      { model: MaintenanceType },
      { model: Building },
      { 
        model: Property,
        where: {
          id: data.propertyId,
        },          
      },
      { model: User },
      { model: VendorCategory },
      { model: Unit },
      { model: UnitResident },
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
      { 
        model: MaintenanceRequestVendor,
        where: {
          vendor_id: data.vendorId
        }
      },
    ],
    required: true,
    right: true,
    order: [
      ['id', 'DESC']
    ]
  })

  return result
}

exports.findMaintenanceOrderByUserId = async (userId, propertyId) => {
  const result = await MaintenanceOrder.findAll({
    include: [
      { model: MaintenanceType },
      { model: Building },
      { 
        model: Property,
        where: {
          id: propertyId,
        },          
      },
      { model: User },
      { model: VendorCategory },
      { model: Unit },
      { model: UnitResident },
      { model: Vendor },
      { model: RequestStatus },
      { model: MaintenanceDt }
    ],
    required: true,
    right: true,
    where: {
      user_id: userId,
    },
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.findMaintenanceOrderById = async (id, options) => {
  const approvalType = options.formType 
    ? { type: options.formType } 
    : {};
  const result = await MaintenanceOrder.findOne({
    include: [
      { model: MaintenanceRequest },
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
        ],
        where: approvalType,
        required: false,
      },
    ],
    where: {
      id,
      building_id: options.property_id
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

exports.findUserRole = async (id) => {
  const result = await UserRole.findOne({
    where: {
      id
    }
  })

  return result
}

exports.findUserById = async (id) => {
  const result = await User.findOne({
    where: {
      id
    }
  })

  return result
}

exports.findUserByVendorId = async (vendor_id) => {
  const result = await User.findAll({
    include: [
      { model: Vendor },
      { 
        model: VendorUser,
        where: {
          vendor_id
        }          
      },
    ],
    required: true,
    right: true,    
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

exports.findMaintenanceRequestStatus = async (val) => {
  const result = await RequestStatus.findOne({   
    where: {
      val
    }
  })

  return result
}

exports.findUserOrgRoleByParams = async (data) => {
  const result = await UserOrgRole.findAll({
    include: [
      { model: User },
      { 
        model: Property,
        where: {
          id: parseInt(data.property_id)
        }
      },
      { 
        model: UserRole,
        where: {
          val: data.role_val
        }
      },
    ],
    required: true,
    right: true,
    order: [
      ['id', 'DESC']
    ]
  })

  return result
}

exports.createMaintenanceOrder = async (data) => {
  const result = await MaintenanceOrder.create({
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

exports.createMaintenanceRequestStaff = async (data) => {
  const result = await MaintenanceRequestStaff.create({
    maintenance_request_id: data.paramsId,
    staff_id: data.staffId,
    createdAt: data.createdAt
  })

  return result
}

exports.createMaintenanceRequestVendor = async (data) => {
  const result = await MaintenanceRequestVendor.create({
    maintenance_request_id: data.maintenaceOrderId,
    vendor_id: data.vendorId,
    createdAt: data.createdAt            
  })

  return result
}

exports.updateMaintenanceOrder = async (data) => {
  const result = await MaintenanceOrder.update({
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
    assigned_to: data.assigned_to,
    assigned_to_type: data.assigned_to_type,
    rfp_type: data.rfp_type,
    vendor_category_id: data.vendor_category_id,
    // user_id: data.decodedId,
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
  }, {
    where: {
      id: data.paramsId
    }
  })

  return result
}

exports.updateMaintenanceOrderStatus = async (data) => {
  const result = await MaintenanceOrder.update({
    m_request_status_id: data.requestStatusId,
    closed_date: data.closed_date
  }, {
    where: {
      id: data.paramsId
    }
  })

  return result
}

exports.updateMaintenanceRequestStatusByOrderId = async (data) => {
  const result = await MaintenanceRequest.update({
    m_request_status_id: data.m_request_status_id
  }, {
    where: {
      order_id: data.paramsId
    }
  })

  // data.title = 'Maintenance Request'
  // data.message = 'There is an update on the Maintenance, please check the list'
  // await notifyUser({ userId: 9205, data });
  // await notifyUser({ userId: 422, data });

  return result
}

exports.destroyMaintenanceRequestStaff = async (maintenance_request_id) => {
  const result = await MaintenanceRequestStaff.destroy({
    where: {
      maintenance_request_id
    }
  })

  return result
}

exports.destroyMaintenanceRequestVendor = async (maintenance_request_id) => {
  const result = await MaintenanceRequestVendor.destroy({
    where: {
      maintenance_request_id
    }
  })

  return result
}

exports.createUniqueNo = async ({ next_to, property_id, type } = {}) => {
  const year = new Date().getFullYear().toString().substr(-2)
  const initial_unique_no = `${type}${year}1000001`
  let current_unique_no
  let unique_no
  let isExist

  if (next_to) {
    current_unique_no = next_to
  } else {

    if (type === 'MTR') {
      const maintenance_order = await this.findMaintenanceOrderByPropertyId(property_id)
      unique_no = maintenance_order.length > 0 ? maintenance_order[0]['dataValues']['request_no'] : unique_no
    } else if (type === 'RFP') {
      const maintenance_request = await this.findMaintenanceRequestByPropertyId(property_id)
      unique_no = maintenance_request.length > 0 ? maintenance_request[0]['dataValues']['request_no'] : unique_no
    }

    if (unique_no) {
      if (unique_no.substr(3,2) !== year) return initial_unique_no
      current_unique_no = unique_no
    } else {
      return initial_unique_no
    }
  }

  const identifier = current_unique_no.substring(0, 3)
  const number = current_unique_no.substring(5)
  console.log({identifier, number})

  const newInvoiceNo = identifier === type
    ? `${type}${year}${parseInt(number) +1}`
    : initial_unique_no;

  // if (type === 'MTR') {
  //   isExist = await MaintenanceOrder.findOne({ where: { request_no: newInvoiceNo, property_id } })
  // } else if (type === 'RFP') {
  //   isExist = await MaintenanceRequest.findOne({ where: { request_no: newInvoiceNo, property_id } })
  // }

  return (isExist) 
    ? this.createUniqueNo({ next_to: newInvoiceNo })
    : newInvoiceNo
}

//=================================================
//Not using
exports.getMaintenanceOrderById_2 = async (id) => {
  const result = await MaintenanceOrder.findAll({
    include: [
      { model: RequestStatus },
      { 
        model: MaintenanceRequestVendor,
        where: {
          vendor_id: decoded.vendor_id
        }
      },
    ],
    order: [
      ['id', 'DESC']
    ],
    where: {
      m_request_status_id: id
    }  
  })

  return result
}

//Not using
exports.postMaintenanceOrderAccept_2 = async (data) => {
  let h1_title = 'Maintenance Request'
  let p_body = ''

  const maintenanceOrder = await module.exports.findMaintenanceOrderByVendorId_2(data.decodedVendorId, data.paramsId)
  data.maintenanceVendorId = maintenanceOrder['maintenance_request_vendor']['id']
  data.maintenancePropertyId = maintenanceOrder['property_id']
  data.maintenanceUserEmail = maintenanceOrder['user']['email']

  await module.exports.updateMaintenanceRequestVendor(data.maintenanceVendorId)
  const userVendor = await module.exports.findUserByVendorId(data.maintenancePropertyId, 0)

  p_body = data.business_name + ' <span style="color:green;"><b>accepts</b></span> job offer.'
  pushNotif.sendMessage(userVendor['dataValues']['email'], h1_title, p_body)
  mailController.sendEmail(userVendor['dataValues']['email'], h1_title, p_body)

  p_body = data.business_name + ' attended your request.'
  mailController.sendEmail(data.maintenanceUserEmail, h1_title, p_body)

  return data.maintenanceVendorId
}

//Not using
exports.postMaintenanceOrderAvailability = async (data) => {
  let promises=[]
  let d = null
  let result = null
  await module.exports.deleteMaintenaceOrderAvailability(data.paramsId)

  data.filter(async (res) => {
    d = {
      createdAt: res.createdAt,
      deletedAt: res.deletedAt,
      end_time: res.end_time,
      maintenance_request_id: data.paramsId,
      start_date: res.start_date,
      start_time: res.start_time,
      updatedAt: res.updatedAt
    }

    result = await module.exports.createMaintenaceOrderAvailability(d)
    promises.push(result);
  })

  Promise.all(promises).then(function(data){
    return data
  }).catch(function(err){
    return err.stack
  }) 
}

//Not using
exports.postMaintenanceOrderReject = async (data) => {
  let h1_title = 'Maintenance Request'
  let p_body = '' 

  const maintenanceOrder = await module.exports.findMaintenanceOrderByVendorId_2(data.decodedVendorId, data.paramsId)
  data.maintenanceVendorId = maintenanceOrder['maintenance_request_vendor']['id']
  data.maintenancePropertyId = maintenanceOrder['property_id']

  await module.exports.destroyMaintenanceRequestVendorById(data.maintenanceVendorId)
  const userVendor = await module.exports.findUserByVendorId(data.maintenancePropertyId, 0)

  p_body = data.business_name + ' <span style="color:red;"><b>rejects</b></span> job offer.'
  pushNotif.sendMessage(userVendor['dataValues']['email'], h1_title, p_body)
  mailController.sendEmail(userVendor['dataValues']['email'], h1_title, p_body)

  return data.maintenanceVendorId
}

//Not using
exports.findMaintenanceOrderByVendorId_2 = async (vendor_id, id) => {
  const result = await MaintenanceOrder.findOne({
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
      { 
        model: MaintenanceRequestVendor,
        where: {
          vendor_id
        }
      },
    ],
    where: {
      id
    }
  })

  return result
}

//Not using
exports.findMaintenanceOrderByUserId_2 = async (userId, id) => {
  const result = await MaintenanceOrder.findOne({
    include: [
      { model: MaintenanceType },
      { model: Building },
      { model: Property },
      { 
        model: User,
        where: {
          id: userId
        }
      },
      { model: VendorCategory },
      { model: Unit },
      { model: UnitResident } ,
      { model: Vendor },
      { model: RequestStatus },
      { model: MaintenanceRequestVendor },
      { model: MaintenanceDt },
    ],
    where: {
      id
    }
  })

  return result
}

//Not using
exports.findUserByVendorId_3 = async (property_id, vendor_id) => {
  const result = await User.findOne({
    where: {
      property_id,
      vendor_id
    }
  })

  return result
}

//Not using
exports.findUserByVendorId_2 = async (vendor_id) => {
  const result = await User.findOne({
    where: {
      vendor_id
    }
  })

  return result
}

//Not using
exports.createMaintenaceOrderAvailability = async (data) => {
  let sd = mainController.formatDate3(new Date(data.start_date))
  const result = await MaintenanceDt.create({
    createdAt: data.createdAt,
    deletedAt: data.deletedAt,
    end_time: mainController.convertT(data.end_time, sd),
    maintenance_request_id: data.maintenance_request_id,
    // start_date: data.start_date,
    start_date: mainController.formatDate3(new Date(data.start_date)),
    start_time: mainController.convertT(data.start_time, sd),
    updatedAt: data.updatedAt
  })

  return result
}

//Not using
exports.createMaintenanceRequestStaff_2 = async (data) => {
  const result = await MaintenanceRequestStaff.create({
    maintenance_request_id: data.maintenaceOrderId,
    staff_id: data.staffId,
    due_date: data.due_date,
    due_time: data.due_time,
    createdAt: data.createdAt            
  })

  return result
}

//Not using
exports.updateMaintenanceRequestVendor = async (id) => {
  const result = await MaintenanceRequestVendor.update({
    is_seen: 1,
    updatedAt: data.updatedAt
    }, {
    where: {
      id
    }
  })
  
  return result
}

//Not using
exports.deleteMaintenaceOrderAvailability = async (id) => {
  const result = await MaintenanceDt.destroy({
    where: {
      maintenance_request_id: id
    }
  })
  
  return result
}

//Not using
exports.destroyMaintenanceRequestVendorById = async (id) => {
  const result = await MaintenanceRequestVendor.destroy({
    where: {
      id
    }
  })

  return result
}

//Not using
exports.createNotification = async (data) => {
  const result = await Notification.create({
    notification_message_id: data.notificationMessageId,
    is_seen: 0,
    is_delivered: 0,
    user_id: data.user_id,
    updatedAt: data.updatedAt,
    createdAt: data.createdAt
  })

  return result
}

//Not using
exports.createNotificationSent = async (data) => {
  const result = await NotificationSent.create({
    notification_id: data.notificationId,
    is_seen: 0,
    is_delivered: 0,
    user_id: data.user_id,
    updatedAt: data.updatedAt,
    createdAt: data.createdAt,
    account_id: 0,
    is_delivered: 0,
    message: data.amenityMessage
  })

  return result
}

//Not using
exports.createNotificationMessage = async (data) => {
  const result = await NotificationMessage.create({
    title: data.title,
    message: data.message,
    property_id: data.propertyResId,
    user_id: data.decodedId,
    updatedAt: data.updatedAt,
    createdAt: data.createdAt
  })

  return result
}


// const user = await module.exports.findUserById(data.assigned_to)

// if (data.assigned_to_type == 1) {
//   let h1_title = 'Maintenance Request'
//   let p_body = 'One new maintenance request assigned. Please login.'
//   let p_bodyemail = 'One new maintenance request assigned. Please login.<br><br>'
//   p_bodyemail += `<span>Assigned By: ${data.decodedFullName}</span><br>`
//   p_bodyemail += `<span>Email: ${data.decodedEmail}</span><br>`
//   p_bodyemail += `<span>Phone: ${data.decodedPhone1}</span><br>`
//   pushNotif.sendMessage(user['dataValues']['email'], h1_title, p_body)
//   mailController.sendEmail(user['dataValues']['email'], h1_title, p_bodyemail) 
// }  