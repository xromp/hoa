const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')
const Unit = require('../models/unit')
const UnitResident = require('../models/unit_resident')
const UnitUser = require('../models/unit_user')
const Property = require('../models/property')
const User = require('../models/user')
const UserOrgRole = require('../models/user_org_role')
const Country = require('../models/country_master')
const today = new Date()

Unit.belongsTo(Property, {foreignKey: 'building_id'})
Unit.hasMany(UnitUser, {foreignKey: 'unit_id'})
UnitUser.belongsTo(User, { foreignKey: 'user_id'})
UserOrgRole.belongsTo(User, {targetKey:'id',foreignKey: 'user_id'})
UserOrgRole.belongsTo(Unit, {targetKey:'id',foreignKey: 'unit_id'})
User.belongsTo(Country, { targetKey:'id',foreignKey: 'country_id'})
let asAdmin = ['admin', 'parent', 'super', 'manager']

exports.getUnits = async (data) => {
  let result = null
  if ( asAdmin.includes(data.role_val) ) {
    result = await this.getUnitByQuery(data)
  } else if(data.role_val === 'vendor') {
    result = await this.getUnitByVendor(data)
  } else {
    result = await this.getUnitByUserId(data)
  }

  return result
}

exports.getUnitByVendor = async (data) => {
  const result = await Unit.findAll({
    where: {
      is_active: true
    },
    include: [
      { model: Property },
      { model: UnitUser, include: [ { model: User, include: [ Country ]} ] }
    ],
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.getUnitByQuery = async (data) => {
  const property = await Property.findOne({
    where: { ref: data.property_ref }
  });
  data.property_id = property['dataValues']['id']


  const result = await Unit.findAll({
    where: {
      building_id: data.property_id,
      parent_org_id: data.parent_org_id,
      is_active: true
    },
    include: [
      { model: Property },
      { model: UnitUser, include: [ { model: User, include: [ Country ]} ] }
    ],
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.getUnitUser = async (data) => {
  const property = await Property.findOne({
    where: { ref: data.property_ref }
  })  

  const result = await UnitUser.findAll({
    where: {
      user_id: data.paramsId
    },
    include: [
      { model: User },
      { 
        model: Unit,
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

exports.getUnitByUserId = async (data) => {
  const property = await Property.findOne({
    where: {
      ref: data.property_ref
    },
  })   

  const result = await Unit.findAll({
    where: {
      building_id: property['dataValues']['id'],
      is_active: true
    },    
    include: [
      { model: Property },
      { 
        model: UnitUser,
        where: {
          user_id: data.decodedId
        },        
      },
    ],
    order: [
      ['id', 'DESC']
    ],
  })
  return result
}

exports.getUnitByPropertyIds = async (building_id) => {
  const result = await Unit.findAll({
    where: { 
      building_id, 
      is_active: true
    },
    include: [
      { model: Property },
      { model: UnitResident, include: [ User ] }
    ],
    order: [
      ['id', 'DESC']
    ],
  }) 

  return result
}

exports.getUnitByPropertyId = async (data) => {
  let property = null

  if (data.paramsType === 'property_ref') {
    property = await Property.findOne({
      where: {
        ref: data.paramsVal
      },
    })   
  } else {
    property = await Property.findOne({
      where: {
        id: data.paramsVal
      },
    }) 
  }

  const result = await Unit.findAll({
    where: {
      building_id: property['dataValues']['id'],
      is_active: true
    },    
    include: [
      { model: Property },
      { 
        model: UnitResident
      },
    ],
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.getUnitById = async (data) => {
  const property = await Property.findOne({
    where: {
      ref: data.property_ref
    },
  })

  const result = Unit.findAll({
    where: { 
      id: data.paramsId,
      building_id: property['dataValues']['id'],
      parent_org_id: data.parent_org_id,
      is_active: true
    },
    include: [
      { model: Property },
    ],
    order: [
      ['id', 'DESC']
    ]
  })

  return result
}

exports.getUnitByUnitNumber = async (number, building_id) => {
  const result = Unit.findOne({
    where: { 
      number, 
      building_id, 
      is_active: true 
    },
    include: [
      { model: Property },
    ],
    order: [
      ['id', 'DESC']
    ]
  })

  return result
}

exports.getUnit = async () => {
  const result = await Unit.findAll({
    where: { is_active: true },
    include: [
      { model: Property },
      { model: UnitResident, include: [ User ] }
    ],
    order: [
      ['id', 'DESC']
    ],
  }) 

  return result
}

exports.postUnit = async (data) => {
	let result = []
  let unit_number = null

  if(data.paramsId == -1) {
    const property = await Property.findOne({
      where: {
        ref: data.property_ref
      },
    })

    unit_number = await this.getUnitByUnitNumber(data.number, data.building_id)

    if (unit_number !== null) {
      return({ error_message: 'Unit Number has already added in the Building.' })
    }

    result = await Unit.create({
      number: data.number,
      building_id: property['dataValues']['id'],
      parent_org_id: data.parent_org_id,
      createdAt: today,
      unit_square_feet: data.unit_square_feet,
      hoa_fee: data.hoa_fee,
      parking_stall_number: data.parking_stall_number,
      wine_locker_number: data.wine_locker_number,
      storage_unit_number: data.storage_unit_number,
      surfboard_storage: data.surfboard_storage,
      bike_storage: data.bike_storage,
      kayak_storage_number: data.kayak_storage_number,
      boat_storage_number: data.boat_storage_number,
      updatedAt: today,
      unit_status_id: data.unit_status_id,
      is_high_security: data.is_high_security,
      high_security_note: data.high_security_note,
      votes_pci: data.votes_pci,
      maint_fee: data.maint_fee,
      reserve_fee: data.reserve_fee,
      rec_fee: data.rec_fee,
    })
  } else {  
    unit_number = await this.getUnitByUnitNumber(data.number, data.building_id)

    if (unit_number !== null && data.unit_number !== data.number) {
      return({ error_message: 'Unit Number has already added in the Building.' })
    }

    result = await Unit.update({
      number: data.number,        
      building_id: data.building_id,
      parent_org_id: data.parent_org_id,
      unit_square_feet: data.unit_square_feet,
      hoa_fee: data.hoa_fee,
      parking_stall_number: data.parking_stall_number,
      wine_locker_number: data.wine_locker_number,
      storage_unit_number: data.storage_unit_number,
      surfboard_storage: data.surfboard_storage,
      bike_storage: data.bike_storage,
      kayak_storage_number: data.kayak_storage_number,
      boat_storage_number: data.boat_storage_number,
      updatedAt: today,
      unit_status_id: data.unit_status_id,
      is_high_security: data.is_high_security,
      high_security_note: data.high_security_note,
      votes_pci: data.votes_pci,
      maint_fee: data.maint_fee,
      reserve_fee: data.reserve_fee,
      rec_fee: data.rec_fee,
    }, {
      where: {
        id: data.paramsId
      }
    })
  }

  return result
}

exports.postUnitUser = async (data) => {
  const d = data.unit_ids.map(unit_id => ({
    unit_id: unit_id,
    user_id: data.user_id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))

  const result = await UnitUser.bulkCreate(d, { returning: true })

  return result
}

exports.deleteUnitById = async (id) => {
  await Unit.update({
    is_active: false,
  }, {
    where: {
      id
    }
  })

  return 'success'
}

exports.bulkCreateUnit = async(units) => {
  return await Unit.bulkCreate(units, { 
    ignoreDuplicates: true,
    returning: true,
  });
}