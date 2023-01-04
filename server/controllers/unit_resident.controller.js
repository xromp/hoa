const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')
const UnitResident = require('../models/unit_resident')
const Property = require('../models/property')
const User = require('../models/user')
const UserRole = require('../models/user_role')
const Unit = require('../models/unit')
const today = new Date()

UnitResident.belongsTo(User, {targetKey:'id',foreignKey: 'user_id'})
UnitResident.belongsTo(Unit, {targetKey:'id',foreignKey: 'unit_id'})
UnitResident.belongsTo(UserRole, {targetKey:'id',foreignKey: 'role_id'})

exports.getUnitResidentById = async (id) => {
  const result = await UnitResident.findAll({
    include: [
      { model: User },
      { model: UserRole },
      { 
        model: Unit,
        where: { id }
      }
    ],
    required: true,
    right: true,
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.postUnitResident = async (data) => {
  const d = data.user_id.map(userId => ({
    unit_id: data.unit_id,
    user_id: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))

  const result = await UnitResident.bulkCreate(d, { returning: true })
}

exports.deleteUnitResidentById = async (id) => {
	const result = await UnitResident.destroy({
    where: { id }
  })

  return 'success'
}