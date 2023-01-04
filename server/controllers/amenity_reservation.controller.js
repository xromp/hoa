const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')
const Amenity = require('../models/amenity')
const AmenityReservation = require('../models/amenity_reservation')
const AmenityReservationDetail = require('../models/amenity_reservation_detail')
const Property = require('../models/property')
const PropertyManager = require('../models/property_manager')
const User = require('../models/user')
const UserRole = require('../models/user_role')
const pushNotif = require('../controllers/push_notif')
const mainController = require('../controllers/main')
const mailController = require('../controllers/mail')
const NotificationMessage = require('../models/notification_message')
const Notification = require('../models/notification')
const NotificationSent = require('../models/notification_sent')
const Unit = require('../models/unit')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const notificationController = require('../controllers/notification.controller');
const { getUserDesignationByPPO } = require('./user_designation.controller');
const { getManager } = require('./maintenance_order.controller');
const { getAmenityReservationDetailDuplicate } = require('./amenity_reservation_detail.controller');
let timezoneOffset = new Date().getTimezoneOffset() / -60
//new Date().getTimezoneOffset() / -60
//8
let asAdmin = ['admin', 'parent', 'super', 'manager']
let asTenant = ['user']

AmenityReservation.belongsTo(Property, {targetKey:'id',foreignKey: 'property_id'})
AmenityReservationDetail.belongsTo(Amenity, {targetKey:'id',foreignKey: 'amenity_id'})
AmenityReservation.belongsTo(Amenity, {targetKey:'id',foreignKey: 'amenity_id'})
Amenity.belongsTo(NotificationMessage, {targetKey:'id',foreignKey: 'notification_message_id'})
Property.hasMany(PropertyManager, {foreignKey: 'property_id'})
User.hasMany(PropertyManager, {foreignKey: 'user_id'})
AmenityReservation.belongsTo(User, {targetKey:'id',foreignKey: 'user_id'})
AmenityReservation.belongsTo(Unit, {targetKey:'id',foreignKey: 'unit_id'})
AmenityReservation.hasMany(AmenityReservationDetail, {foreignKey: 'amenity_reservation_id'})

