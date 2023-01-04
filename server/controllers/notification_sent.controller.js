const express = require('express')
const notification = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')
const Notification = require('../models/notification')
const NotificationTemplate = require('../models/notification_template')
const NotificationMessage = require('../models/notification_message')
const Property = require('../models/property')
const User = require('../models/user')
const mailController = require('../controllers/mail')
const NotificationSent = require('../models/notification_sent')
const pushNotif = require('../controllers/push_notif')

NotificationSent.belongsTo(Notification, {targetKey:'id',foreignKey: 'notification_id'})
Notification.belongsTo(NotificationMessage, {targetKey:'id',foreignKey: 'notification_message_id'})
Notification.belongsTo(User, {targetKey:'id',foreignKey: 'user_id'})
Notification.belongsTo(Property, {targetKey:'id',foreignKey: 'property_id'})

exports.getNotificationSentAll = async (ref) => {
  const result = await NotificationSent.findAll({
    include: [    
      { 
        model: Notification,
        include: [
          { model: NotificationMessage },
          { model: User },
          { 
            model: Property,
            where: { ref },
          }
        ],
        required: true,
        right: true,        
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

exports.getNotificationSentById = async (id) => {
  const result = await NotificationSent.findAll({
    include: [    
      { 
        model: Notification,
        include: [
          { 
            model: NotificationMessage,
            where: {
              id
            },            
          },
          { model: User }          
        ],
      }
    ],
    order: [
      ['id', 'DESC']
    ],
  })
    
  return result
}

exports.getNotificationMessageById = async (id) => {
  const result = await NotificationMessage.findAll({
	  include: [    
	    { model: Property },
	    { 
	      model: Notification,
	      include: [
	        { model: NotificationSent },
	        { model: User }
	      ],
	    }
	  ],
	  where: {
	    id
	  },
	  order: [
	    ['id', 'DESC']
	  ],
	})

  return result
}