const sequelize = require('sequelize')
const ApprovalPermission = require('../models/approver')
const Approval = require('../models/approval')
const Approvers = require('../models/approver')
const ApprovalItem = require('../models/approval_item')
const User = require('../models/user')
const Property = require('../models/property')
const UserOrgRole = require('../models/user_org_role')
const UserRole = require('../models/user_role')

Approvers.belongsTo(User, { foreignKey: 'user_id' });
Approvers.belongsTo(Property, { foreignKey: 'property_id' });

exports.createApprover = async({ user_id, property_id, is_creator }) => {
  const isApproverExist = await Approvers.findOne({ 
    where: { 
      user_id, 
      property_id,
      is_deleted: false,
    }
  });
  if (isApproverExist) throw new Error('User already tagged as approver');

  return await Approvers.create({
    user_id,
    property_id,
    is_creator,
  })
}

exports.createApproverByProperties = async({ user_id, property_id, is_creator }) => {
  const isArray = Array.isArray(property_id);
  if (isArray) {
    for (const id of property_id) {
      await this.createApprover({ user_id, property_id: id, is_creator})
    }
  } else {
    await this.createApprover({ user_id, property_id, is_creator})
  }
}

exports.updateRoleByUserId = async({ user_id, property_id, is_creator }) => {
  const isApproverExist = await Approvers.findOne({ 
    where: { 
      user_id, 
      property_id,
      is_deleted: false,
    }
  });
  if (!isApproverExist) throw new Error('User already tagged as approver');

  return await Approvers.update(
    { is_creator }, 
    { where: { property_id, user_id} });
}

exports.getApproversByProperty = async({ property_id }) => {
  return await Approvers.findAll({ 
    include: [ User, Property ],
    where: { property_id, is_deleted: false },
  });
}

exports.getApprovers = async(optionalFilters) => {
  const approver = await Approvers.findAll({
    include: [ 
      { model: User, include: [ { 
          model: UserOrgRole,
          include: [ UserRole ],
          where: { property_id: optionalFilters.property_id }}, 
          UserRole 
        ]}, 
      Property 
    ],
    where: { is_deleted: false, ...optionalFilters },
  });
  return approver.filter((item, pos, self) => self.findIndex(v => v.user_id === item.user_id) === pos);
}

exports.getCurrentUser = async(optionalFilters) => {
  return await Approvers.findOne({
    where: { is_deleted: false, ...optionalFilters },
  });
}

exports.deleteApprover = async({ id }) => {
  const isApproverExist = await Approvers.findOne({ 
    where: { 
      id,
      is_deleted: false,
    }
  });
  if (!isApproverExist) throw new Error('Invalid Approver ID.');
  return await Approvers.update(
    { is_deleted: true },
    { where: { id } }
    );
}