exports.getAmenityReservationById = async (id) => {
	const result = await AmenityReservation.findOne({
    include: [
      { 
        model: Property, 
      },
    ],
    where: { id },
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.getAmenityReservationByPropertyRef = async (id, property_ref) => {
	const result = await AmenityReservation.findOne({
    where: { id },
    include: [    
      { 
        model: Property, 
        where: { ref: property_ref }
      },
    ],
    order: [
      ['id', 'DESC']
    ],
  }) 

  return result
}

exports.getAmenityReservation = async (data) => {
	const reservationByProperty = await module.exports.findAmenityReservationByPropertyRef(data.property_ref)
	const reservationByUser = await module.exports.findAmenityReservationByUserId(data)	
  let newStyle = "background: linear-gradient(118deg, rgba(var(--vs-danger), 1), rgba(var(--vs-danger), 0.7)) !important; box-shadow: 0px 0px 10px 1px rgba(var(--vs-danger), 0.7) !important;"

  if ( asAdmin.includes(data.role_val) ) {     
    reservationByProperty.filter((res) => {
      res['style'] = res['user_id'] !== data.decodedId ? newStyle : res['style']
      res['title'] = res['user_id'] !== data.decodedId ? res['amenity']['name'] + '</br>' + res['from_time'] + ' to ' + res['to_time'] + '</br>' + res['unit']['number'] + ': ' + res['user']['first_name'] : res['title']
    })
  } else {
    reservationByUser.filter((res) => {
      res['title'] = res['amenity']['name'] + '</br>' + res['from_time'] + ' to ' + res['to_time']
    })
  }

  const result = asAdmin.includes(data.role_val) ? reservationByProperty : reservationByUser

  return result
}

exports.postAmenityReservation = async (data) => {
  let isAdmin = asAdmin.includes(data.decodedUserRoleVal)
  let isTenant = asTenant.includes(data.decodedUserRoleVal)
  
  data.endDate = isTenant ? data.startDate : data.endDate

  let data_fromTime = data.from_time.toString().replace('12:', '00:');
  let data_toTime = data.to_time.toString().replace('12:', '00:');
  let data_startDate = mainController.convertTime(data_fromTime, mainController.formatDate(new Date(data.startDate)) )
  let data_endDate = mainController.convertTime(data_toTime, mainController.formatDate(new Date(data.endDate)) )  

  data.startDate = mainController.addHours(new Date(data_startDate), timezoneOffset)
  data.endDate = mainController.addHours(new Date(data_endDate), timezoneOffset)

  let title1 = data.amenity_name + ": " + data.unit_number + " - (" + data.from_time + " to " + data.to_time + ")"
  let title2 = data.amenity_name + ": Blocked - (" + data.from_time + " to " + data.to_time + ")"

  data.title = data.is_block === 0 ? title1 : title2
  data.classes = `event-${data.labelColor}`
  data.from_datetime = mainController.addHours(new Date(data_startDate), timezoneOffset)
  data.to_datetime = mainController.addHours(new Date(data_endDate), timezoneOffset)
  data.from_date = mainController.formatDate2(data_startDate)
  data.to_date = mainController.formatDate2(data_endDate)
  data.createdAt = mainController.addHours(new Date(), timezoneOffset)
  data.updatedAt = mainController.addHours(new Date(), timezoneOffset)

  data.buffer_to_time = mainController.addTime(data.to_date, data.timeVal, data.timeType)
  data.buffer_to_time = data.id === -1 ? data.buffer_to_time : data.to_time

  let y = 0
  let temp_fromDate = null
  data.from_dates = []

  for (let i = new Date(data.from_date).getDate(); i <= (new Date(data.to_date).getDate()); i++) {
    temp_fromDate = mainController.addDays(data.from_date, y) 
    data.from_dates.push(temp_fromDate)
    y++
  }

  data.headersFromDates = JSON.stringify(data.from_dates)
  data.headersAmenityId = data.amenity_id

  return await module.exports.postAmenityReservationCreate(data)
}

exports.postAmenityReservationCreate = async (data) => {	
	const property = await module.exports.findPropertyByPropertyRef(data.headersPropertyRef)

  data.propertyId = property.dataValues.id
  data.parent_org_id = data.parentOrgId
  data.designation_type = 'reservation'
  const user_delegate_reservation = await getUserDesignationByPPO(data)
  const managers = await getManager(data)

  let userEmails = []
  let userIds = []

  if (user_delegate_reservation.length > 0) {
    user_delegate_reservation.filter( async(res) => {
      if (res !== null) {
        userEmails.push(res['email'])
        userIds.push(res['id'])
      }
    }) 
  } else {
    managers.filter((res) => {
      if (res !== null) {
        userEmails.push(res['email'])
        userIds.push(res['id'])
      }
    }) 
  }

	let userEmailPush = userEmails
	userEmails = userEmails + ""

	const userRole = await module.exports.findUserRole(data.decodedUserRoleId)

	const user = await module.exports.findUserById(data.user_id)
	
	const amenity = await module.exports.findAmenityById(data.amenity_id)

  const unit = await module.exports.findUnitById(data.unit_id)

  const amenityReservation = await module.exports.findAmenityReservationDetailByArId(data.paramsId)
  
  let isAdmin = asAdmin.includes(userRole['dataValues']['val'])

  data.label = !isAdmin ? 'pending' : data.label
  data.classes = !isAdmin ? 'event-warning' : data.classes
  data.newStyle = data.label === 'pending' ? 'background-color: white !important; color: black !important; border: 5px solid ' +amenity['dataValues']['amenity_color']+ ';' : 'background-color: ' + amenity['dataValues']['amenity_color'] + ' !important; color: white; text-shadow: 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;'    
  data.newStyle = data.is_block === 0 ? data.newStyle : 'background-color: gray !important; color: white !important;'

  data.propertyId = property['dataValues']['id']
  data.amenityMessage = amenity['dataValues']['notification_message'] === null ? '-' : amenity['dataValues']['notification_message']['message']
  data.notificationMessageId = amenity['dataValues']['notification_message_id']
  data.amenityName = amenity['dataValues']['name']
  data.unitNumber = data.is_block === 0 ? unit['dataValues']['number'] : ''  

  let format_fromDate = mainController.formatDate(data.from_date) + ' to ' + mainController.formatDate(data.to_date)
  let format_fromTime = data.from_time + ' to ' + data.to_time
  let status = data.label
  let h1_title_approved = 'Your Reservation has Been Approved'
  let h1_title_reject = 'Your Reservation has Been Rejected'
  let h1_body_approved = 'Your request for ' + amenity['dataValues']['name'] + ' on ' + format_fromDate + ' at ' + format_fromTime + ' has been approved.' 
  let h1_body_reject = 'Your request for ' + amenity['dataValues']['name'] + ' on ' + format_fromDate + ' at ' + format_fromTime + ' has been denied for the following reason: ' + data.rejection_reason

  let h1_title = status === 'approve' ? h1_title_approved : h1_title_reject
  let p_body = status === 'approve' ? h1_body_approved : h1_body_reject

	if(data.paramsId == -1) {
    await createReservation(data)

		if (data.label === 'approve' || !isAdmin ) {  
      h1_title = !isAdmin ? 'Reservation Needs Approval' : h1_title
      p_body = !isAdmin ? amenity['dataValues']['name'] + ' on ' + format_fromDate + ' at ' + format_fromTime : p_body

      const notificationMessageData = {
        title: h1_title,
        message: p_body,
        property_id: data.propertyId,
        user_id: data.decodedId,
        updatedAt: data.updatedAt,
        createdAt: data.createdAt
      }

      const notificationMessage = await module.exports.createNotificationMessage(notificationMessageData)
      data.notificationMessageId = notificationMessage['dataValues']['id']

      if (isAdmin) {
        userIds = []        
        userIds.push(data.user_id)
      }
        
      userIds.map(async (v, k) => {
        data.user_id = userIds[k]
  			const notification = await module.exports.createNotification(data)
  			data.notificationId = notification['dataValues']['id']
  			const notificationSent = await module.exports.createNotificationSent(data)

        await notificationController.notifyUser({ 
          userId: userIds[k],
          data: { title: h1_title, message: p_body }
        });        
      })			

      userEmailPush = !isAdmin ? userEmailPush : user['dataValues']['email']
      userEmails  = !isAdmin ? userEmails : user['dataValues']['email']

      pushNotif.sendMessage(userEmailPush, h1_title, p_body)
      mailController.sendEmail(userEmails, h1_title, p_body)
		}

		return ({message:'success'})
	} else {
    await module.exports.deleteAmenityReservationDetailById(data.paramsId)
    await module.exports.deleteAmenityReservationByParamsId(data.paramsId)
    await createReservation(data)
		
		if (data.label === 'approve' || (isAdmin && data.label !== 'delete') ) {  
      const notificationMessageData = {
        title: h1_title,
        message: p_body,
        property_id: data.propertyId,
        user_id: data.decodedId,
        updatedAt: data.updatedAt,
        createdAt: data.createdAt
      }

      const notificationMessage = await module.exports.createNotificationMessage(notificationMessageData)
      data.notificationMessageId = notificationMessage['dataValues']['id']

      const notification = await module.exports.createNotification(data)
      data.notificationId = notification['dataValues']['id']
      const notificationSent = await module.exports.createNotificationSent(data)

      const { socket_id, id: userId} = user['dataValues']
      if (socket_id) await notificationController.notifyUser({ 
        userId,
        data: { title: h1_title, message: p_body }
      });

      pushNotif.sendMessage(user['dataValues']['email'],h1_title, p_body)
      mailController.sendEmail(user['dataValues']['email'], h1_title, p_body) 
		}

		return 'success'
	}
}

exports.deleteAmenityReservationById = async (data) => {
	await AmenityReservation.update({
    label: data.label,
    status: data.label,
  }, {
    where: {
      id: data.paramsId
    }
  })

  await AmenityReservationDetail.destroy({
    where: {
      amenity_reservation_id: data.paramsId
    }
  })

  return 'success'
}

exports.findUserRole = async (id) => {
  const result = await UserRole.findOne({
    where: {
      id
    }
  })

  return result
}

exports.findAmenityReservationByPropertyRef = async (ref) => {
  const result = await AmenityReservation.findAll({
      where: {
        status: {
          [Op.notIn]: ['reject' , 'delete']
        }  
      },
      include: [
        { model: User },
        { model: Unit },
        { model: Amenity },
        { 
          model: Property, 
          where: { ref } 
        }
      ],
      required: true,
      right: true,      
    order: [
      ['createdAt', 'DESC'],
      ['startDate', 'DESC']
    ],      
  })

  return result
}

exports.findAmenityReservationDetailByPropertyRef = async (ref) => {
  const result = await AmenityReservationDetail.findAll({
    include: [
      { model: Amenity},
      {
        model: AmenityReservation,
        where: {
          status: {
            [Op.notIn]: ['reject' , 'delete']
          }  
        },
        include: [
          { model: User },
          { model: Unit },
          { model: Amenity },
          { 
            model: Property, 
            where: { ref } 
          }
        ],
        required: true,
        right: true,      
      },
    ],
    order: [
      ['createdAt', 'DESC'],
      ['startDate', 'DESC']
    ],      
  })

  return result
}

exports.findAmenityReservationByUserId = async (data) => {
  const result = await AmenityReservation.findAll({
    where: {
      user_id: data.decodedId,
      status: {
        [Op.notIn]: ['reject' , 'delete']
      }  
    },
    include: [
      { model: User },
      { model: Unit },
      { model: Amenity },
      { 
        model: Property, 
        where: {
          ref: data.property_ref
        } 
      }
    ],
    required: true,
    right: true,
    order: [
      ['createdAt', 'DESC'],
      ['startDate', 'DESC']
    ],   
  }) 

  return result
}

exports.findAmenityReservationDetailByUserId = async (data) => {
  const result = await AmenityReservationDetail.findAll({
    include: [
      { model: Amenity},
      { 
        model: AmenityReservation,
        where: {
          user_id: data.decodedId,
          status: {
            [Op.notIn]: ['reject' , 'delete']
          }  
        },
        include: [
          { model: User },
          { model: Unit },
          { model: Amenity },
          { 
            model: Property, 
            where: {
              ref: data.property_ref
            } 
          }
        ],
        required: true,
        right: true,       
      },
    ],
    order: [
      ['createdAt', 'DESC'],
      ['startDate', 'DESC']
    ],   
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

exports.findUserById = async (id) => {
  const result = await User.findOne({
    where: { id }
  })

  return result
}

exports.findAmenityById = async (id) => {
  const result = await Amenity.findOne({
    include: [
      { model: NotificationMessage },
    ],    
    where: { id }
  })

  return result
}

exports.findAmenityReservationById = async (id) => {
  const result = await AmenityReservation.findOne({
    where: { id }
  })

  return result
}

exports.findAmenityReservationDetailByArId = async (id) => {
  const result = await AmenityReservationDetail.findOne({
    where: { id }
  })

  return result
}

exports.findUnitById = async (id) => {
  const result = await Unit.findOne({
    where: { id }
  })

  return result
}

exports.createAmenityReservation = async (data) => {
  try {
    const result = await AmenityReservation.create({
      amenity_id: data.amenity_id,
      unit_resident_id: data.unit_resident_id,
      from_time: data.from_time,
      to_time: data.to_time,
      people: data.people,
      comments: data.comments,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      status: data.label,
      from_date: data.from_date,
      to_date: data.to_date,
      user_id: data.user_id,
      is_seen: data.is_seen,
      from_datetime: data.from_datetime,
      to_datetime: data.to_datetime,
      property_id: data.propertyId, //userRole['dataValues']['val'] === 'admin' ? propertyRes[0]['dataValues']['id'] : decoded.property_id,
      unit_id: data.unit_id,
      rejection_reason: data.rejection_reason,
      internal_comments: data.internal_comments,

      startDate: data.startDate,
      endDate: data.endDate,
      title: data.title,
      label: data.label,
      classes: data.classes,
      style: data.newStyle,
      is_block: data.is_block,
      block_reason: data.block_reason,
      is_buffer: data.is_buffer,
      is_all_day: data.is_all_day,
      is_seen: data.is_seen,
    })

    return result
  } catch (err) {
    return err.toString('utf8')
  }  
}

exports.createAmenityReservationDetail = async (data) => {
  try {
    const result = await AmenityReservationDetail.create({
      amenity_reservation_id: data.amenity_reservation_id,
      amenity_id: data.amenity_id,
      unit_resident_id: data.unit_resident_id,
      from_time: data.from_time,
      to_time: data.to_time,
      people: data.people,
      comments: data.comments,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      status: data.label,
      from_date: data.from_date,
      to_date: data.to_date,
      user_id: data.user_id,
      is_seen: data.is_seen,
      property_id: data.propertyId, //userRole['dataValues']['val'] === 'admin' ? propertyRes[0]['dataValues']['id'] : decoded.property_id,
      unit_id: data.unit_id,
      rejection_reason: data.rejection_reason,
      internal_comments: data.internal_comments,

      startDate: data.startDate,
      endDate: data.endDate,
      title: data.title,
      label: data.label,
      classes: data.classes,
      style: data.newStyle,
      is_block: data.is_block,
      block_reason: data.block_reason,
      is_buffer: data.is_buffer,
      is_all_day: data.is_all_day,
      is_seen: data.is_seen,
    })

    return result
  } catch (err) {
    return err.toString('utf8')
  }  
}

exports.createNotification = async (data) => {
  const result = await Notification.create({
	  notification_message_id: data.notificationMessageId,
    property_id: !!data.property_id ? data.property_id : data.propertyId,
	  is_seen: 0,
	  is_delivered: 0,
	  user_id: data.user_id,
	  updatedAt: data.updatedAt,
	  createdAt: data.createdAt
	})

  return result
}

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

exports.updateAmenityReservation = async (data) => {
  const result = await AmenityReservation.update({
    amenity_id: data.amenity_id,
    unit_resident_id: data.unit_resident_id,
    from_time: data.from_time,
    to_time: data.to_time,
    people: data.people,
    comments: data.comments,
    updatedAt: data.updatedAt,
    status: data.label,
    from_date: data.from_date,
    to_date: data.to_date,
    user_id: data.user_id,
    is_seen: data.is_seen,
    from_datetime: data.from_datetime,
    to_datetime: data.to_datetime,
    unit_id: data.unit_id,
    rejection_reason: data.rejection_reason,
    internal_comments: data.internal_comments,

    startDate: data.startDate,
    endDate: data.endDate,
    title: data.title,
    label: data.label,
    classes: data.classes,
    style: data.newStyle,
    is_block: data.is_block,
    block_reason: data.block_reason,
    is_buffer: data.is_buffer,
    is_all_day: data.is_all_day
  }, {
    where: {
      id: data.paramsId
    }
  })

  return result
}

exports.deleteAmenityReservationByParamsId = async (id) => {
  await AmenityReservation.destroy({
    where: {
      id
    }
  })

  return 'success'
}

exports.deleteAmenityReservationDetailById = async (id) => {
  const result = await AmenityReservationDetail.destroy({
    where: {
      amenity_reservation_id: id
    }
  })

  return ({message:'success', result})
}

const createReservation = async (data) => {
  try {      
    let result = [] 
    let i = 0
    let temp_fromDate = null
    data.from_dates = []
  
    for (let fromDay = new Date(data.from_date).getDate(); fromDay <= (new Date(data.to_date).getDate()); fromDay++) {
      temp_fromDate = mainController.addDays(data.from_date, i) 
      data.from_dates.push(temp_fromDate)
      i++
    }

    let fromDateCount = data.from_dates.length - 1
    let fromTime = data.from_time
    let endTime = data.to_time
    let fromDate = data.from_date
    let toDate = data.to_date

    if (data.is_all_day) {        
      result = await module.exports.createAmenityReservation(data)    
      data.amenity_reservation_id = result['dataValues']['id']
    }

    for (const [key, val] of Object.entries(data.from_dates)) {
      data.from_time = (data.is_all_day) ? (key === 0 ? data.from_time : "12:00AM") : data.from_time
      data.from_date = key === 0 ? fromDate : val
      data.from_datetime = (data.is_all_day) ? (key === 0 ? val : mainController.setTime(val, 0, 0)) : val
      data.startDate = (data.is_all_day) ? (key === 0 ? val : mainController.setTime(val, 0, 0)) : val
      data.startDate = mainController.addHours(new Date(data.startDate), timezoneOffset)
      
      data.to_time = (data.is_all_day) ? ( key === fromDateCount ? endTime : "11:59PM") : data.to_time
      data.to_date = key === fromDateCount ? toDate : mainController.replaceTime(val, data.to_time.replace('12:', '00:'))
      data.to_datetime = (data.is_all_day) ? (key === fromDateCount ? toDate : mainController.setTime(val, 23, 59)) : data.to_date
      data.endDate = (data.is_all_day) ? (key === fromDateCount ? toDate : mainController.setTime(val, 23, 59)) : data.to_date
      data.endDate = mainController.addHours(new Date(data.endDate), timezoneOffset)

      data.title = (data.is_all_day) ? data.amenityName+': '+data.unitNumber+' - ('+data.from_time+' to '+data.to_time+')' : data.title

      // data.from_time = key === 0 ? fromTime : "12:00AM"
      data.to_time = data.is_all_day ? (key === fromDateCount ? data.buffer_to_time : "11:59PM") : data.buffer_to_time
      data.from_date_val = val
      data.to_date_val = val

      if (!data.is_all_day) {
        result = await module.exports.createAmenityReservation(data)    
        data.amenity_reservation_id = result['dataValues']['id']
      }
      await module.exports.createAmenityReservationDetail(data)
    } 
  } catch (err) {
    return err.toString('utf8')
  }  
} 