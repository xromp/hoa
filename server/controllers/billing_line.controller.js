const BillLine = require('../models/bill_line');
const { findAndCheckBillingById, syncTotalAmountById } = require('./billing.controller');

exports.createLine = async (data) => {
  await findAndCheckBillingById({ id: data.bill_id });
  const line = {
    ...data,
    updatedAt: new Date(),
    createdAt: new Date(),
  };
  await BillLine.create(line);
  await syncTotalAmountById({ id: data.bill_id });
  return true;
}

exports.updateLine = async (id, data) => {
  await this.findAndCheckBillingLineById({ id });
  await BillLine.update({ ...data }, 
    { where: { id } });
  await syncTotalAmountById({ id: data.bill_id });
  return true;
}

exports.deleteLine = async (id, data) => {
  await this.findAndCheckBillingLineById({ id });
  await BillLine.destroy({ where: { id } });
  await syncTotalAmountById({ id: data.bill_id });
  return true;
}

exports.findAndCheckBillingLineById = async ({ id }) => {
  const line = await BillLine.findOne({ where: { id }});
  if (!line) throw new Error(`Billing line reference is invalid.`);
  return line.dataValues;
}