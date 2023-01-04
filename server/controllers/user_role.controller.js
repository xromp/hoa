const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')
const UserRole = require('../models/user_role')
const UserRolePMC = require('../models/user_role_pmc')
const UserOrgRole = require('../models/user_org_role')
const UserRolePermission = require('../models/user_role_permission')
const Property = require('../models/property')
const UserRoleDefault = require('../models/user_role_default')
const User = require('../models/user')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const today = new Date()

UserRole.belongsTo(Property, {targetKey:'id',foreignKey: 'property_id'})
UserRole.belongsTo(User, {targetKey:'user_role_id',foreignKey: 'id'})
UserRole.belongsTo(UserOrgRole, {targetKey:'user_role_id',foreignKey: 'id'})

exports.getParentUserRole = async (data) => {
  const user_role = await this.findUserRoleByParentId(data)

    result = await UserRole.findAll({
      // attributes: ['id', 'name', 'description', 'val', 'slug', 'access_level', 'permission'], 
      where: {
        parent_id: 0,
        // parent_id: {
        //   [Op.ne]: 0
        // },
        pmc_id: data.parent_org_id
      },
      required: true,
      right: true,
      order: [
        ['id', 'ASC'],
      ],
    })

  return result
}

exports.getSubUserRole = async (data) => {
  const user_role = await this.findUserRoleByParentId(data)

  let default_class = []
  for (const [key, value] of Object.entries(['admin', 'parent', 'super', 'manager'])) {
    if (value === user_role) { break}
    default_class.push(value)
  }

  if (user_role === 'admin') {
    result = await UserRole.findAll({
      // attributes: ['id', 'name', 'description', 'val', 'slug', 'access_level', 'permission'], 
      where: {
        // parent_id: 0,
        parent_id: {
          [Op.ne]: 0
        },
        pmc_id: data.parent_org_id
      },
      required: true,
      right: true,
      order: [
        ['id', 'ASC'],
      ],
    })
  } else if (user_role === 'parent' || user_role === 'super' || user_role === 'manager') {
    result = await UserRole.findAll({
      // attributes: ['id', 'name', 'description', 'val', 'slug', 'access_level', 'permission'],
      where: {
        val: {
          [Op.notIn]: default_class
        },
        parent_id: {
          [Op.ne]: 0
        },        
        pmc_id: data.parent_org_id
      },
      order: [
        ['id', 'ASC'],
      ],
    })
  } else {
    result = await UserOrgRole.findAll({
      include: [
        { model: UserRole }
      ], 
      where: {
        pmc_id: data.parent_org_id,
        user_id: data.decodedId
      }
    }).map(({user_role}) => user_role)

    result = [...new Map(result.map(item => [item['id'], item])).values()]
  }
  return result
}

exports.getUserRoleByParentOrg = async (data) => {
  let result = []
  const user_role = await this.findUserRoleByParentId(data)
  const property = await this.findPropertyByPropertyRef(data.property_ref)
  data.propertyId = property['dataValues']['id']

  let default_class = []
  for (const [key, value] of Object.entries(['admin', 'parent', 'super', 'manager'])) {
    if (value === user_role) { break}
    default_class.push(value)
  }

  if (user_role === 'admin') {    
    result = await UserRole.findAll({
      where: {
        pmc_id: data.parent_org_id,
        // property_id: data.propertyId
      },
      order: [
        ['access_level', 'DESC']
      ],
    })
  } else {
    result = await UserRole.findAll({
      where: {
        pmc_id: data.parent_org_id,
        // property_id: data.propertyId,
        // access_level: {
        //   [Op.lt]: 99
        // },
        val: {
          [Op.notIn]: default_class
        },
      },
      order: [
        ['access_level', 'DESC']
      ],
    })    
  }

  return result
}

exports.getSubUserRoleByParentId = async (data) => {
  const result = await UserRole.findAll({
    where: {
      parent_id: data.parent_id,
      [Op.or]: [
        { pmc_id: 0 },
        { pmc_id: data.parent_org_id }
      ]
    },
    order: [
      ['name', 'ASC']
    ],
  })  

  return result
}

exports.getUserRoleByParentId = async (data) => {
  const result = await UserRole.findOne({
    include: [
      { model: Property }
    ],    
    where: { 
      id: data.parent_id,
      pmc_id: data.parent_org_id,
    }
  })

  return result
}

