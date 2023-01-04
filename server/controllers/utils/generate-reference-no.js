const Bill = require('../../models/bill');
const MaintenanceOrder = require('../../models/maintenance_order');
const Property = require('../../models/property')
const PMC = require('../../models/pmc')

const getProperties = async ({ id }) => {
  const property = await Property.findOne({
    where: { id },
  });
  if (!property) throw new Error('Property not found.');

  const { pmc_id } = property.dataValues;
  const properties = await Property.findAll({
    where: { pmc_id },
    raw: true,
  });
  return properties.map(({ id }) => id);
};

exports.getNewInvoiceNo = async ({ nextTo, property_id } = {}) => {
  const type = 'INV';
  const year = new Date().getFullYear().toString().substr(-2);
  const initialInvoiceNo = `${type}${year}1000001`;
  let currentInvoiceNo;

  if (nextTo) {
    currentInvoiceNo = nextTo;
  } else {
    const properties = await getProperties({ id: property_id });
    const invoice = await Bill.findOne({
      where: { property_id: properties },
      order: [ [ 'createdAt', 'DESC' ]],
    });

    if (invoice) {
      const isNotCurrentYear = invoice.dataValues.invoice_no.substr(3,2) !== year;
      if (isNotCurrentYear) return initialInvoiceNo;
      currentInvoiceNo = invoice.dataValues.invoice_no;
    } else {
      return initialInvoiceNo;
    }
  }

  const identifier = currentInvoiceNo.substring(0, 3);
  const number = currentInvoiceNo.substring(5);
  console.log({identifier, number})
  const newInvoiceNo = identifier === 'INV'
      ? `${type}${year}${parseInt(number) +1}`
      : initialInvoiceNo;
  const isExist = await Bill.findOne({
    where: { invoice_no: newInvoiceNo }
  })

  return (isExist) 
    ? this.getNewInvoiceNo({ nextTo: newInvoiceNo })
    : newInvoiceNo;
};