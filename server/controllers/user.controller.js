const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')
const User = require('../models/user')
const CountryMaster = require('../models/country_master')
const Salutation = require('../models/salutation')
const Property = require('../models/property')
const UserRole = require('../models/user_role')
const Vendor = require('../models/vendor')
const UserDevice = require('../models/user_device')
const UserRolePermission = require('../models/user_role_permission')
const PmcManager = require('../models/pmc_manager')
const PmcUser = require('../models/pmc_user')
const Portfolio = require('../models/pmc')
const UnitUser = require('../models/unit_user')
const UnitResident = require('../models/unit_resident')
const PropertyUser = require('../models/property_user')
const PropertyManager = require('../models/property_manager')
const Unit = require('../models/unit')
const Approver = require('../models/approver')
const VendorUser = require('../models/vendor_user')
const UserOrgRole = require('../models/user_org_role')
const UserModule = require('../models/user_module')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const today = new Date().toISOString().slice(0, 19).replace('T', ' ');
const jwt = require('jsonwebtoken')
const mailController = require('./mail')
const userOrgRoleController = require('../controllers/user_org_role.controller');
const propertyController = require('../controllers/property.controller');
import { updateUserOrgRolesByUserId } from '../controllers/user_org_role.controller';
import { postUserDesignation } from './user_designation.controller';

User.belongsTo(CountryMaster, {targetKey:'id',foreignKey: 'country_id'})
User.belongsTo(Salutation, {targetKey:'id',foreignKey: 'salutation_id'})
User.belongsTo(Property, {targetKey:'id',foreignKey: 'property_id'})
User.belongsTo(UserRole, {targetKey:'id',foreignKey: 'user_role_id'})
UserRole.hasMany(UserRolePermission, {targetKey:'id',foreignKey: 'user_role_id'})
User.belongsTo(Vendor, {targetKey:'id',foreignKey: 'vendor_id'})
User.hasMany(UserDevice, {targetKey:'id',foreignKey: 'user_id'})
User.hasMany(PmcManager, {targetKey:'id',foreignKey: 'user_id'})
User.hasMany(PmcUser, {targetKey:'id',foreignKey: 'user_id'})
User.hasMany(PropertyUser, {targetKey:'id',foreignKey: 'user_id'})
User.hasMany(UnitResident, {targetKey:'id',foreignKey: 'user_id'})
UnitResident.belongsTo(Unit, {targetKey:'id',foreignKey: 'unit_id'})
PmcUser.belongsTo(Portfolio, {targetKey:'id',foreignKey: 'pmc_id'})
User.hasMany(UnitUser, {foreignKey: 'user_id'})
PropertyUser.belongsTo(Property, {targetKey:'id',foreignKey: 'property_id'})
User.belongsTo(Approver, { targetKey:'user_id',foreignKey: 'id' })
User.hasOne(VendorUser, {targetKey:'id',foreignKey: 'user_id'})
User.hasMany(UserOrgRole, { targetKey:'id',foreignKey: 'user_id' })
UserRole.belongsTo(UserOrgRole, { targetKey:'user_role_id',foreignKey: 'id' })
VendorUser.belongsTo(Vendor, {targetKey:'id',foreignKey: 'vendor_id'})
let asAdmin = ['admin'] // 'parent', 'super', 'manager'

exports.getAuth = async (push_token) => {
  const userAllData = await this.findUserByToken(push_token)
  const user = await this.findUser(push_token)

  if (user) {
    let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
      // expiresIn: 86400 //43200 //1440
    })
    let decoded = jwt.verify(token, process.env.SECRET_KEY)

    let returnData = {
      'userAllData': JSON.stringify(userAllData),
      'token' : token,
      'exp': decoded.exp,
      'decodedId': decoded.id
    }

    await this.updateUserStatus(returnData)
    return returnData
  }

  return ({ error: 'push_token_expired' })
}

