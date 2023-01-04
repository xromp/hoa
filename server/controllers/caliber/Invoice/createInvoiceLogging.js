import CaliberInvoice from '../../../models/caliber_invoice';

const createInvoiceLogging = async(data) => {
  return await CaliberInvoice.create(data);
}

export default createInvoiceLogging;