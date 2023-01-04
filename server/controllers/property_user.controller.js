const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')
const Property = require('../models/property')
const PropertyUser = require('../models/property_user')
const User = require('../models/user')
const today = new Date()

Property.hasMany(PropertyUser, {foreignKey: 'property_id'})
PropertyUser.belongsTo(User, {targetKey:'id',foreignKey: 'user_id'})

exports.getPropertyUserByUserId = async (data) => {
	const result = await PropertyUser.findAll({
    include: [
      { model: User },
      { model: Property }
    ],      
    where: {
      user_id: data.paramsId
    },
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.getPropertyUserByPropertyId = async (property_id) => {
	const result = await PropertyUser.findAll({
    include: [
      { model: User },
      { model: Property }
    ],      
    where: { property_id },
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.getPropertyUserById = async (id) => {
	const result = await PropertyUser.findAll({
    where: { id }
  })

  return result
}

exports.postPropertyUser = async (data) => {
	let result = []

  if(parseInt(data.paramsId) === -1) {
    result = await PropertyUser.create({
      property_id: data.property_id,
      user_id: data.user_id,      
      createdAt: today,
      updatedAt: today
    })
  } else {
    result = await PropertyUser.update({
      property_id: data.property_id,
      user_id: data.user_id,      
      updatedAt: today
    }, {
      where: {
        id: data.paramsId
      }
    })
  }

  return result
}

exports.postPropertyUsers = async (data) => {
	let result = []

  if(parseInt(data.paramsId) === -1) {
    let propertyUser = 0
    let promises = []

    for (const [key, value] of Object.entries(data.property_id)) {
      propertyUser = await PropertyUser.findAll({
        where: {
          property_id: value,
          user_id: data.user_id
        }
      })

      if (propertyUser.length == 0) {          
        data = {
          property_id: value,
          user_id: data.user_id,
          updatedAt: today,
          createdAt: today
        }
        promises.push(savePropertyUser(data));
      }
    }

    result = await Promise.all(promises)
  }	

  return result
}

exports.deletePropertyUserById = async (id) => {
	const result = await PropertyUser.destroy({
    where: { id }
  })

  return 'success'
}

const savePropertyUser = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const userPM = PropertyUser.create({
        property_id: data.property_id,
        user_id: data.user_id,
        updatedAt: today,
        createdAt: today
      })

      resolve(userPM)
    } catch(err) {
      reject(err.toString('utf8'));
    }
  })
}