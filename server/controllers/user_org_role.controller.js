const UserOrgRole = require('../models/user_org_role')
const UserRole = require('../models/user_role')
const UserRolePermission = require('../models/user_role_permission')
const UserRolePMC = require('../models/user_role_pmc')
const Property = require('../models/property')
const ParentOrg = require('../models/pmc')
const User = require('../models/user')
const Unit = require('../models/unit')
const Sequelize = require('sequelize')
const user_org_role = require('../models/user_org_role')
const Op = Sequelize.Op
const today = new Date()
const notificationController = require('../controllers/notification.controller');
const propertyController = require('./property.controller')
const userController = require('../controllers/user.controller')
const {getSubUserRole} = require('../controllers/user_role.controller');

UserOrgRole.belongsTo(ParentOrg, {targetKey:'id',foreignKey: 'pmc_id'})
UserOrgRole.belongsTo(Property, {targetKey:'id',foreignKey: 'property_id'})
UserOrgRole.belongsTo(UserRole, {targetKey:'id',foreignKey: 'user_role_id'})
UserOrgRole.belongsTo(User, {targetKey:'id',foreignKey: 'user_id'})

exports.setUserOrgRoleByUserId = async (data) => {
  const result = await UserOrgRole.findAll({
    include: [
      { 
        model: ParentOrg,
        attributes: ['id','name'],
        where: { is_deleted: false }
      },
      { 
        model: Property,
        attributes: ['id', 'ref', 'pmc_id', 'name', 'code', 'is_active']
      },
      { model: UserRole }
    ],
    required: true,
    right: true,
    where: { user_id: data.decodedId },
    // limit: data.limit,
    order: [
      ['user_role_id', 'ASC'],
      ['pmc_id', 'ASC']
    ],
  })

  //set parent org
  let initSelectedParentOrg = 0
  let initOptionParentOrg = [{
    id: 0,
    name:'No Parent Available'
  }]

  let optionParentOrg = result
  .filter(result => {
    if (result.pmc === null) return 0
    result.pmc.name = result['pmc']['name'].length > 20 ? result.pmc.name.substring(0,20)+".." : result.pmc.name
    return result
  })
  .map(({pmc}) => pmc)
  optionParentOrg = [...new Map(optionParentOrg.map(item => [item['id'], item])).values()]
  optionParentOrg = optionParentOrg.length > 0 ? optionParentOrg : initOptionParentOrg

  const objPOSlice = optionParentOrg.slice(0);
  optionParentOrg = objPOSlice.sort(function(a,b) {
    let x = a.name.toLowerCase();
    let y = b.name.toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
  });

  //set role
  const sub_role_data = {
    parent_org_id: optionParentOrg[0]['id'],
    decodedId: data.decodedId
  }
  const optionRoleOrg = await getSubUserRole(sub_role_data)

  //set property
  let initSelectedProperty = '0'
  let initOptionProperty = [{
    ref: '0',
    name:'No Property Available'
  }]

  let optionProperty = result
  .filter(result => {
    if (result.pmc===null || result.property===null) return 0
    if (result.property.name===null) return 0
    result['property']['name'] = result['property']['name'].length > 20 ? result.property.name.substring(0,20)+".." : result['property']['name']
    return result.user_role !== null && (result.property.pmc_id === optionParentOrg[0]['id']) ? result['property']['name'] : 0
  })
  .filter(({ property }) => property.is_active)
  .map(({property}) => property)
  optionProperty = optionProperty.length > 0 ? optionProperty : initOptionProperty
  optionProperty = [...new Map(optionProperty.map(item => [item['id'], item])).values()]

  if (optionProperty[0].ref === '0') {
    throw new Error(`No Property found`)
  } else if (optionParentOrg[0].id === 0) {
    throw new Error(`No Parent Org found`)
  }

  return {
    objPOSlice,
    result,
    'defaultParentOrg': optionParentOrg[0],
    'defaultRoleOrg': optionRoleOrg[0],
    'defaultProperty': optionProperty[0],
    optionParentOrg,
    optionRoleOrg,
    optionProperty
  }
}

