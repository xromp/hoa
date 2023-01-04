const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')
const UserModule = require('../models/user_module')
const today = new Date()

exports.getUserModule = async () => {
  const result = await UserModule.findAll({
    where: {
      is_active: 1
    },
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.getUserModuleAll = async () => {
  const result = await UserModule.findAll({
    order: [
      ['name', 'ASC']
    ],
  })

  return result
}

exports.getUserModuleById = async (id) => {
  const result = await UserModule.findAll({
    where: { id }
  })

  return result
}

exports.postUserModule = async (data) => {
	let result = []
  if(data.paramsId == -1) {
    result = await UserModule.create({
      name: data.name,
      createdAt: today
    })
  } else {
    // result = await UserModule.bulkCreate(data, {
    //   fields:["id", "name", "val"] ,
    //   updateOnDuplicate: ["val"],
    // })
    data.filter(async (r) => {      
      await UserModule.update({
        is_active: r.is_active,
        is_maintenance: r.is_maintenance,
        updatedAt: today
      }, {
        where: {
          id: r.id
        }
      })
    })
    
    result = 'success'
  }

  return result
}

exports.deleteUserModuleById = async (id) => {
	const result = await UserModule.destroy({
    where: { id }
  })

  return 'success'
}