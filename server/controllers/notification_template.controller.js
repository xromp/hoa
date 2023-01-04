const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')
const NotificationTemplate = require('../models/notification_template')
const Property = require('../models/property')
NotificationTemplate.belongsTo(Property, {targetKey:'id',foreignKey: 'property_id'})

exports.getNotificationTemplateByPropertyRef = async (property_ref) => {
	const result = await NotificationTemplate.findAll({
    include: [
      { 
        model: Property, 
        where: {
          ref: property_ref
        } 
      },
    ],
    required: true,
    right: true,  
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.getNotificationTemplateById = async (id, ref) => {
	const result = await NotificationTemplate.findAll({
    include: [
      { 
        model: Property,
        where: { ref }
      }
    ],
    where: { id }
  })

  return result
}

exports.postNotificationTemplate = async (data) => {
	let result = null

  if(data.paramsId === -1) {
    const propertyRes = await module.exports.findPropertyByPropertyRef(data)
    data.propertyResId = propertyRes['dataValues']['id']

    result = await module.exports.createNotificationTemplate(data)
  } else {
  	result = await module.exports.updateNotificationTemplate(data)
  }

  return result
}

exports.findPropertyByPropertyRef = async (data) => {
  const result = await Property.findOne({
    where: {
      ref: data.property_ref
    },
  })

  return result
}

exports.createNotificationTemplate = async (data) => {
  const result = await NotificationTemplate.create({
    message: data.message,
    property_id: data.propertyResId,
    title: data.title,
    updatedAt: data.updatedAt,
    createdAt: data.createdAt
  })

  return result
}

exports.updateNotificationTemplate = async (data) => {
  const result = await NotificationTemplate.update({
    message: data.message,
    title: data.title,
    updatedAt: data.updatedAt
  }, {
    where: {
      id: data.paramsId
    }
  }) 

  return result
}



    

   	   