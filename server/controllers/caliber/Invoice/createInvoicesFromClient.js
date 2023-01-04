import { getResponseByEndpoint } from '../utils';
import createInvoiceLogging from './createInvoiceLogging';
import { create, createLines } from '../../billing.controller';
import { saveApprovers } from '../../approval.controller';
import { getVendorByCaliberVendorId } from '../Vendor';

const mapBill = (invoice) => {
  return {
    ledger_type: 'AP',
    paid: false,
    status: "FOR_APPROVAL",
    total_amount: invoice.Amount,
    due_date: invoice.DueDate,
    generated_date: invoice.DateCreated,
    from_date: invoice.SchStartDate,
    to_date: invoice.SchEndDate,
    payer_name: invoice.PayeeName,
    payer_email: '',
    payer_address: '',
    payer_phone: '',
    payee_name: '',
    payee_email: '',
    payee_phone: '',
    payee_address: '',
    bill_config_id: 0,
    unit_id: 1414,
    unit_resident_id: 1414,
    property_id: invoice.property_id,
    vendor_id: invoice.vendor_id,
    invoice_no: invoice.InvoiceNumber,
    createdby_id: invoice.createdby_id,
    createdAt: invoice.InvoiceDate,
    updatedAt: new Date(),
  };
};

const mapLine = (invoice) => {
 return {
  bill_id: invoice.bill_id,
  fee_type_id: 1,
  description: invoice.Description,
  amount: invoice.Amount,
  createdAt: new Date()
 }
}

const getInvoiceLines = async({ InvoiceID }) => {
  const lines = await getResponseByEndpoint(`api/v2/invoice/${InvoiceID}/lineitems`);
  if (!lines) throw new Error ('Invalid Client ID');
  return lines;

}

const attachApprovers = ({ id: bill_id, invoice_no, property_id, createdby_id, approvers }) => {
  const approval_item = approvers.map(({ id:user_id }, i) => ({ level: i+1, user_id, enable: true }));
  const approval = {
    reference_id: bill_id,
    reference_no: invoice_no || bill_id,
    type: "bill",
    hideSubmit: false, 
    property_id,
    createdby_id, 
    approval_item,
    forceInsert: true,
  };
  saveApprovers(approval);
};

const submit = async(invoices, { property_id, decodedId:createdby_id }, approvers) => {
  const result = [];
  for (const invoice of invoices) {
    const vendor = await getVendorByCaliberVendorId({ caliber_vendor_id: invoice.PayeeID})
    const bill = mapBill({ 
      ...invoice, 
      vendor_id: vendor && vendor.vendor_id ? vendor.vendor_id : 0, 
      property_id, 
      createdby_id,
    });
    const createdBill = await create(bill);
    const lines = await getInvoiceLines(invoice);
    const mapLines = lines.map(line => mapLine({ ...line, bill_id: createdBill.id }));
    attachApprovers({ ...createdBill.dataValues, createdby_id, approvers });
    createLines(mapLines);
    createInvoiceLogging({
      caliber_invoice_id: invoice.InvoiceID,
      bill_id: createdBill.id,
      last_modified_by: 'caliber',
    })
    result.push(createdBill);
  }
  return result;
}


const createInvoicesFromClient = async({ client_id, property_id, parent_org_id:pmc_id, }, approvers, { decodedId }) => {
  try {
    console.log(`[Caliber] Uploading Invoices...`);
    const caliberInvoices = await getResponseByEndpoint(`api/v2/client/${client_id}/invoices/6`);
    if (!caliberInvoices) throw new Error ('Invalid Client ID');
    const result = await submit(caliberInvoices, { property_id, decodedId }, approvers);
    console.log(`[Caliber] Invoices created (${result.length})`);
    return result;
/*     const user_role_id = await getOwnerPayerRoleId({ property_id });
    
    const users = caliberOwners
      .map(owner => ownerMapUser({ ...owner, user_role_id}))
      .filter(isValidUser)
      .splice(0, 1);
    const { name: propertyName } = await findPropertyById({ id: property_id });
    const createdUsers = [];
    for (const user of users) {
      const data = await createUser(user);
      createdUsers.push(data);
      sendNotif(data, { propertyName, property_id, decodedId });
    }
    console.log(`[Caliber] Processing ${users.length}/${caliberOwners.length} Owners...`); */
    // const createdUsers = await bulkCreate(users);

    // Notifies Created Users
    // sendNotifs(createdUsers, { property_id, decodedId });

    /*
    //TODO: Disable for now to smoothen the process
    const newUser = caliberUserMapping({ 
      caliber: caliberOwners, 
      axp: createdUsers.map(({ dataValues }) => dataValues)}
    );
    await createUserLogging(newUser);
    */
    console.log(`[Caliber] Invoices created (${createdUsers.length})`);
    return createdUsers;
  } catch (error) {
    console.log(`[Caliber] ${error}`);
    throw new Error (error);
  }
}

export default createInvoicesFromClient;