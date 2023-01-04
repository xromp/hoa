const { Op } = require('sequelize')
const Approval = require('../models/approval');
const ApprovalItem = require('../models/approval_item');
const User = require('../models/user');
const UserRole = require('../models/user_role')
const approvalController = require('./approval.controller');
const BillingController = require('./billing.controller');
const { submitAction } = require('./caliber/Invoice/invoiceApproverAction');
const { webMobileEmailNotification } = require('./notification.controller');

const ApprovalStatus = ['Open', 'Approved', 'Denied'];
Approval.hasMany(ApprovalItem, { foreignKey: 'approval_id' })
ApprovalItem.belongsTo(Approval, { foreignKey: 'approval_id' })
User.belongsTo(UserRole, {targetKey:'id',foreignKey: 'user_role_id'})

exports.findApprovalsById = async({ approval_id }) => {
 return await ApprovalItem.findAll({ where: { approval_id }, raw: true});
}

exports.upsertByApprovalId = async({ approval_id, data }) => {
  const approvalItems = await ApprovalItem.findAll({ where: { approval_id }, raw: true });
  if (!!approvalItems.length) {
    // const existingApprovers = approvalItems
    //   .filter(({ user_id }) => data.map());
    // for (const { id } of existingApprovers) {
    //   const item = {
    //     level: data.level,
    //     updatedAt: new Date(),
    //   };
    //   await ApprovalItem.update(item, { where: { id }});
    // }
    // TODO: Should consider not overriding current comment/status for a user
    await ApprovalItem.destroy({ where: { approval_id }})
    const items = data.map(i => {
      delete i.id;
      return {...i, approval_id};
    })
    await ApprovalItem.bulkCreate(items)
  } else {
    const items = data.map(i => {
      delete i.id;
      return {...i, approval_id};
    })
    await ApprovalItem.bulkCreate(items)
  }
}

exports.submitApproverAction = async({ user_id, approval_items_id: id, comment, action: status }) => {
  // TODO: Check if the user_id is tagged/included as Approver (Approval permission)
  try {
    const hasPermission = await approvalController.isApprover({ user_id });
    const approvalItem = await ApprovalItem.findOne({ where: { id, user_id }});

    if (!ApprovalStatus.includes(status)) throw new Error('Approval Status is invalid');
    if (!approvalItem) throw new Error('Approval request is invalid');
    if (!hasPermission) throw new Error(`Don't have enough access to approve/deny`);

    await ApprovalItem.update(
      { 
        comment, 
        status, 
        completed_at: new Date(),
        updatedAt: new Date(),
      },
      { where: { id, user_id }} );
    await this.checkAndUpdateApprovalToComplete({ approval_id: approvalItem.approval_id });
    // Sync Caliber Invoice Approvals
    submitAction(id, { user_id, comment, status });
    return true;
  } catch (error) {
   throw new Error(error);
  }
}

exports.checkAndUpdateApprovalToComplete = async ({ approval_id }) => {
  const hasPending = await ApprovalItem.findOne({ 
    where: { approval_id, status: 'Open' }
  });

  if (hasPending) {
    await Approval.update(
      { completed_at: null, status: 'Open' },
      { where: { id: approval_id }}
      );
  } else {
    const hasDenied = await ApprovalItem.findOne({ 
      where: { approval_id, status: 'Denied' }
    });
    await Approval.update(
      { completed_at: new Date(), status: hasDenied ? 'Denied': 'Approved' },
      { where: { id: approval_id }}
      );
    
    await BillingController.checkInvoiceApprovalAndSendNotifById({ approval_id });
  }
  return true;
}


exports.saveApprovers = async({ user_id, approval_items_id: id, comment, action: status }) => {
  // TODO: Check if the user_id is tagged/included as Approver (Approval permission)
  const isRequestExist = await ApprovalItem.findOne({ where: { id, user_id }});
  if (!ApprovalStatus.includes(status)) throw new Error('Approval Status is invalid');
  if (!isRequestExist) throw new Error('Approval request is invalid');

  return await ApprovalItem.update(
    { 
      comment, 
      status, 
      completed_at: new Date(),
      updatedAt: new Date(),
    },
    { where: { id, user_id }} );
}

exports.sendApproverNotif = async({ id, user_id, origin_url, reference_no, sender_id }) => {
  const user = await User.findOne({ where: { id: user_id }});
  const sender = await User.findOne({ where: { id: sender_id }});
  if (!user || !sender) throw new Error(`User doesn't exist.`);

  const approvalItem = await ApprovalItem.findOne({ 
    include: [ User, Approval ],
    where: { id }, 
    raw: true,
  });
  const type = {
    mo: 'Maintenance Order',
    wo: 'Work Order',
    bill: 'Bill',
    invoice: 'Invoice',
    rfp: 'RFP',
  };
  const { full_name: senderName } = sender;
  const notif = {
    title: `[Follow up] Your Approval is Required for a Request ${reference_no}`,
    webBody: `${senderName} is requesting follow-up regarding to your pending approval ${reference_no} request. Please check your approval list.`,
    mobileBody: `${senderName} is requesting follow-up regarding to your pending approval ${reference_no} request. Please check your approval list.`,
    emailBody: `${senderName} is requesting follow-up regarding to your pending approval ${reference_no} request. Please click here to check your approval list.`,
    propertyId: approvalItem['approval.property_id'],
    propertyResId: approvalItem['approval.property_id'],
    decodedId: approvalItem['user.id'],
    send_by: sender_id,
    user_id: approvalItem['user.id'],
    email: approvalItem['user.email'],
    updatedAt: new Date(),
    createdAt: new Date()
  }
  await ApprovalItem.update(
    { latest_followup_sent: new Date() },
    { where: { id }}
    );
  return await webMobileEmailNotification(notif);
}

exports.deleteById = async({ id }) => {
  await ApprovalItem.destroy({ where: { id } });
  return true;
 }

exports.getApprovalItemById = async (id) => {
  return await ApprovalItem.findOne({
    include: [Approval],
    where: { id },
  })
}