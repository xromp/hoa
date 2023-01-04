const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')
const UserRolePermission = require('../models/user_role_permission')
const UserRole = require('../models/user_role')
const today = new Date()

UserRolePermission.belongsTo(UserRole, {targetKey:'id',foreignKey: 'user_role_id'})

exports.getUserRolePermission = async () => {
  const result = await UserRolePermission.findAll({
    include: [
      { model: UserRole }
    ],
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.getUserRolePermissionByUserRoleId = async (user_role_id) => {
  const result = await UserRolePermission.findAll({
    include: [
      { model: UserRole }
    ],
    where: { user_role_id }
  })

  return result
}

exports.postUserRolePermission = async (data, d) => {
	let result = []

  if(d.paramsId == -1) {
    result = await UserRolePermission.create({
      user_role_id: d.userRoleId,
      permissions_json: data,
      createdAt: today
    })
  } else {
    result = await UserRolePermission.update({
      permissions_json: data,
      createdAt: today
    }, {
      where: {
        user_role_id: d.userRoleId
      }
    })
  }

  return result
}

exports.deleteUserRolePermissionById = async (id) => {
	const result = await UserRolePermission.destroy({
    where: { id }
  })

  return 'success'
}