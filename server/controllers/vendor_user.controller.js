const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')
const VendorUser = require('../models/vendor_user')
const Vendor = require('../models/vendor')
const User = require('../models/user')
const Property = require('../models/property')
const today = new Date()

VendorUser.belongsTo(User, {targetKey:'id',foreignKey: 'user_id'})
VendorUser.belongsTo(Vendor, {targetKey:'id',foreignKey: 'vendor_id'})

exports.getVendorUserById = async (id) => {
  const result = await VendorUser.findOne({
    include: [
      { 
        model: User,
        attributes: ['id', 'email', 'first_name', 'full_name', 'last_name', 'phone1', 'user_role_id', 'vendor_id'],
        where: { id }
      },
      { model: Vendor }
    ],
    required: true,
    right: true,
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.getVendorVendorById = async (id) => {
  const result = await VendorUser.findAll({
    include: [
      { 
        model: User,
        attributes: ['id', 'email', 'first_name', 'full_name', 'last_name', 'phone1', 'user_role_id', 'vendor_id'],        
      },
      { 
        model: Vendor,
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

exports.createVendorUser = async (data) => {
  const result = await VendorUser.create({
    user_id: data.user_id,
    vendor_id: data.vendor_id,
    updatedAt: today,
    createdAt: today,
  })

  return result
}