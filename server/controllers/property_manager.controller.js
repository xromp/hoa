const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')
const PropertyManager = require('../models/property_manager')
const Property = require('../models/property')
const User = require('../models/user')
const UserRole = require('../models/user_role')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const today = new Date()

PropertyManager.belongsTo(Property, {targetKey:'id',foreignKey: 'property_id'})
PropertyManager.belongsTo(User, {targetKey:'id',foreignKey: 'user_id'})
User.belongsTo(UserRole, {targetKey:'id',foreignKey: 'user_role_id'})

exports.getPropertyManagerByPropertyIdPmcId = async (data) => {
	const result = await PropertyManager.findAll({
    include: [
      { 
        model: Property,
        where: { id: data.paramsId }
      },
      { 
        model: User,
        include: [
          { 
            model: UserRole,
            where: {
              access_level: {
                [Op.ne]: 100
              }
            }            
          },
        ],
        required: true,
        right: true
      }
    ],
    where: { pmc_id: data.headersPmcId },
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.getPropertyManagerByUserIdPmcId = async (data) => {
	const result = await PropertyManager.findAll({
    include: [
      { model: Property },
      { 
        model: User,
        include: [
          { 
            model: UserRole,           
          },
        ],
        required: true,
        right: true
      }
    ],
    where: {
      user_id: data.paramsId,
      pmc_id: data.headersPmcId,
    },
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.getPropertyManagerByPmcId = async (data) => {
	const result = await PropertyManager.findAll({
    include: [
      { model: Property },
      { 
        model: User,
        include: [
          { 
            model: UserRole,
            where: {
              access_level: {
                [Op.ne]: 100
              }
            }            
          },
        ],
        required: true,
        right: true
      }
    ],
    where: {
      pmc_id: data.headersPmcId
    },
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.getPropertyManagerById = async (id) => {
	const result = await PropertyManager.findAll({
    where: { id }
  })

  return result
}

exports.deletePropertyManagerById = async (id) => {
	const result = await PropertyManager.destroy({
    where: { id }
  })

  return 'success'
}

exports.postPropertyManager = async (data) => {
	let isPropertyManager = 0
	let promises = []
	let result = []
	
  if(data.paramsId == -1) {
    for (const [key, value] of Object.entries(data.property_id)) {
      isPropertyManager = await PropertyManager.findAll({
        where: {
          property_id: value,
          user_id: data.user_id
        }
      })

      if (isPropertyManager.length == 0) {          
        data = {
          property_id: value,
          user_id: data.user_id,
          pmc_id: data.pmc_id,
          updatedAt: today,
          createdAt: today
        }

        promises.push(savePropertyManager(data));
      } else {
        return 'success'
      }
    }

    result = await Promise.all(promises)
  } else {
    result = await PropertyManager.update({
      name: data.name,
      notes: data.notes,
      address: data.address,
      phone: data.phone,
      updatedAt: today
    }, {
      where: {
        id: data.paramsId
      }
    })

    return result
  }
}

const savePropertyManager = async (data) => {
  const result = await PropertyManager.create({
    property_id: data.property_id,
    user_id: data.user_id,
    pmc_id: data.pmc_id,
    updatedAt: today,
    createdAt: today
  })

  return result
}