exports.getUserOrgRoleByQuery = async (data) => {
  const result = await UserOrgRole.findAll({
    include: [
      { 
        model: ParentOrg,
        attributes: ['id','name']
      },
      { 
        model: Property,
        attributes: ['id', 'ref', 'pmc_id', 'name', 'code']
      },
      { model: UserRole }
    ],
    where: { 
      user_id: data.decodedId
    },
    // group: ['pmc.id'],
    order: [
      [{model: ParentOrg, as: 'ParentOrg'}, 'name', 'ASC'],
      [{model: Property, as: 'Property'}, 'name', 'ASC'],
    ]
  })

  //get parent org
  let optionParentOrg = []
  let initSelectedParentOrg = 0
  let initOptionParentOrg = [{
    id: 0,
    name:'No Parent Available'
  }]

  if (false) { //data.role_val === 'admin'
    optionParentOrg = await ParentOrg.findAll({})
    .filter(result => {
      if (result.pmc === null) return 0
      result.name = result['name'].length > 20 ? result.name.substring(0,20)+".." : result.name
      return result
    })
    optionParentOrg = optionParentOrg.length > 0 ? optionParentOrg : initOptionParentOrg
  } else {
    optionParentOrg = result
    .filter(result => {
      if (result.pmc === null) return 0
      result.pmc.name = result['pmc']['name'].length > 20 ? result.pmc.name.substring(0,20)+".." : result.pmc.name
      return result
    })
    .map(({pmc}) => pmc)
    optionParentOrg = [...new Map(optionParentOrg.map(item => [item['id'], item])).values()]
    optionParentOrg = optionParentOrg.length > 0 ? optionParentOrg : initOptionParentOrg
  }

  //get role
  let optionRoleOrg = result
  .filter(result => {
    if (result.pmc ===null) return 0
    return result.user_role !== null ? 
    result.user_role : 0
  })
  .map(({user_role}) => user_role)
  .sort((a, b) => { 
    // return a.id - b.id  ||  a.id.localeCompare(b.id);
    return a.dataValues.id - b.dataValues.id
  })
  optionRoleOrg = [...new Map(optionRoleOrg.map(item => [item['id'], item])).values()]

  //get property
  let initSelectedProperty = '0'
  let initOptionProperty = [{
    ref: '0',
    name:'No Property Available'
  }]
  let optionProperty = []

  if (optionRoleOrg[0]['val'] === 'admin') {  
    optionProperty = await Property.findAll({
      where: { 
        pmc_id: data.parent_org_id
      },
      order: [
        ['id', 'DESC']
      ],
    })

    optionProperty.filter(result => {
      result.name = (result['name'].length > 20) ? result.name.substring(0,20)+".." : result.name
    })
    optionProperty = optionProperty.length > 0 ? optionProperty : initOptionProperty
  } else {
    optionProperty = result
    .filter(result => {
      if (result.pmc===null || result.property===null) return 0
      return result.user_role !== null && 
      (result.property.pmc_id === data.parent_org_id && result.pmc.id === data.parent_org_id) ?
      (result['property']['name'].length > 20) ? 
      result.property.name.substring(0,20)+".." : result.property.name : 0
    })
    .map(({property}) => property)
    optionProperty = [...new Map(optionProperty.map(item => [item['id'], item])).values()]
    optionProperty = optionProperty.length > 0 ? optionProperty : initOptionProperty
  }

  return {
    result,
    'defaultParentOrg': optionParentOrg[0],
    'defaultRoleOrg': optionRoleOrg.length===0?'no_user_type_defined':optionRoleOrg[0],
    'defaultProperty': optionProperty[0],
    optionParentOrg,
    optionRoleOrg,
    optionProperty
  }
}

