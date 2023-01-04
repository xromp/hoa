const Bill = require('../models/bill');
const BillLine = require('../models/bill_line');
const { sendEmail } = require('../controllers/mail');
const Unit = require('../models/unit');
const Property = require('../models/property')
const User = require('../models/user');
const { webMobileEmailNotification } = require('./notification.controller');
const { getNewInvoiceNo } = require('../controllers/utils/generate-reference-no');
const UnitUser = require('../models/unit_user');
const BillType = require('../models/bill_type');
const Approval = require('../models/approval');
const { saveApprovers } = require('./approval.controller');

Unit.hasMany(UnitUser, { foreignKey: 'unit_id' })

exports.generateNewInvoiceNo = async (option) => {
  let currentInvoiceNo;
  if (option) {
    currentInvoiceNo = option.nextTo;
  } else {
    const invoice = await Bill.findOne({
      order: [ [ 'createdAt', 'DESC' ]],
    });
    if (!invoice) return 'INV-1000001';
    currentInvoiceNo = invoice.dataValues.invoice_no;
  }

  const identifier = currentInvoiceNo.substring(0, 3),
    number = currentInvoiceNo.substring(4),
    newNumber = identifier === 'INV' 
      ? parseInt(number) +1
      : '1000001',
    newInvoiceNo = `INV-${newNumber}`;
  const isExist = await Bill.findOne({
    where: { invoice_no: newInvoiceNo }
  })

  return (isExist) 
    ? this.generateNewInvoiceNo({ nextTo: newInvoiceNo })
    : newInvoiceNo;
}

exports.sendInvoiceNotif = async({ unit_id, property_id, invoice_no, createdby_id }) => {
  const unit = await Unit.findOne({
    include: [{ 
      model: UnitUser, 
      include: [ { model: User } ],
      raw: true
    }],
    where: { id: unit_id }
  });
  const units = unit.dataValues.unit_users;
  const residents = units.map(({ user }) => {
    const { id:user_id, email } = user.dataValues;
    return { user_id, email };
  })
  const { name: propertyName } = await Property.findOne({ 
    where: { id: property_id}
  });

  for (const { user_id, email } of residents) {
    const notif = {
      title: `${propertyName} has been sent a new bill`,
      webBody: `New bill request ${invoice_no}. Please navigate Billing menu for more details.`,
      mobileBody: `New bill request ${invoice_no}. Please navigate Billing menu for more details.`,
      emailBody: `New bill request ${invoice_no}. Please login to view.`,
      propertyId: property_id,
      propertyResId: property_id,
      decodedId: user_id,
      send_by: createdby_id,
      user_id,
      email,
      updatedAt: new Date(),
      createdAt: new Date()
    }
    await webMobileEmailNotification(notif); 
  }
};

exports.addBillApproval = async(bill) => {
  if (!bill.approval.length) return;
  const data = { 
    reference_id: bill.id,
    reference_no: bill.invoice_no,
    type: 'bill',
    property_id: bill.property_id,
    createdby_id: bill.createdby_id,
    other_data_obj: JSON.stringify({}),
    approval_item: bill.approval, 
  }
  return await saveApprovers(data);
}

exports.createInvoice = async (billing) => {
  const invoice_no = await getNewInvoiceNo({ property_id: billing.property_id });
  const data = {
    ...billing,
    bill_from: billing.createdby_id,
    invoice_no,
    total_amount: 0,
    generated_date: new Date(),
    bill_config_id: 0,
    paid: 0,
    status: billing.autoApproved ? 'APPROVED' : 'FOR_APPROVAL',
    from_date: new Date(),
    to_date: new Date(),
    updatedAt: new Date(),
    createdAt: new Date(),
  };
  
  if (billing.sendNotif) this.sendInvoiceNotif(data);

  const bill = await Bill.create(data);
  const billValues = bill.dataValues;
  const line = data.bill_lines.map(e => ({ 
    ...e, 
    fee_type_id: data.fee_type_id, 
    bill_id: billValues.id,
  }))
  await BillLine.bulkCreate(line);
  await this.syncTotalAmountById({ id: billValues.id});
  // Adds approval if any
  if (!billing.autoApproved) this.addBillApproval({ ...billing, ...billValues});

  return { ...billValues };
}