exports.getUserRoleById = async (data) => {
  const result = await UserRole.findOne({
    include: [
      { model: Property }
    ],    
    where: { 
      id: data.paramsId,
      pmc_id: data.parent_org_id,
    }
  })

  return result
}

exports.getUserRoleBySlug = async (pmc_id, slug) => {
  const result = await UserRole.findOne({
    include: [
      { model: Property }
    ],    
    where: { slug, pmc_id, parent_id: {[Op.ne]: 0} }
  })

  return result
}

exports.postUserRole = async (data) => {
	let result = []	

  if(data.paramsId == -1) {
    const property = await this.findPropertyByPropertyRef(data.property_ref)
    if (!property) {
      return({ error: 'No selected property.' })
    }
    data.property_id = property['dataValues']['id']
    const user_role = await this.getUserRoleByParentId(data)

    if (!user_role) {
      return({ error: 'No selected parent role.' })
    }

    data.val = user_role['dataValues']['val']
    data.permission = data.type === 'parent' ? data.permission : user_role['dataValues']['permission']
    data.slug = user_role['dataValues']['slug'] //data.val+'_'+data.name.toLowerCase().split(' ').join('_')
    result = await this.createUserRole(data)
  } else {
    result = await this.updateUserRole(data)
  }	

  return result
}

exports.postUserRolePermission = async (data) => {
  const userRoles = await UserRoleDefault.findAll({ where: { parent_id: 0 }});
  const parentRoles = [];
  const userOrgRoles = [];
  for (const { id, val, slug, access_level, name, description, permission } of userRoles) {
    const role = {
      val, 
      slug, 
      access_level, 
      name, 
      description, 
      permission,
      parent_id: 0,
      property_id: data.property_id,
      pmc_id: data.parent_org_id,
      user_role_default_id: id,
      createdAt: today,
    };
    const { dataValues } = await UserRole.create(role);
    parentRoles.push(dataValues)
    const subRoles = await UserRoleDefault.findAll({ where: { parent_id: id }});
    const roles = subRoles.map(({ id, val, slug, access_level, name, description, permission }) => ({
      val, 
      slug, 
      access_level, 
      name, 
      description, 
      permission,
      parent_id: dataValues.id,
      property_id: data.property_id,
      pmc_id: data.parent_org_id,
      user_role_default_id: id,
      createdAt: today,
    }));
    let result = await UserRole.bulkCreate(roles);
    userOrgRoles.push(result)
  }
  return userOrgRoles.reduce((acc, val) => acc.concat(val), [])
}

exports.deleteUserRoleById = async (id) => {
	const result = await UserRole.destroy({
    where: { id }
  })

  return 'success'
}

exports.createUserRole = async (data) => {
  const result = await UserRole.create({
    parent_id: data.parent_id,
    property_id: data.property_id,
    pmc_id: data.parent_org_id,
    access_level: 90,
    name: data.name,
    val: data.val,
    slug: data.slug,
    permission: data.permission,
    description: data.description,
    createdAt: today
  })

  return result
}

exports.updateUserRole = async (data) => {
  const result = await UserRole.update({
    parent_id: data.parent_id,
    // property_id: data.decodedPropertyId,
    name: data.name,
    description: data.description,
    permission: data.permission,
    updatedAt: today
  }, {
    where: {
      id: data.paramsId
    }
  })

  return result
}

exports.findPropertyByPropertyRef = async (ref) => {
  const result = await Property.findOne({
    where: { ref }
  })

  return result
}

exports.findUserOrgRoleByRoleId = async (user_role_id) => {
  const result = await UserOrgRole.findOne({
    include: [
      { model: UserRole }
    ], 
    where: {
      user_role_id
    }
  })

  return result['dataValues']['user_role']['val']
}

exports.findUserRoleByParentId = async (data) => {
  const result = await UserOrgRole.findOne({
    include: [
      { model: UserRole }
    ], 
    where: {
      pmc_id: data.parent_org_id,
      user_id: data.decodedId
    },
    order: [
      ['user_role_id', 'ASC']
    ],  
  })

  return result['dataValues']['user_role']['val']
}

exports.getUserRoleByQuery = async(filter) => {
  return await UserRole.findOne({ where: filter });
}