exports.getUserOrgRole = async (data) => {
  const result = await UserOrgRole.findAll({
    include: [
      { model: User },
      { model: UserRole },
      { model: ParentOrg },
      { model: Property },
      { model: Unit }
    ],
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.getUserOrgRoleByUserId = async ({ user_id }) => {
  const result = await UserOrgRole.findAll({
    include: [
      { model: User },
      { model: UserRole },
      { model: ParentOrg },
      { model: Property },
      { model: Unit }
    ],
    where: { user_id },
    order: [
      ['id', 'DESC']
    ],
  })
  return result
}

exports.getPortfolioByQuery = async (data) => {
  let result = [] 
  let initSelectedParentOrg = 0
  let initOptionParentOrg = [{
    id: 0,
    name:'No Parent Available'
  }]

  if (false) { //data.role_val === 'admin'
    result = await ParentOrg.findAll({})
    if (data.type === 'overflow') {
      result = result.filter(result => {
        if (result === null) return 0
        result.name = result['name'].length > 20 ? result.name.substring(0,20)+".." : result.name
        return result
      })
    }
    result = result.length > 0 ? result : initOptionParentOrg
  } else {
    result = await UserOrgRole.findAll({
      include: [{ model: ParentOrg, where: { is_deleted: false } }, { model: UserRole }],
      where: { user_id: data.decodedId },
      order: [[{model: ParentOrg, as: 'ParentOrg'}, 'name', 'ASC']]
    })
    if (data.type === 'overflow') {
      result = result.filter(result => {
        if (result.pmc === null) return 0
        result.pmc.name = result['pmc']['name'].length > 20 ? result.pmc.name.substring(0,20)+".." : result.pmc.name
        return result
      })
    }
    result = result.filter((result) => result.pmc!==null).map(({pmc})=>pmc)
    result = [...new Map(result.map(item => [item['id'], item])).values()]
    result = result.length > 0 ? result : initOptionParentOrg
  }
  return result
}

exports.getRoleByQuery = async (data) => {
  data.property_id = await this.findPropertyByPropertyRef(data.property_ref)

  const result = await UserOrgRole.findAll({
    include: [
      { model: UserRole }
    ],
    where: { 
      pmc_id: data.parent_org_id,
      user_id: data.decodedId
    },
    // *group: ['user_role_id'],
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.getPropertyByParentOrgId = async (data) => {
  let initSelectedProperty = '0'
  let initOptionProperty = [{
    ref: '0',
    name:'No Property Available'
  }]
  let optionProperty = []
  const result = await UserOrgRole.findAll({
    include: [
      { 
        model: ParentOrg,
        attributes: ['id', 'name']
      },
      { 
        model: Property,
        attributes: ['id', 'ref', 'pmc_id', 'name', 'code'],
        where: { is_active: true }
      },
      { model: UserRole }
    ],
    where: { 
      pmc_id: data.parent_org_id,
      user_id: data.decodedId
    },
    // *group: ['property.id']
  })

  optionProperty = result
  .filter(result => {
    if (result.pmc===null || result.property===null) return 0
    result['property']['name'] = result['property']['name'].length > 20 ? result.property.name.substring(0,20)+".." : result['property']['name']
    return result.user_role !== null && (result.property.pmc_id === data.parent_org_id) ? result['property']['name'] : 0
  })
  .map(({property}) => property)
  optionProperty = optionProperty.length > 0 ? optionProperty : initOptionProperty
  optionProperty = [...new Map(optionProperty.map(item => [item['id'], item])).values()]


  return optionProperty
}

exports.getPortfolioById = async (data) => {
  let result = []
  if (false) { //data.role_val === 'admin'
    result = await ParentOrg.findAll({
      where: { 
        id: data.paramsId
      }
    })
  } else {
    result = await UserOrgRole.findAll({
      include: [{ model: ParentOrg }],
      where: { 
        pmc_id: data.paramsId,
        user_id: data.decodedId
      },
      // *group: ['pmc_id'],
      order: [[{model: ParentOrg, as: 'ParentOrg'}, 'name', 'ASC']]
    })
    .map(({pmc}) => pmc)
  }

  return result
}

exports.getPermissionByQuery = async (data) => {
  const result = await UserRole.findAll({
    where: { 
      id: data.role_id
    }
  })

  return result
}

exports.postUserOrgRole = async (data) => {
  let userOrgRole = 0
  let promises = []
  let d = []
  let type = data.type
  data.property_id = data.property_id === undefined ? 0 : data.property_id

  const property = await Property.findOne({ where: { id:data.property_id } })
  if (!property) throw new Error(`No property found.`);

  const admin_roles = ['admin']
  let super_admins = await this.findSuperAdminsByRoleVal(admin_roles)  
  data.user_id = data.type==='add' ? [...new Map(super_admins.map(item => [item['user_id'], item])).values()] : data.user_id
  data.user_id = data.type==='add' ? data.user_id.map(({user_id}) =>  user_id ) : data.user_id

  for (const [key, value] of Object.entries(data.user_id)) {
    userOrgRole = await UserOrgRole.findAll({
      where: {
        user_id: value,
        user_role_id: data.role_id,
        pmc_id: data.pmc_id,
        property_id: data.property_id,
      }
    })

    if (userOrgRole.length === 0) {
      d = {
        user_id: value,
        user_role_id: data.role_id,
        pmc_id: data.pmc_id,
        property_id: data.property_id,
        is_clone: data.is_clone,
        updatedAt: today,
        createdAt: today
      }
      promises.push(this.saveUserOrgRole(d));
    }
  }

  await Promise.all(promises)
  data.type = 'overflow'
  const result = await this.getPortfolioByQuery(data)

  let user_role = await this.getPermissionByQuery(data)
  let is_admin = admin_roles.includes(user_role[0]['dataValues']['val'])

  if ( !is_admin || d.length===0 || type==='assign' ) return result

  let user = await User.findAll({where: {id: d.user_id}})
  let userData = []
  let userEmails = []

  user.map( async(r) => {
    if (user !== null) {
      userData.push({
        userId: r['id'],
        userEmail: r['email']
      }) 

      userEmails.push(r['email'])
    }
  }) 
 
  data.notificationType = 'multiple'
  data.userId = null
  data.userEmail = null

  const notification_data = {
    title: 'Parent Organization',
    webBody: `You have a new account with ${property['dataValues']['name']} please use the following password to login into your portal.`,
    mobileBody: `You have a new account with ${property['dataValues']['name']} please use the following password to login into your portal.`,
    emailBody: `You have a new account with ${property['dataValues']['name']} please use the following password to login into your portal.`,
    propertyId: data.property_id,
    decodedId: data.decodedId,
    send_by: data.decodedId,
    type: data.notificationType,
    userData: userData,
    user_id: data.userId,
    email: data.userEmail,
    emails: userEmails,
    updatedAt: new Date(),
    createdAt: new Date()
  }
  notificationController.webMobileEmailNotification(notification_data)

  return result
}

exports.findSuperAdminsByRoleVal = async (val) => {
  const result = await UserOrgRole.findAll({
    include: [
      { model: User },
      { 
        model: UserRole,
        where: { val }
      }
    ]
  })

  return result
}

exports.findPropertyByPropertyRef = async (ref) => {
  const result = await Property.findOne({
    where: { ref }
  })

  return result.dataValues.id
}

exports.createRole = async ({ user_id, pmc_id, property_id, user_role_id }) => {
  return await UserOrgRole.Role({
    user_id,
    property_id,
    pmc_id,
    user_role_id,
    createdAt: new Date(),
  })
}

exports.updateUserOrgRolesByUserId = async (user_id, items) => {
  await UserOrgRole.destroy({ where: { user_id }});
  const userorg = await UserOrgRole.bulkCreate(items);
  return userorg;
}

exports.saveUserOrgRole = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const userPM = UserOrgRole.create({
        user_id: data.user_id,
        user_role_permission_id: data.user_role_permission_id,
        user_role_id: data.user_role_id,
        pmc_id: data.pmc_id,
        property_id: data.property_id,
        is_clone: data.is_clone,
        updatedAt: today,
        createdAt: today
      })

      resolve(userPM)
    } catch(err) {
      reject(err.toString('utf8'));
    }
  })
}

exports.deleteUserOrgRoleById = async (data) => {
  await UserOrgRole.destroy({
    where: { id: data.paramsId }
  })

  data.type = 'overflow'
  const result = await this.getPortfolioByQuery(data)

  return result
}

exports.deleteUserOrgRoleByPropertyId = async (data, user_id) => {
  data.property_id = await this.findPropertyByPropertyRef(data.property_ref)

  await UserOrgRole.destroy({
    where: { 
      user_id,
      pmc_id: data.parent_org_id,
      property_id: data.property_id
    }
  })

  return 'success'
}

exports.getRole = async (data) => {
  
  const role = await user_org_role.findOne({ 
   include: [{ model: UserRole }],
   where: { 
    user_id: data.user_id,
    pmc_id: data.pmc_id,
    property_id: data.property_id,
  },
  });
  if (!role) throw new Error(`No user org role found.`);
  return role.dataValues;
}

exports.notifUser = async ({ title, message, property_id, user_id, email, sender_id }) => {
  const notif = {
    title,
    webBody: message,
    mobileBody: message,
    emailBody: message,
    propertyId: property_id,
    propertyResId: property_id,
    decodedId: user_id,
    send_by: sender_id,
    user_id,
    email,
    updatedAt: new Date(),
    createdAt: new Date(),
  }
  return notificationController.webMobileEmailNotification(notif)
}

exports.assignNewParentAdminRoleByEmail = async({ pmc_id, property_id, email, first_name, last_name, sender_id }) => {
  const roleOrg = await UserOrgRole.findOne({ 
    include: [{ model: User, where: { email } }],
  });
  const { name: propertyName } = await propertyController.findPropertyById({ id: property_id });
  let userData = {};

  if (roleOrg) {
    userData = { ...roleOrg.user, user_id: roleOrg.user.id, userExists: true};
  } else {
    const isUserExist = await User.findOne({ where: { email }});
    if (isUserExist) throw new Error('Email exists.');
    const user = await userController.createUser({
      email,
      generatePassword: true,
      first_name,
      last_name,
    });
    userData = { 
      user_id: user.id, 
      temporaryPassword: user.temporaryPassword 
    };
  }

  const { user_id } = userData;
  const { id: user_role_id } = await UserRole.findOne({ where: { 
    pmc_id, 
    property_id, 
    val: 'parent',
    parent_id: { [Op.ne]: 0 },
  }});
  const data = {
    pmc_id,
    property_id,
    user_id,
    user_role_id,
  }
  await UserOrgRole.create(data);
  const notif = {
    title: `Welcome aboard, ${propertyName}`,
    message: 
      userData.userExists 
      ?`You may now set up all the necessary configuration for your property.`
      : `Please use this temporary password ${userData.temporaryPassword} to set up all the necessary configuration for your property.`,
    property_id,
    user_id,
    email,
    sender_id,
  };
  this.notifUser(notif);
}


exports.findUserOrgRoleByQuery = async(filters) => {
  return await UserOrgRole.findOne({ where: filters })
}

export const bulkCreate = async (users) => {
  return await UserOrgRole.bulkCreate(users, { 
    ignoreDuplicates: true,
    returning: true,
  });
}