exports.getUserAll = async (data) => {
  if (
    data.role_val !== 'admin' && 
    data.role_val !== 'manager' && 
    data.role_val !== 'parent'
  ) return []

  const result = await User.findAll({
    where: { is_deleted: false },
    include: [
      { 
        model: UnitResident,
        include: [
          { model: Unit }
        ]
      },
      { model: UnitUser },
      { model: CountryMaster },
      { model: Salutation },
      { model: UserRole },
      { 
        model: PropertyUser,
        include: [
          { model: Property }
        ]
      }   
    ],
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.refreshToken = async (data) => {
  delete data.iat;
  delete data.exp;
  return jwt.sign(data, process.env.SECRET_KEY, { expiresIn: 86400 });
}

exports.getUserByEmailPass = async (data) => {
  const user = await User.findOne({
    where: {
      email: data.email
    }
  })

  if (!user) {
    // throw new Error('User does not exist.')
    return ({ error: 'not_exist' })
  } 

  const userAllData = await this.findUserByEmail(data.email)

  let userPermission = await UserOrgRole.findOne({ 
    where: {
      user_id: user.dataValues.id
    },    
    include: [
      { model: UserRole }
    ],
    order: [
      ['user_role_id', 'ASC'],
      ['pmc_id', 'ASC']
    ] 
  })

  if (userPermission === null) {
    // throw new Error('User does not exist.')
    return ({ error: 'not_exist' })
  }

  const userModule = await UserModule.findAll({ 
    where: { is_active: 1 },
    attributes: ["val"]
  }).map(({val}) => val)

  if (
      userPermission.dataValues.user_role.dataValues.permission === null ||
      userPermission.dataValues.user_role.dataValues.permission === ''
    ) {
    return ({ error: 'no_permission' })
  }

  let permission = JSON.parse(userPermission.dataValues.user_role.dataValues.permission)
  
  for (const [key, value] of Object.entries(permission)) {
    if (!userModule.includes(key)) {
      delete permission[key]
    }
  }

  userAllData['dataValues']['user_role'] = {
    'module': userModule,
    'permission': JSON.stringify(permission),
    'access_level': userPermission.dataValues.user_role.dataValues.access_level
  }
  userAllData['dataValues']['password'] = null
  
  if (!userAllData['dataValues']['user_role']['permission']) {
    // throw new Error('User does not exist.')
    return ({ error: 'not_exist' })
  }

  if (!bcrypt.compareSync(data.password, user.dataValues.password)) {   
    // throw new Error('User does not exist.')
    return ({ error: 'not_exist' })
  }
  
  let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
    expiresIn: 86400 //43200 //1440
  })
  let decoded = jwt.verify(token, process.env.SECRET_KEY)

  let returnData = [{
    userPermission,
    'userAllData': JSON.stringify(userAllData),
    'token' : token,
    'exp': decoded.exp
  }]

  data.decodedId = decoded.id
  await this.updateUserStatus(data)

  if (data.push_token != null) {
    // await this.deleteUserDeviceByUserId(data.decodedId)
    await this.createUserDevice(data)
  }

  return returnData
}

exports.getUsers = async (data) => {
  let result = []

  if ( asAdmin.includes(data.role_val) ) {
    result = await this.getUserByPropertyQuery(data)
  } else {
    result = await this.getUserByProperty(data)
  }

  return result
}

exports.getUsersStaff = async (data) => {
  const userFilters = {};
  if (typeof data.is_deleted === "boolean") userFilters.is_deleted = data.is_deleted;
  const property = await Property.findOne({
    where: {
      ref: data.property_ref
    },
  })

  let result = await User.findAll({ 
    include: [
      { 
        model: UnitUser,
        include: [
          { model: Unit }
        ]
      },
      { 
        include: [
          { 
            model: UserRole,
            where: {
              val: {
                [Op.in]: ['admin', 'parent', 'super', 'manager']
              }
            }
          }
        ],
        model: UserOrgRole,
        where: {
          pmc_id: data.parent_org_id,
          property_id: property['dataValues']['id']
        }    
      }
    ],
  })

  result = result
    .filter(({ user_org_roles }) => !user_org_roles.is_clone)
    .map(user => ({ 
      id:user.id, 
      first_name:user.first_name, 
      last_name:user.last_name, 
      full_name: user.full_name, 
      email:user.email, 
      phone1:user.phone1, 
      user_org_role: user.user_org_roles, 
      is_deleted:user.is_deleted,
      user_org_role_name: user.user_org_roles.map(({user_role}) => user_role.name).join(), 
      unit_number: user.unit_users.map(({ unit }) => unit.number).join() 
    }));
  return result
}

exports.getUserByProperty = async (data) => {
  const userFilters = {};
  if (typeof data.is_deleted === "boolean") userFilters.is_deleted = data.is_deleted;
  const property = await Property.findOne({
    where: {
      ref: data.property_ref
    },
  })

  let result = await User.findAll({ 
    include: [
      { 
        model: UnitUser,
        include: [
          { model: Unit }
        ]
      },
      { 
        include: [
          { 
            model: UserRole,
            where: {
              val: {
                [Op.ne]: 'admin'
              }
            }
          }
        ],
        model: UserOrgRole,
        where: {
          pmc_id: data.parent_org_id,
          property_id: property['dataValues']['id']
        }    
      }
    ],
  })

  result = result
    .filter(({ user_org_roles }) => !user_org_roles.is_clone)
    .map(user => ({ 
      id:user.id, 
      first_name:user.first_name, 
      last_name:user.last_name, 
      full_name: user.full_name, 
      email:user.email, 
      phone1:user.phone1, 
      user_org_role: user.user_org_roles, 
      is_deleted:user.is_deleted,
      user_org_role_name: user.user_org_roles.map(({user_role}) => user_role.name).join(), 
      unit_number: user.unit_users.map(({ unit }) => unit.number).join() 
    }));
  return result
}

exports.getUserByPropertyQuery = async (data) => {
  // const result = await User.findAll({
  //   where: { is_deleted: false },
  //   include: [
  //     { 
  //       model: UnitResident,
  //       include: [
  //         { model: Unit }
  //       ]
  //     },
  //     { model: UnitUser },
  //     { model: CountryMaster },
  //     { model: Salutation },
  //     { model: UserRole },
  //     { 
  //       model: PropertyUser,
  //       include: [
  //         { 
  //           model: Property,
  //           where: {
  //             ref
  //           },
  //         },
  //       ],
  //       required: true,
  //       right: true 
  //     }   
  //   ],    
  //   required: true,
  //   right: true,
  //   order: [
  //     ['id', 'DESC']
  //   ],
  // })
  const userFilters = {};
  if (typeof data.is_deleted === "boolean") userFilters.is_deleted = data.is_deleted;
  const property = await Property.findOne({
    where: {
      ref: data.property_ref
    },
  })

  let result = await User.findAll({ 
    include: [
      { 
        model: UnitUser,
        include: [
          { model: Unit }
        ]
      },
      { 
        model: UserOrgRole,
        include: [
          { model: UserRole }
        ],
        where: {
          pmc_id: data.parent_org_id,
          property_id: property['dataValues']['id']
        }    
      }
    ],
    // where: { ...userFilters },
  })

  result = result
    .filter(({ user_org_roles }) => !user_org_roles.is_clone)
    .map(user => ({ 
      id:user.id, 
      first_name:user.first_name, 
      last_name:user.last_name, 
      full_name: user.full_name, 
      email:user.email, 
      phone1:user.phone1, 
      user_org_role: user.user_org_roles, 
      is_deleted:user.is_deleted,
      user_org_role_name: user.user_org_roles.map(({user_role}) => user_role.name).join(), 
      unit_number: user.unit_users.map(({ unit }) => unit.number).join() 
    }));
  return result
}

exports.getUserByPropertyUnit = async (data) => {
  const result = await User.findAll({
    include: [
      { 
        model: UnitResident,
        where: {
          unit_id: data.headersUnitId
        },
      },
      { model: CountryMaster },
      { model: Salutation },
      { model: UserRole },
      { 
        model: PropertyUser,
        include: [
          { 
            model: Property,
            where: {
              ref: data.headersPropertyRef
            },
          },
        ],
        required: true,
        right: true 
      },   
    ], 
    required: true,
    right: true,
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.getUserByRole = async (data) => {
  const result = await User.findAll({
    where: {
      pmc_id: data.decodedPmcId,
    },
    include: [
      { model: UnitUser },
      { model: CountryMaster },
      { model: Salutation },
      { 
        model: UserRole,
        where: {
          [Op.and]: [
            { access_level: { [Op.ne]: 100 } },
            { access_level: data.userAccessLevel }
          ]
        },            
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

exports.getPropertyManager = async (data) => {
  const property = await Property.findOne({
    where: {
      ref: data.headersPropertyRef
    },
  })

  const result = await User.findAll({
    include: [
      { 
        model: PropertyManager,
        where: {
          pmc_id: data.decodedPmcId,
          property_id: property['dataValues']['id']
        },          
      },
    ],    
    required: true,
    right: true,
    order: [
      ['id', 'DESC']
    ],
  }) 

  return result
}

exports.getUserById = async (data) => {
  const property = await Property.findOne({
    where: {
      ref: data.property_ref
    },
  })

  const result = await User.findAll({
    include: [
      { 
        model: VendorUser,
        include: [
          { model: Vendor }
        ], 
      },
      { model: CountryMaster },
      { model: Salutation },
      { model: Property },
      { 
        model: Approver, 
        where: { is_deleted: false }, 
        required: false 
      },
      { 
        model: UserOrgRole,
        where: { 
          pmc_id: data.parent_org_id,
          property_id: property['dataValues']['id']
        },        
        include: [
          { model: UserRole }
        ], 
      },
    ],
    where: { id: data.paramsId }
  })

  return result
}

exports.getUser = async (id) => {
  const result = await User.findAll({where: { id }})
  return result
}

exports.createUserOrgRoles = async ({ userOrgRoles, user_id }) => {
  const roles = [];
  for (const { properties, pmc_id, user_role_id } of userOrgRoles) {
    const other_data_obj = JSON.stringify({ properties });
    roles.push(
      ...properties
        .map(property_id => ({ 
          user_id,
          pmc_id,
          property_id,
          user_role_id,
          other_data_obj,
        }))
    );
  }
  await updateUserOrgRolesByUserId(user_id, roles);
}

exports.postUser = async (data) => {
  if(data.paramsId == -1) {
    const user = await User.findOne({
      where: { email: data.email }
    })

    if (user) {
      return ({error_message: 'An account already exists with this email address', result:null})
    }

    const result = await this.createUser({ ...data, generatePassword: true });
    data.user_id = result.id

    await this.postUpdatePass({ ...result, ...data });

    if (data.unit_id !== 0 && data.unit_id !== null) {
      await this.createUnitUser(data);    
    }

    await postUserDesignation(data)

    // const d = data.user_roles.map(({pmc_id, property_id, user_role_id, unit_id}) => ({
    //   user_id: result.dataValues.id,
    //   user_role_id,
    //   pmc_id,
    //   property_id,
    //   unit_id,
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // }))

    // const d = {
    //   user_id: result.dataValues.id,
    //   user_role_id: data.user_role_id,
    //   pmc_id: data.parent_id,
    //   property_id: data.property_id,
    //   unit_id: data.unit_id,
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // }

    // const addUserOrg = await updateUserOrgRolesByUserId(result.dataValues.id, d)
    // await this.createUserOrgRoles({ userOrgRoles: data.user_roles, user_id: result.dataValues.id });
    return ({ message: 'success', result });
  } else {
    const user = await User.findOne({
      where: { email: data.email }
    })

    if (user && data.email_old !== data.email) return ({error_message: 'An account already exists with this email address', result:null})
    await this.UpdateUser(data);
    // await this.createUserOrgRoles({ userOrgRoles: data.user_roles, user_id: data.paramsId });
    return ({ message: 'success' });
  }
}

exports.postUpdatePass = async ({ email, temporaryPassword, property_id }) => {
  const user = await User.findOne({
    where: { email }
  })

  if (user) {
    const { id, email, first_name } = user.dataValues;
    const { name: propertyName } = await propertyController.findPropertyById({ id: property_id });

    await User.update({ is_reset: 1 }, { where: { email } })

    let token = jwt.sign({ id, email }, process.env.SECRET_KEY, {
      expiresIn: '1h' //43200 //1440
    })

    let title =  `Welcome aboard, ${first_name}`
    let body = `You have a new account with ${propertyName}. Please use the following password ${temporaryPassword} to login into your portal.`
    /* let link = 'reset-password?t='+token
    let linkText = 'Set your password'
    sendEmail(userEmails, h1_title, p_body) */
    mailController.sendEmail(email, title, body);
  }

  return 'success'
}

exports.postUserPassword = async (data) => {
  const user = await User.findOne({
    where: { email: data.email }
  })

  if (!user) {
    return ({message: 'User does not exist!', result:null})
  }

  await this.UpdateUserPassword(data)

  return 'success'
}

exports.postResetPassword = async (data) => {
  const user = await User.findOne({
    where: { email: data.email }
  })

  if (!user.is_reset) {
    return({ error: 'This password reset link has expired. Try resetting your password again.' })
  }

  await this.UpdateUserPassword(data)

  return 'success'
}

exports.postRecoverPass = async (email) => {
  const user = await User.findOne({
    where: { email }
  })

  if (user) {
    const { id, email } = user.dataValues

    await User.update({ is_reset: 1 }, { where: { email } })

    let token = jwt.sign({ id, email }, process.env.SECRET_KEY, {
      expiresIn: '1h' //43200 //1440
    })

    let title =  'Reset your aXessPoint password'
    let body = `We received a request to reset the password for the aXessPoint account associated with ${user.dataValues.email}`
    let link = 'reset-password?t='+token
    let linkText = 'Reset your password'
    mailController.sendEmail2(email, title, body, link, linkText)
  }

  return 'success'
}

exports.importUser = async (data, params) => {
  let promises = []
  let user = null

  for (const [key, value] of Object.entries(data)) {
    let hashedPassword = await bcrypt.hash(value.password, 10)
    user = await User.findOne({
      where: { email: value.email }
    })

    if (!user) {
      data = {
        email: value.email,
        first_name: value.first_name,
        last_name: value.last_name,
        phone1: value.phone1,
        is_activated: 0,
        password: hashedPassword,
        updatedAt: today,
        createdAt: today
      }
      promises.push(saveUser(data));
    }
  }

  const user_result = await Promise.all(promises)
  const property_result = await Property.findOne({ where: {ref: params.property_ref} })
  const role_result = await UserRole.findOne({
    where: { 
      slug: 'user_owner_payer',
      pmc_id: parseInt(params.parent_org_id),
    }
  })

  const userOrgData = {
    decodedId: params.decodedId,
    user_id: user_result.map(({id}) => id),
    role_id: role_result.id,
    pmc_id: params.parent_org_id,
    property_id: property_result.id,
    type: 'assign'
  }
  const user_org = await userOrgRoleController.postUserOrgRole(userOrgData)

  // const property_user_data = user_result.map(({id}) => ({
  //   property_id: property['dataValues']['id'],
  //   user_id: id,
  //   createdAt: new Date(),
  //   updatedAt: new Date()
  // }))

  // const property_user_result = await PropertyUser.bulkCreate(property_user_data, { returning: true })

  return ({ message: 'success'});
}

exports.activateUser = async (id) => {
  const result = await User.update({
    is_deleted: 0,
    is_activated: 1
  }, {
    where: { id }
  })

  return 'success'
}

exports.confirmEmailRequest = async (email) => {
  const user = await User.findOne({where: {email}})
  if (!user) return 'success'

  const { id, first_name } = user
  let token = jwt.sign({ id, email }, process.env.SECRET_KEY, {
    expiresIn: '1h' //43200 //1440
  })

  let title =  'Verify Your Email'
  let body = `Thank you for signing up with aXessPoint. In order to complete the sign-up process, please click the confirmation button below`
  let link = 'confirm-email?t='+token
  let linkText = 'Confirm your email address'
  mailController.sendEmail2(email, title, body, link, linkText)

  return 'success'
}

exports.confirmEmail = async (data) => {
  const user = await User.findOne({where: {email:data.email}})
  if (user.is_activated) return 'email_confirmed'

  const result = await User.update({
    is_deleted: 0,
    is_activated: 1
  }, {
    where: { id: data.paramsId }
  })

  let title =  `Welcome to aXessPoint`
  let body = `Your email has been verified. Your account is now active.`
  mailController.sendEmail(data.email, title, body);

  return 'success'
}

exports.deleteUser = async (id) => {
  const result = await User.update({
    is_deleted: 1,
    is_activated: 0
  }, {
    where: { id }
  })

  return 'success'
}

exports.deleteUserDevice = async (push_token) => {
  const result = await UserDevice.destroy({
    where: {
      push_user_id: push_token
    }
  })

  return { message: 'logout' }
}

exports.deleteUserDeviceByUserId = async (user_id) => {
  const result = await UserDevice.destroy({
    where: { user_id }
  })

  return result
}

exports.findUserByToken = async (token) => {
  const result = await User.findOne({
    include: [
      { model: CountryMaster },
      { model: Salutation },
      { model: Property },
      {
        model: Approver, 
        where: { is_deleted: false }, 
        required: false
      },
      { 
        model: UserRole,
        include: [
          { model: UserRolePermission },
        ]
      },
      {
        model: UserDevice,
        where: {
          push_user_id: token
        }
      },
      { 
        model: VendorUser,
        include: [
          { model: Vendor },
        ]
      }, 
    ],     
    required: true,
    right: true 
  })

  return result
}

exports.findUser = async (token) => {
  const result = await User.findOne({
    include: [
      {
        model: UserDevice,
        where: {
          push_user_id: token
        }
      }
    ],
    required: true,
    right: true 
  })

  return result
}

exports.findUserByEmail = async (email) => {
  const result = await User.findOne({
    include: [
      { model: CountryMaster },
      { model: Salutation },
      { model: Property },
      {
        model: Approver, 
        where: { is_deleted: false }, 
        required: false
      },
      { model: UserRole },
      { 
        model: VendorUser,
        include: [
          { model: Vendor },
        ]
      },  
    ],     
    where: {
      email
    }
  })

  return result
}

exports.createUserDevice = async (data) => {
  const userDevice = await UserDevice.findOne({
    where: {
      push_user_id: data.push_token
    }
  })
  
  if (!userDevice) {
    await UserDevice.create({
      user_id: data.decodedId,
      push_user_id: data.push_token,
      logged_in: 0,
      updatedAt: today,
      createdAt: today
    })
  }

  return 'success'
}

export const createUser = async (data) => {
  const temporaryPassword = "p@ssword";//Math.random().toString(36).substr(2, 6);
  const password = data.generatePassword ? temporaryPassword : data.password;
  let hashedPassword = await bcrypt.hash(password, 10);
  const result = await User.create({
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    is_activated: 0,
    password: hashedPassword,
    profile_json: data.profile_json,
    phone1: data.phone1,
    dob: data.dob,
    middle_name: data.middle_name,
    phone2: data.phone2,
    salutation_id: data.salutation_id,
    suffix: data.suffix,
    notes: data.notes,
    avatar_filename: data.avatar_filename,
    city: data.city,
    country_id: data.country_id,
    address_line_1: data.address_line_1,
    province: data.province,
    address_line_2: data.address_line_2,
    postcode: data.postcode,
    user_role_id: data.user_role_id,
    emergency_contact_name: data.emergency_contact_name,
    relation: data.relation,
    emergency_contact_no: data.emergency_contact_no,
    pmc_id: data.parent_id,
    company_name: data.company_name,
    updatedAt: today,
    createdAt: today
  })

  return {...result.dataValues, temporaryPassword };
}

exports.createUnitUser = async (data) => {
  const result = await UnitUser.create({
    unit_id: data.unit_id,
    user_id: data.user_id,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  return result
}

exports.UpdateUser = async (data) => {
  let hashedPassword = await bcrypt.hash(data.password, 10)
  const result = await User.update({
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    is_activated: data.is_activated,
    // password: hashedPassword,
    profile_json: data.profile_json,
    phone1: data.phone1,
    dob: data.dob,
    middle_name: data.middle_name,
    phone2: data.phone2,
    salutation_id: data.salutation_id,
    suffix: data.suffix,
    notes: data.notes,
    avatar_filename: data.avatar_filename,
    city: data.city,
    country_id: data.country_id,
    address_line_1: data.address_line_1,
    province: data.province,
    address_line_2: data.address_line_2,
    postcode: data.postcode,
    user_role_id: data.user_role_id,
    emergency_contact_name: data.emergency_contact_name,
    relation: data.relation,
    emergency_contact_no: data.emergency_contact_no,
    pmc_id: data.pmc_id,
    updatedAt: today
  }, {
    where: { id: data.paramsId }
  })

  return result
}

exports.UpdateUserPassword = async (data) => {
  let hashedPassword = await bcrypt.hash(data.password, 10)
  const result = await User.update({
    password: hashedPassword,
    is_reset: 0,
    updatedAt: today
  }, {
    where: { id: data.paramsId }
  })

  let title =  'Your aXessPoint password has been changed'
  let body = `If you did not perform this action, let us know by replying directly to this email.`
  let linkText = 'Login'
  mailController.sendEmail(data.email, title, body, linkText)  

  return result
}

exports.updateUserStatus = async (data) => {
  const result = await User.update({
    updatedAt: today
  }, {
    where: {
      id: data.decodedId
    }
  })

  return result
}

const saveUser = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const result = User.create({
         email: data.email,
         first_name: data.first_name,
         last_name: data.last_name,
         is_activated: 0,
         password: data.password,
         profile_json: data.profile_json,
         phone1: data.phone1,
         dob: data.dob,
         middle_name: data.middle_name,
         phone2: data.phone2,
         salutation_id: data.salutation_id,
         suffix: data.suffix,
         notes: data.notes,
         avatar_filename: data.avatar_filename,
         city: data.city,
         country_id: data.country_id,
         address_line_1: data.address_line_1,
         province: data.province,
         address_line_2: data.address_line_2,
         postcode: data.postcode,
         user_role_id: data.user_role_id,
         emergency_contact_name: data.emergency_contact_name,
         relation: data.relation,
         emergency_contact_no: data.emergency_contact_no,
         pmc_id: data.pmc_id,
         updatedAt: today,
         createdAt: today
      })

      resolve(result)
    } catch(err) {
      reject(err.toString('utf8'))
    }
  })
}

export const bulkCreate = async (users) => {
  return await User.bulkCreate(users, { 
    ignoreDuplicates: true,
    returning: true,
  });
}

export const getTemporaryPassword = async() => {
  const password = Math.random().toString(36).substr(2, 6);
  return { 
    password,
    hashed: await bcrypt.hash(password, 10),  
  }
};

export const registerUser = async(data) => {
  const result = { status: 'failed'};
  const {
    user_id,
    property_id,
    role_id: user_role_id,
    unit_id,
    email,
    salutation_id,
    first_name,
    last_name,
    middle_name,
    suffix,
    dob,
    phone1,
    phone2,
    password,
    confirm_password
  } = data

  const isEmailExist = await User.findOne({ where: { email }})
  if (isEmailExist) return result.message = 'Email exists.'
  if (password === confirm_password) return result.message = 'The password confirmation does not match.'

  const hashedPassword = await bcrypt.hash(password, 10);
  const userData = {
    id: user_id,
    email,
    first_name,
    last_name,
    middle_name,
    suffix,
    salutation_id,
    user_role_id,
    property_id,
    phone1,
    phone2,
    dob,
    password: hashedPassword,
    updatedAt: new Date()
  }
  const newUser = await User.upsert(userData)

  return { status: 'success', message: 'Your request has been sent to the propery manager'};
}

export const isEmailExist = async(email) => {
  const user = await User.findOne({ where: { email }});
  return !!user;
}