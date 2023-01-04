import { getResponseByEndpoint } from '../utils';
import Transaction from '../../../models/transaction_v2';
import { getUnitByCaliberUnitId } from '../Unit';
import createTransactionLine from './createTransactionLine';

const bulkCreate = async(transaction) => {
  return await Transaction.bulkCreate(transaction, { 
    ignoreDuplicates: true,
    returning: true,
  });
}

const caliberMapTransaction = (caliber) => ({ 
  description: caliber.TAcctName,
  balance: caliber.Balance,
  is_default: caliber.IsDefault,
  unit_id: caliber.unit_id,
  account_number: caliber.AccountNumber,
  trans_account_id: caliber.TAcctID,
  caliberObj: caliber.caliberObj,
});

const createLines = async(trans) => {
  for (const { id:transaction_id, caliber_unit_id:caliberUnitId, trans_account_id, unit_account_id } of trans) {
    createTransactionLine({caliberUnitId, transaction_id, trans_account_id, unit_account_id});
  }
}

const createTransactionHeader = async({unit_id, caliber_unit_id, transaction, unit_account_id}) => {
  try {
    console.log(`[Caliber] Uploading Transaction...`);
    const transactionMap = transaction.map(trans => caliberMapTransaction({ 
      ...trans,
      unit_id,
      caliberObj: JSON.stringify(trans),
    }));
    const createdTrans = await bulkCreate(transactionMap);
    createLines(createdTrans.map(({ dataValues }) => ({ 
      ...dataValues,
      caliber_unit_id,
      unit_account_id,
    })));
    
    console.log(`[Caliber] Transaction created`);
    return createdTrans;
  } catch (error) {
    console.log(`[Caliber] ${error}`);
  }
}

export default createTransactionHeader;