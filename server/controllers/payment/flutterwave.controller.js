import Bill from '../../models/bill';
import Gateway from '../../models/gateway_log';
import TransactionLog from '../../models/transaction_log';

const logPayment = async({ paid_by, billId, paymentCallback}) => {
  const { 
    amount, 
    currency, 
    customer, 
    flw_ref, 
    status, 
    transaction_id, 
    tx_ref,
  } = paymentCallback;
  const paymentStatus = status === 'successful' 
    ? 'success'
    : 'failed';

  if (paymentStatus === 'success') {
    await Bill.update({ paid: 1}, { where: { id: billId }});
  }

  const transaction = {
    billId,
    gateway: 'flutterwave',
    remoteStatus: paymentStatus,
    type: 'PAYMENT_CALLBACK',
    transRefId: transaction_id,
    amount: amount,
    paid_by,
    completed: 1,
    currencyId: 0,
    description: '',
    createdAt: new Date(),
  };
  const { id } = await TransactionLog.create(transaction);
  const gateway = {
    date: new Date(), 
    data: JSON.stringify(paymentCallback),
    gateway: 'flutterwave',
    transaction_log_id: id,
    result: paymentStatus,
    resultDetail: `flutterwave Payment processed (${status}).`,
    createdAt: new Date()
  }
  return await Gateway.create(gateway);
}

export {
  logPayment,
}