exports.updateInvoice = async ({ id, data }) => {
  const isExist = await Bill.findOne({ where: { id }});
  if (!isExist) throw new Error(`Billing reference is invalid.`);
  
  const billing = {
    ...data,
    generated_date: new Date(),
    unit_resident_id: 0,
    bill_config_id: 0,
    updatedAt: new Date(),
  };
  delete billing.id;
  await BillLine.destroy({ where: { bill_id: id }});
  const lines = data.bill_lines.map(e => ({
    bill_id: id,
    fee_type_id: data.fee_type_id,
    description: e.description,
    amount: e.amount,
    updatedAt: new Date(),
  }));

  await BillLine.bulkCreate(lines);
  await Bill.update(
    { ...billing },
    { where: { id } });
  await this.syncTotalAmountById({ id });
  return true;
}

exports.findAndCheckBillingById = async ({ id }) => {
  const bill = await Bill.findOne({ where: { id }});
  if (!bill) throw new Error(`Billing reference is invalid.`);
  return bill.dataValues;
}

exports.syncTotalAmountById = async ({ id }) => {
  const bill = await BillLine.findAll({ where: { bill_id: id }, raw: true });
  const total_amount = bill.reduce((acc, obj) => { return parseFloat(acc) + parseFloat(obj.amount) }, 0);
  await Bill.update({ total_amount }, { where: { id }});
  return total_amount;
}

exports.calcTransFee = ({ amount, rate, axpFee }) => {
  return (parseFloat(amount) * rate) + axpFee;
};

exports.upsertTransactionFeeByBillId = async ({ billId, transFeeOption }) => {
  const transtionFee = await BillType.findOne({ where: { code: 'TRANSACTION_FEE' }});
  if (!transtionFee) throw new Error(`No TRANSACTION_FEE in the billing type. Please add it.`); 
  
  const { id: fee_type_id } = transtionFee;
  const transFeeType = await BillLine.findOne({ where: { bill_id:billId, fee_type_id }});
  const { total_amount: amount } = await Bill.findOne({ where: { id:billId  }});
  const transFee = this.calcTransFee({ amount, ...transFeeOption });

  if (transFeeType) {
    await BillLine.update(
      { description: transFeeOption.description , amount: parseFloat(transFee) },
      { where: { bill_id:billId, fee_type_id:transFeeType.fee_type_id } });
  } else {
    const data = {
      bill_id: billId,
      fee_type_id, 
      description: transFeeOption.description,
      amount: parseFloat(transFee),
      createdAt: new Date(),
    }
    await BillLine.create(data);
  }
  await this.syncTotalAmountById({ id: billId });
  return await Bill.findOne({ where: { id:billId }});
}

exports.checkInvoiceApprovalAndSendNotifById = async({ approval_id }) => {
  const approval = await Approval.findOne({ where: {
    type: 'bill',
    status: 'Approved',
    id: approval_id,
  }})
  if (!approval) return;
  
  const data = await Bill.findOne({ where: { id: approval.reference_id }});
  await  this.sendInvoiceNotif(data);
  await Bill.update(
    { status: 'APPROVED' },
    { where: { id: approval.reference_id } });
}


export const bulkCreate = async (bills) => {
  return await Bill.bulkCreate(bills, { 
    ignoreDuplicates: true,
    returning: true,
  });
}

export const create = async (bill) => {
  return await Bill.create(bill, { returning: true });
};

export const createLines = async (lines) => {
  return await BillLine.bulkCreate(lines, { 
    ignoreDuplicates: true,
    returning: true,
  });
};

export const deleteBill = async (id) => {
  const bill = await Bill.findOne({ where: { id }});
  if (!bill) throw new Error(`Billing ID is invalid.`);
  return await Bill.update(
    { is_deleted: true },
    { where: { id }});
};