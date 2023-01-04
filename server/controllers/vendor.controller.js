const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')

const Vendor = require('../models/vendor')
const Property = require('../models/property')
const User = require('../models/user')
const VendorCategory = require('../models/vendor_category_master')
const VendorInvite = require('../models/vendor_invite')
const VendorUser = require('../models/vendor_user')
const mailController = require('../controllers/mail')
const today = new Date()
const {findPropertyByPropertyRef,saveUserOrgRole} = require('../controllers/user_org_role.controller');
const {createVendorUser} = require('../controllers/vendor_user.controller');
const {getUserRoleBySlug} = require('../controllers/user_role.controller');
const {confirmEmailRequest} = require('../controllers/user.controller');
const jwt = require('jsonwebtoken')

Vendor.belongsTo(Property, {targetKey:'id',foreignKey: 'property_id'})
Vendor.belongsTo(User, {targetKey:'id',foreignKey: 'user_id'})
Vendor.belongsTo(VendorCategory, {targetKey:'id',foreignKey: 'category_id'})

exports.getVendorByQuery = async (data) => {
  let params = {}
  let result = []
  params[data.type] = data[data.type]

  if (data.type === 'business_name') {    
    result = await Vendor.findOne({
      where: { ...params }
    })
  } else {
    result = await User.findOne({
      where: { ...params }
    })
  }

  return result
}

exports.getVendorByProperty = async (data) => {
  data.property_id = await findPropertyByPropertyRef(data.property_ref)
  let result = await Vendor.findAll({
    include: [
      { model: Property },
      { model: User },
      { model: VendorCategory }      
    ],
    // where: {
    //   property_id: data.property_id
    // },
    order: [
      ['id', 'DESC']
    ],
  })

  result = [...new Map(result.map(item => [item['business_name'], item])).values()]

  return result
}

exports.getVendor = async () => {
	const result = await Vendor.findAll({
    include: [
      { model: Property },
      { model: User },
      { model: VendorCategory }      
    ],
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.getVendorById = async (id) => {
	const result = await Vendor.findOne({
    include: [
      { model: Property },
      { model: User },
      { model: VendorCategory }
    ],
    where: { id }
  })

  return result
}

exports.postVendor = async (data) => {
  if(data.paramsId == -1) {

    if (data.queryMode !== 'test') {
      data.property_id = await findPropertyByPropertyRef(data.current_env.property_ref)
      data.pmc_id = data.current_env.parent_org_id
    } else {
      data.property_id = await findPropertyByPropertyRef('92e3462-2') //92e3462-2 | 92e6476-526
      data.pmc_id = 2 //2 | 526
    }

    // data.current_env.parent_org_id = 533
    // data.property_id = 288

    if(data.category_id == -1) {
      const vendor_category = await VendorCategory.create({
        name: data.category_name,
        updatedAt: today,
        createdAt: today,
      })

      data.category_id = vendor_category.dataValues.id
    }    

    const vendor = await this.createVendor(data)
    data.vendor_id = vendor.dataValues.id
    
    const user = await this.createUser(data)
    data.user_id = user.dataValues.id

    const user_role = await getUserRoleBySlug(data.pmc_id, 'vendor')    
    data.user_role_id = user_role.dataValues.id

    data.user_role_permission_id = 0
    data.property_id = data.property_id
    data.is_clone = 1

    await createVendorUser(data)
    saveUserOrgRole(data)
    confirmEmailRequest(user.dataValues.email)

    return {message:'success', result:data, user_role}
  } else {   
    await this.updateVendor(data)
  }
}

exports.createVendor = async (data) => {
	const result = await Vendor.create({
    name:'',
    email:'',
    phone:'',
    property_id: data.property_id,
    billing_address_line_1: data.billing_address_line_1,
    billing_city: data.billing_city,
    billing_state: data.billing_state,
    billing_country: data.billing_country,
    billing_zip: data.billing_zip,
    billing_email: data.billing_email,
    billing_phone: data.billing_phone,
    business_name: data.business_name,
    business_address_line_1: data.business_address_line_1,
    business_city: data.business_city,
    business_state: data.business_state,
    business_country: data.business_country,
    business_zip: data.business_zip,
    business_email: data.business_email,
    business_phone: data.business_phone,
    business_license: '',
    business_license_exp: data.business_license_exp,
    insurance_license: '',
    insurance_license_exp: data.insurance_license_exp,
    bond_docs: '',
    bond_docs_exp: data.bond_docs_exp,
    service_radius: JSON.stringify(data.service_radius),
    category_id: JSON.stringify(data.category_id),
    updatedAt: today,
    createdAt: today,
  })

  return result
}

exports.createUser = async (data) => {
	let hashedPassword = await bcrypt.hash(data.password, 10)
	const result = await User.create({
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    password: hashedPassword,
    phone: data.phone,
    dob:null,
    emergency_contact_name: data.emergency_contact_name,
    relation: data.relation,
    emergency_contact_no: data.emergency_contact_no,
    updatedAt: today,
    vendor_id: data.vendor_id,
    is_activated: 0,
    user_role_id: 0,
    createdAt: today
  })

  return result
}

exports.updateVendor = async (data) => {
	await Vendor.update({
    billing_address_line_1: data.billing_address_line_1,
    billing_city: data.billing_city,
    billing_state: data.billing_state,
    billing_country: data.billing_country,
    billing_zip: data.billing_zip,
    billing_email: data.billing_email,
    billing_phone: data.billing_phone,
    business_name: data.business_name,
    business_address_line_1: data.business_address_line_1,
    business_city: data.business_city,
    business_state: data.business_state,
    business_country: data.business_country,          
    business_zip: data.business_zip,
    business_email: data.business_email,
    business_phone: data.business_phone,
    business_license: data.business_license,
    business_license_exp: data.business_license_exp,
    insurance_license: data.insurance_license,
    insurance_license_exp: data.insurance_license_exp,
    bond_docs: data.bond_docs,
    bond_docs_exp: data.bond_docs_exp,
    service_radius: JSON.stringify(data.service_radius),
    category_id: data.category_id,
    updatedAt: today
  }, {
    where: {
      id: data.paramsId
    }
  })

  return 'success'
}

exports.deleteVendor = async (id) => {
  await Vendor.update({
    updatedAt: today
  }, {
    where: { id }
  })

  return 'success'
}

exports.inviteVendor = async (data) => {
	data.property_id = await findPropertyByPropertyRef(data.property_ref)

  await VendorInvite.create({
    email: data.emailInvite,
    property_id: data.property_id,
    tokenInvitation: data.token,
    updatedAt: today,
    createdAt: today,
    deletedAt: ''
  })

  var h1_title =  'You have been invited to Register for aXessPoint as a Vendor'
  var p_body = 'Please click the Register button and you will be redirected to the form.<br> This link will expire in 24 hours.'
  var link = 'vendor/register?token='+data.token
  var linkText = 'REGISTER'
  mailController.sendEmail2(data.emailInvite, h1_title, p_body, link, linkText)

  return 'success'
}

export const bulkCreate = async (data) => {
  return await Vendor.bulkCreate(data, { 
    ignoreDuplicates: true,
    returning: true,
  });
}