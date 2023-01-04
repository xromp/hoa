const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')
const Portfolio = require('../models/pmc')
const PmcManager = require('../models/pmc_manager')
const User = require('../models/user')
const UserRole = require('../models/user_role')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const today = new Date()

Portfolio.hasMany(PmcManager, {foreignKey: 'pmc_id'})
PmcManager.belongsTo(User, {targetKey:'id',foreignKey: 'user_id'})
User.belongsTo(UserRole, {targetKey:'id',foreignKey: 'user_role_id'})

exports.getPortfolioManagerByPmcId = async (pmc_id) => {
	const result = await PmcManager.findAll({
    include: [
      { 
        model: User,
        include: [
          { 
            model: UserRole,
            where: {
              access_level: {
                [Op.ne]: 100
              }
            },            
          }
        ],
        required: true,
        right: true 
      }
    ],
    where: { pmc_id },
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.getPortfolioManagerById = async (id) => {
	const result = await PmcManager.findAll({
    where: { id }
  })

  return result
}

exports.postPortfolioManager = async (data) => {
	let result = []

	if (data.users) {
      const data = data.users.map(user_id => ({
        pmc_id: data.pmc_id,
        user_id: user_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))

    result = await PmcManager.bulkCreate(data, { returning: true })
  } else {
    result = await PmcManager.create({
      pmc_id: data.pmc_id,
      user_id: data.user_id,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  return result
}

exports.patchPortfolioManager = async (data) => {
	const isExist = await PmcManager.findOne({ where: { id: data.paramsId }});
  if (!isExist) throw new Error(`PMC Manager ID doesn't exist`)

  const result = await PmcManager.update({
    pmc_id: data.pmc_id,
    user_id: data.user_id,
    updatedAt: new Date()
  }, { 
    where: { id: data.paramsId }
  })

  return result
}

exports.deletePortfolioManager = async (data) => {
	const result = await PmcManager.destroy({
    where: { id }
  })

  return 'success'
}