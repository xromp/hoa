import { getResponseByEndpoint } from '../utils';
import TransactionLine from '../../../models/transaction_line_v2';
import { getUnitByCaliberUnitId } from '../Unit';

const bulkCreate = async(transaction) => {
  return await TransactionLine.bulkCreate(transaction, { 
    ignoreDuplicates: true,
    returning: true,
  });
}

const caliberMapTransaction = (client) => {
  return {
    transaction_id: client.transaction_id,
    posting_date: client.PostingDate,
    description: client.Description,
    amount: client.Amount,
    balance: client.Balance,
    ref: client.RefNumber,
    caliberObj: client.caliberObj,
    unit_id: client.unit_id,
    account_number: client.AccountNumber,
    trans_account_id: client.TAcctID,
    createdAt: new Date(),
  };
};

const createTransactionLine = async({ caliberUnitId, transaction_id, trans_account_id, unit_account_id }) => {
  try {
    console.log(`[Caliber] Uploading TransactionLine ${unit_account_id}...`);
    const caliberTransactions = await getResponseByEndpoint(`api/v2/unitaccount/${unit_account_id}/transactions/${trans_account_id}`);
    if (!caliberTransactions) throw new Error ('Invalid Unit Id');
    const { unit_id } = await getUnitByCaliberUnitId(caliberUnitId);
    const transaction = caliberTransactions.map(trans => caliberMapTransaction({ 
      ...trans,
      unit_id,
      transaction_id,
      caliberObj: JSON.stringify(trans),
    }));
    const createdTrans = await bulkCreate(transaction);
    console.log(`[Caliber] TransactionLine created (${createdTrans.length})`);
    return createdTrans;
  } catch (error) {
    console.log(`[Caliber] ${error}`);
    // throw new Error (error);
  }
}

export default createTransactionLine;