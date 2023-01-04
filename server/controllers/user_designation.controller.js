const UserDesignation = require('../models/user_designation')
const Property = require('../models/property')
const User = require('../models/user')
const today = new Date()

UserDesignation.belongsTo(Property, {targetKey:'id',foreignKey: 'property_id'})
UserDesignation.belongsTo(User, {targetKey:'id',foreignKey: 'user_id'})

exports.getUserDesignationByPPO = async (data) => {
  let params = {
    property_id: data.propertyId,
    pmc_id: data.parentOrgId,
    d_maintenance: data.designation_type === 'maintenance',
    d_reservation: data.designation_type === 'reservation'
  }

  data.designation_type === 'maintenance' ? delete params.d_reservation : delete params.d_maintenance

  const result = await UserDesignation.findAll({
    include: [
      { model: Property },
      { model: User }
    ],
    where: { ...params },
    order: [
      ['id', 'DESC']
    ],
  })

  return result.map(({user}) => user)
}

exports.getUserDesignationByUserParentId = async (data) => {
  const result = await UserDesignation.findAll({
    include: [
      { model: Property }
    ],
    where: {
      user_id: data.paramsId,
      pmc_id: data.parentOrgId
    },
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.getUserDesignationByUserPropertyId = async (data) => {
  const result = await UserDesignation.findAll({
    include: [
      { model: Property }
    ],
    where: {
      user_id: data.user_id,
      property_id: data.property_id
    },
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.postUserDesignation = async (data) => {
  if(data.paramsId == -1) {
    const is_exist = await this.getUserDesignationByUserPropertyId(data)

    if (is_exist.length !== 0) return
    await this.createUserDesignation(data)
  } else {
    await this.updateUserDesignation(data)
  }

  return {message:'success', data}
}

exports.createUserDesignation = async (data) => {
	const result = await UserDesignation.create({
    pmc_id: data.parent_id,
    property_id: data.property_id,
    user_id: data.user_id,
    d_maintenance: data.d_maintenance,
    d_reservation: data.d_reservation,
    d_bulletin: data.d_bulletin,
    updatedAt: today,
    createdAt: today,
  })

  return result
}

exports.updateUserDesignation = async (data) => {
  const result = await UserDesignation.update({
    d_maintenance: data.d_maintenance,
    d_reservation: data.d_reservation,
    d_bulletin: data.d_bulletin,
    updatedAt: today,
  }, {
    where: { id: data.paramsId }
  })

  return result
}

