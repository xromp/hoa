const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const emailTemplate = require('../controllers/utils/email-template')
const Thread = require('../models/maintenance_request_thread')
const MaintenanceOrder = require('../models/maintenance_order')
const MaintenanceRequest = require('../models/maintenance_request')
const Vendor = require('../models/vendor')
const User = require('../models/user')
const MaintenanceRequestVendor = require('../models/maintenance_request_vendor')
const UserRole = require('../models/user_role')
const Property = require('../models/property')
const PropertyManager = require('../models/property_manager')
const UserOrgRole = require('../models/user_org_role')
const pushNotif = require('../controllers/push_notif')
const mailController = require('../controllers/mail')
const mainController = require('../controllers/main')
const { getVendorUserById, getVendorVendorById } = require('../controllers/vendor_user.controller')
const { notifyUser } = require('../controllers/notification.controller')
const today = mainController.setNewTZ(new Date())

Thread.belongsTo(MaintenanceOrder, {targetKey:'id',foreignKey: 'maintenance_request_id'})
Thread.belongsTo(Vendor, {targetKey:'id',foreignKey: 'vendor_id'})
Thread.belongsTo(User, {targetKey:'id',foreignKey: 'user_id'})
UserRole.belongsTo(UserOrgRole, {targetKey:'user_role_id',foreignKey: 'id'})
UserOrgRole.belongsTo(User, {targetKey:'id',foreignKey: 'user_id'})

exports.getThreadByRequestId = async (id) => {
	const result = await Thread.findAll({  
    include: [
      { model: Vendor },
      { model: User },
      { model: MaintenanceOrder }
    ],
    where: {
      maintenance_request_id: id
    },    
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.getThreadById = async (id) => {
	const result = await Thread.findAll({
    include: [
      { model: Vendor },
      { model: MaintenanceOrder }
    ],    
    where: { id }
  })

  return result
}

exports.postThread = async (data) => {
  const user_role = await UserRole.findOne({
    where: {
      id: parseInt(data.current_env.role_id)
    }
  })

  const asAdmin = ['admin', 'parent', 'super', 'manager']
  const isAdmin = asAdmin.includes(user_role.dataValues.val)
  let order = []

  if (data.requestType === 'wo') {
    order = await MaintenanceOrder.findOne({
      where: {
        id: parseInt(data.maintenance_request_id)
      }
    })
  } else {
    order = await MaintenanceRequest.findOne({
      where: {
        id: parseInt(data.maintenance_request_id)
      }
    })
  }

  const property = await Property.findOne({
    where: {
      ref: data.current_env.property_ref
    }
  })

  let managers = await UserOrgRole.findOne({
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
      pmc_id: parseInt(data.current_env.parent_org_id),
      property_id: property.dataValues.id
    },
    required: true,
    right: true
  })

  let send_to = null
  let send_to_id = null
  let user_vendors = null
  let user_manager = null
  let user_tenant = null
  let notificationData = []

  if (order) {      
    user_manager = await User.findOne({
      where: {
        id: order.request_to
      }
    })

    user_tenant = await User.findOne({
      where: {
        id: order.user_id
      }
    }) 

    if (order.assigned_to_type === 2) {
      user_vendors = await getVendorVendorById(parseInt(order.assigned_to))
    }

    if (data.requestType === 'rfp') {
      user_vendors = await getVendorVendorById(JSON.parse(order.rfp_recipients))
    }
  }

  if ( isAdmin ) {
    send_to = !user_manager ? data.decoded.first_name : user_manager.full_name
    h1_title = 'Maintenance Thread'
    p_body = `You have unread message from ${send_to}. Click here.`

    notificationData = {
      title: h1_title,
      message: p_body
    }

    if (user_tenant && user_tenant.email !== data.decoded.email) {  
      console.log('send to tenant') 
      notifyUser({ userId: user_tenant.dataValues.id, notificationData });
      pushNotif.sendMessage(user_tenant.dataValues.email, h1_title, p_body)
      mailController.sendEmail(user_tenant.dataValues.email, h1_title, p_body) 
    }

    if (user_vendors) {
      console.log('send to vendor') 
      user_vendors.filter((user_vendor) => {
        notifyUser({ userId: user_vendor.dataValues.user.id, notificationData });
        pushNotif.sendMessage(user_vendor.dataValues.user.email, h1_title, p_body)
        mailController.sendEmail(user_vendor.dataValues.user.email, h1_title, p_body) 
      })
    }
  } else if (user_role.dataValues.val === 'vendor') {
    const {vendor} = await getVendorUserById(data.decoded.id)

    h1_title = 'Maintenance Thread'
    p_body = `You have unread message from ${vendor.business_name}.`
    send_to = !user_manager ? managers.dataValues.user.email : user_manager.dataValues.email
    send_to_id = !user_manager ? managers.dataValues.user.id : user_manager.dataValues.id

    notificationData = {
      title: h1_title,
      message: p_body
    }
    
    notifyUser({ userId: send_to_id, notificationData });
    pushNotif.sendMessage(send_to, h1_title, p_body)
    mailController.sendEmail(send_to, h1_title, p_body) 
  } else {
    h1_title = 'Maintenance Thread'
    p_body = 'You have unread message from tenant.'
    send_to = !user_manager ? managers.dataValues.user.email : user_manager.dataValues.email
    send_to_id = !user_manager ? managers.dataValues.user.id : user_manager.dataValues.id

    notificationData = {
      title: h1_title,
      message: p_body
    }

    notifyUser({ userId: send_to_id, notificationData });
    pushNotif.sendMessage(send_to, h1_title, p_body)
    mailController.sendEmail(send_to, h1_title, p_body)       
  }

  await Thread.create({
    maintenance_request_id: data.maintenance_request_id,
    user_id: data.decoded.id,
    vendor_id: 0,
    message: data.message,
    status: '',
    createdAt: data.createdAt
  })

  return 'success'
}

exports.deleteThreadById = async (id) => {
  await await Thread.destroy({
    where: { id }
  })

  return 'success'
}
