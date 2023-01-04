const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')
const UnitUser = require('../models/unit_user')
const Property = require('../models/property')
const User = require('../models/user')
const Unit = require('../models/unit')
const UserOrgRole = require('../models/user_org_role')
const UserRole = require('../models/user_role')
const today = new Date()

UnitUser.belongsTo(User, {targetKey:'id',foreignKey: 'user_id'})
UnitUser.belongsTo(Unit, {targetKey:'id',foreignKey: 'unit_id'})
User.hasMany(UserOrgRole, {foreignKey: 'user_id'})
UserOrgRole.belongsTo(UserRole, {targetKey:'id',foreignKey: 'user_role_id'})

exports.getUnitUserById = async (data) => {
  const property = await Property.findOne({
    where: { ref: data.property_ref }
  })

  let result = await UnitUser.findAll({
    include: [
      { 
        model: User,
        include: [
          { 
            model: UserOrgRole,
            where: { 
              pmc_id: data.parent_org_id,
              property_id: property['dataValues']['id']
            },
            include: [
              { model: UserRole }
            ]
          }          
        ]
      },
      { 
        model: Unit,
        where: { id: data.paramsId }
      }
    ],
    required: true,
    right: true,
    order: [
      ['id', 'DESC']
    ],
  })
  result = [...new Map(result.map(item => [item['user_id'], item])).values()]

  return result
}

exports.postUnitUser = async (data) => {
  let promises=[];
  let unitUser = 0
  let d = []

  for (const [key, value] of Object.entries(data.user_id)) {
    unitUser = await UnitUser.findAll({
      where: {
        unit_id: data.unit_id,
        user_id: value
      }
    })

    if (unitUser.length === 0 && data.unit_id !== 0) {
      d = {
        unit_id: data.unit_id,
        user_id: value,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      promises.push(createUnitUser(d));
    } 
  }

  const result = await Promise.all(promises)

  // const d = data.user_id.map(userId => ({
  //   unit_id: data.unit_id,
  //   user_id: userId,
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  // }))

  // const result = await UnitUser.bulkCreate(d, { returning: true })
  return result
}

const createUnitUser = async (data) => {
  const result = await UnitUser.create({
    unit_id: data.unit_id,
    user_id: data.user_id,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  return result
}

exports.deleteUnitUserById = async (id) => {
	const result = await UnitUser.destroy({
    where: { id }
  })

  return 'success'
}

export const bulkCreate = async (data) => {
  return await UnitUser.bulkCreate(data, { 
    ignoreDuplicates: true,
    returning: true,
  });
}
