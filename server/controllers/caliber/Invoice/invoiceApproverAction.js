import CaliberInvoice from '../../../models/caliber_invoice';
import CaliberUser from '../../../models/caliber_user';
import { getApprovalItemById } from '../../approval_item.controller';
import { getResponseByEndpoint } from '../utils';

// Payment's Payload
const payload = {
  "ClientID": 1,
  "ClientName": "FINITE HOA (TEST)",
  "PaymentGLAccountID": 1,
  "PaymentGLAccount": "1005 - Operating Bank Account",
  "PayeeName": "Christian Plumbing Service",
  "PayeeType": 14,
  "PayeeTypeString": "Vendor",
  "PayeeID": 3,
  "Amount": 300,
  "PaymentDate": "2021-09-01T00:00:00",
  "CheckNumberSeries": 1,
  "CheckNumber": 9,
  "Memo": "This is Rom v5",
  "PayerAddress": {
      "AddressID": 0,
      "RefID": null,
      "RefType": null,
      "IsDeleted": null,
      "Name": null,
      "InCareOf": null,
      "UnitNumber": null,
      "Address1": null,
      "Address2": null,
      "City": null,
      "State": null,
      "ZipCode": null,
      "Country": null,
      "OneLine": ""
  },
  "RemitAddress": {
      "AddressID": 0,
      "RefID": null,
      "RefType": null,
      "IsDeleted": null,
      "Name": null,
      "InCareOf": null,
      "UnitNumber": null,
      "Address1": null,
      "Address2": null,
      "City": null,
      "State": null,
      "ZipCode": null,
      "Country": null,
      "OneLine": ""
  },
  "MailingAddress": {
      "AddressID": 0,
      "RefID": null,
      "RefType": null,
      "IsDeleted": null,
      "Name": null,
      "InCareOf": null,
      "UnitNumber": null,
      "Address1": null,
      "Address2": null,
      "City": null,
      "State": null,
      "ZipCode": null,
      "Country": null,
      "OneLine": ""
  },
  "PayeeAddress": {
      "AddressID": 0,
      "RefID": null,
      "RefType": null,
      "IsDeleted": null,
      "Name": null,
      "InCareOf": null,
      "UnitNumber": null,
      "Address1": null,
      "Address2": null,
      "City": null,
      "State": null,
      "ZipCode": null,
      "Country": null,
      "OneLine": ""
  },
  "Printed": true,
  "GLTransactionID": 78611,
  "APBasis": 1,
  "CheckImage": "QEA=",
  "StubImage": "QEA=",
  "Voided": false,
  "VoidGLTransactionID": 0,
  "BatchID": 0,
  "PaymentCCID": 1,
  "PaymentCostCenter": "1 - Operating",
  "CentralDisbursmentApplied": true,
  "FromAPI": false,
  "PaymentType": 0,
  "AcceptedAPI": false,
  "ACHBatchID": 0,
  "ACHCommitted": false,
  "IsDeleted": false,
  // "Links": [
  //     {
  //         "rel": "Check Image",
  //         "href": "/payment/5119/checkimage"
  //     },
  //     {
  //         "rel": "Stub Image",
  //         "href": "/payment/5119/stubimage"
  //     }
  // ],
  // "Invoices": [
  //     {
  //         "InvoiceID": 14,
  //         "Amount": 2.25
  //     }
  // ],
  // "Invoices": [],
  "InvoiceIDs": "14",
  "AppliedPayments": [
      {
          "InvoiceID": 14,
          "LineItemID": 1,
          "PaymentGLAccountID": 1,
          "CostCenterID": 1,
          "Amount": 2.25,
          "GLTransactionID": 78611,
          "VendorCredit": false,
          "Desc": "sample string 12",
          "UserID": 13,
          "LineItemDescription": "sample string 14"
      }
  ],
  "PostedCheckNumber": "9",
  "PaymentInvoices": [
      {
          "InvoiceID": 14,
          "LineItems": [
              {
                  "LineItemID": 16,
                  "PaymentAmount": 3.25
              }
          ],
          "PaymentAmount": 3.25
      }
  ],
  "ManualPayment": true,
  "Reconciled": true,
  "PositivePay": true
}

const APPROVAL_ACTIONS = {
  Open: 0,
  Approved: 1,
  Denied: 2,
};

const postInvoiceAction = async({ 
  InvoiceID,
  ClientContactID,
  Action,
  RejectText,
}) => {
  const options = {
    method: 'POST',
    data: {
      InvoiceID,
      ClientContactID,
      Action,
      RejectText,
    }
  }
  const data = await getResponseByEndpoint(`api/v2/invoice/${InvoiceID}/action`, options);
  return data;
}

const submitApprovers = async(bill_id, approvers) => {
  for (const { user_id } of approvers) {
    const invoice = await CaliberInvoice.findOne({ where: { bill_id }});
    if (invoice) {
      const { caliber_user_id:ClientContactID } = await CaliberUser.findOne({where: { user_id }});
      const approver = {
        InvoiceID: invoice.caliber_invoice_id,
        ClientContactID,
        Action: 1,
        RejectText: '',
      }
      postInvoiceAction(approver);
    }
  }
  
}

const submitAction = async(approval_item_id, { user_id, comment, status }) => {
  const { approval } = await getApprovalItemById(approval_item_id);
  const invoice = await CaliberInvoice.findOne({ where: { bill_id: approval.reference_id }});
  if (invoice) {
    console.log(`[Caliber] Posting invoice approval with Caliber Invoice No. ${invoice.caliber_invoice_id}`);
    const { caliber_user_id:ClientContactID } = await CaliberUser.findOne({where: { user_id }});
    const approver = {
      InvoiceID: invoice.caliber_invoice_id,
      ClientContactID,
      Action: APPROVAL_ACTIONS[status],
      RejectText: comment,
    }
    return postInvoiceAction(approver);
  }
  return console.log('No corresponding caliber invoice');
}

export {
  submitApprovers,
  submitAction,
};