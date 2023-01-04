const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')
const Amenity = require('../models/amenity')
const Property = require('../models/property')
const Freq = require('../models/freq')
const NotificationMessage = require('../models/notification_message')
const AmenityReservation = require('../models/amenity_reservation')
const User = require('../models/user')

Amenity.belongsTo(Property, {targetKey:'id',foreignKey: 'property_id'})
Amenity.belongsTo(Freq, {targetKey:'id',foreignKey: 'booking_limit_unit'})
Amenity.hasMany(AmenityReservation, {foreignKey: 'amenity_id'})
AmenityReservation.belongsTo(User, {targetKey:'id',foreignKey: 'user_id'})

exports.getAmenityByPropertyRef = async (property_ref) => {
	const result = await Amenity.findAll({
    include: [
      { 
        model: AmenityReservation,
        include: [
          { model: User },  
        ]
      },    
      { 
        model: Property, 
        where: {
          ref: property_ref
        } 
      },
    ],
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.getAmenityById = async (id, property_ref) => {
	const result = await Amenity.findAll({
    where: {
      id
    },
    include: [    
      { 
        model: AmenityReservation,
        include: [
          { model: User },  
        ]
      },    
      { model: Freq },
      { 
        model: Property, 
        where: {
          ref: property_ref
        } 
      },
    ],
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.postAmenity = async (data) => {
	let result = null
	let notificationMessage = null	

  if(data.paramsId == -1) {     
	  const propertyRes = await module.exports.findPropertyByPropertyRef(data)
	  data.propertyResId = propertyRes['dataValues']['id'] 
    notificationMessage = await module.exports.createNotificationMessage(data)
  	data.notificationMessageId = notificationMessage['dataValues']['id']
    result = await module.exports.createAmenity(data)

    return({message: 'success', result})
  } else {
    const amenity = await module.exports.findAmenity(data.paramsId)

    if (amenity.length === 0) {
      return({message: 'not_exist', 'result': amenity})
    } else {
    	data.notificationMessageId = amenity['dataValues']['notification_message_id']
    	notificationMessage = await module.exports.updateNotificationMessage(data)
    	result = await module.exports.updateAmenity(data)

    	return({message: 'success', result})
    }
  }
}
      
exports.findPropertyByPropertyRef = async (data) => {
  const result = await Property.findOne({
    where: {
      ref: data.property_ref
    },
  })

  return result
}

exports.createNotificationMessage = async (data) => {
  const result = await NotificationMessage.create({
    title: 'Reservation has been approved',
    message: data.booking_message,
    property_id: data.propertyResId,
    user_id: data.decodedId,
    updatedAt: data.updatedAt,
    createdAt: data.createdAt
  })

  return result
}

exports.updateNotificationMessage = async (data) => {
  const result = await NotificationMessage.update({
    message: data.booking_message,
  }, {
    where: {
      id: data.notificationMessageId
    }
  })

  return result
}

exports.findAmenity = async (id) => {
  const result = await Amenity.findOne({
    where: {
      id
    }
  })

  return result
}

exports.createAmenity = async (data) => {
  const result = await Amenity.create({
    name: data.name,
    property_id: data.propertyResId,
    max_hours: data.max_hours,
    max_user_allowed: data.max_user_allowed,
    is_deposit_required: 0,
    amount: data.amount,
    is_key_required: 0,
    approved_color: data.approved_color,
    requested_color: data.requested_color,
    blocked_color: data.blocked_color,
    amenity_color: data.amenity_color,
    amenity_f_color: data.amenity_f_color,
    buffer_time: data.buffer_time,
    available_from_time: data.available_from_time,
    available_to_time: data.available_to_time,
    deposit_amount: data.deposit_amount,
    booking_message: data.booking_message,
    terms_conditions: data.terms_conditions,
    min_hours: data.min_hours,
    inventory_items_json: JSON.stringify(data.inventory_items_json),
    is_all_day: data.is_all_day,
    operational_days_json: JSON.stringify(data.operational_days_json),
    buffer_time_unit: data.buffer_time_unit,
    booking_limit: data.booking_limit,
    booking_limit_unit: data.booking_limit_unit,
    notification_message_id: data.notificationMessageId,
    updatedAt: data.updatedAt,
    createdAt: data.createdAt
  })

  return result
}

exports.updateAmenity = async (data) => {
  const result = await Amenity.update({
    name: data.name,
    max_hours: data.max_hours,
    max_user_allowed: data.max_user_allowed,
    is_deposit_required: data.is_deposit_required,
    amount: data.amount,
    is_key_required: data.is_key_required,
    approved_color: data.approved_color,
    requested_color: data.requested_color,
    blocked_color: data.blocked_color,
    amenity_color: data.amenity_color,
    amenity_f_color: data.amenity_f_color,
    buffer_time: data.buffer_time,
    available_from_time: data.available_from_time,
    available_to_time: data.available_to_time,
    deposit_amount: data.deposit_amount,
    booking_message: data.booking_message,
    terms_conditions: data.terms_conditions,
    min_hours: data.min_hours,
    inventory_items_json: JSON.stringify(data.inventory_items_json),
    is_all_day: data.is_all_day,
    operational_days_json: JSON.stringify(data.operational_days_json),
    buffer_time_unit: data.buffer_time_unit,
    booking_limit: data.booking_limit,
    booking_limit_unit: data.booking_limit_unit,
    updatedAt: data.updatedAt
  }, {
    where: {
      id: data.paramsId
    }
  })

  return result
}

exports.deleteAmenityById = async (id) => {
  await Amenity.destroy({
    where: {
      id
    }
  })

  return 'success'
}