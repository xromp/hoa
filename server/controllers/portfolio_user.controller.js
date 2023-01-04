const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')
const Portfolio = require('../models/pmc')
const PmcUser = require('../models/pmc_user')
const User = require('../models/user')
const today = new Date()

Portfolio.hasMany(PmcUser, {foreignKey: 'pmc_id'})
PmcUser.belongsTo(User, {targetKey:'id',foreignKey: 'user_id'})

exports.getPortfolioUserByPmcId = async (pmc_id) => {
	const result = await PmcUser.findAll({
    include: [
      { model: User }
    ],
    where: { pmc_id },
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.getPortfolioUserById = async (id) => {
	const result = await PmcUser.findAll({
    where: { id }
  })

  return result
}

exports.postPortfolioUser = async (data) => {
	let result = []

  if(data.paramsId == -1) {
    result = await PmcUser.create({
      pmc_id: data.pmc_id,
      user_id: data.user_id,      
      createdAt: today,
      updatedAt: today
    })
  } else {
    result = await PmcUser.update({
      pmc_id: data.pmc_id,
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

exports.deletePortfolioUserById = async (id) => {
	const result = await PmcUser.destroy({
    where: { id }
  })

  return result
}