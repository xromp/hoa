const paymentMethodController = require("./payment_method.controller")
const PaymentMethod = require("../../models/payment/payment_method");
const fuseController = require("./fuze.controller")
const Bill = require("../../models/bill")
const BillLine = require("../../models/bill_line");
const BillType = require("../../models/bill_type");
const GatewayLog = require("../../models/gateway_log")
const TransactionLog = require("../../models/transaction_log");
const { upsertTransactionFeeByBillId, calcTransFee } = require('../billing.controller');
const { optionalChaning } = require('../caliber/utils');
Bill.hasMany(BillLine, { targetKey:'id',foreignKey: 'bill_id'})
BillLine.belongsTo(BillType, { targetKey:'id',foreignKey: 'fee_type_id'})

exports.TRANSACTION_FEE = {
  cc: { rate: 0.0295, axpFee: 2.00, description: 'Transaction Fee (2.95% + 2.00 USD)' },
  ach: { rate: 0.015, axpFee: 2.00, description: 'Transaction Fee (1.15% + 2.00 USD)' }
};

const getInsightTagByBill = (bill) => {
  return optionalChaning(() => bill.bill_lines[0].bill_type.insight_tag) || 'T0250702-0010000-00000000'; //HOA Fee
}

exports.processExistingPayment = async ({ userId, billId, paymentMethodId, accountKeyObj }) => {
  try {
    const bill = await Bill.findOne({
      where: { id: billId, paid: false },
      include: [{ 
        model: BillLine,
        include: [BillType],
      }]
    });
    if (!bill) throw new Error('The billing is invalid');

    accountKeyObj.InsightTag = getInsightTagByBill(bill);
    const payment = await PaymentMethod.findOne({
      where: { id: paymentMethodId, user_id: userId }
    });
    if (!payment) throw new Error('The payment method is invalid.');

    const { method, paymentObj } = payment.dataValues;
    const { Token, Token_SF } = JSON.parse(paymentObj)
    // Calculate Transaction Fee & upsert billing line
    const ServiceFeeAdditionalAmount = calcTransFee({ amount: bill.total_amount, ...this.TRANSACTION_FEE[method] })
    if (method === 'cc') {
      return await this.processCCPayment(userId, { ...bill.dataValues, ServiceFeeAdditionalAmount }, Token, Token_SF, accountKeyObj);
    } else if (method === 'ach') {
      return await this.processACHPayment(userId, { ...bill.dataValues, ServiceFeeAdditionalAmount }, Token, Token_SF, accountKeyObj);
    }
  } catch ({ message }) {
    throw new Error(message);
  }
}

exports.processPayment = async ({ userId, billId, objPayment, accountKeyObj }) => {
    //TODO: look up PMC to see what payment processor is set for their company
    //TODO: add more error handling
    //TODO: add ip address 
    //for now everyone is defaulted to fuse
    try {
      const bill = await Bill.findOne({
        where: { id: billId, paid: false },
        include: [{ 
          model: BillLine,
          include: [BillType],
        }]
      });

      if (!bill) return { status: 'failed', message: 'The billing is invalid.'};
      // Calculate Transaction Fee & upsert billing line
      accountKeyObj.InsightTag = getInsightTagByBill(bill);
      
      const ServiceFeeAdditionalAmount = calcTransFee({ amount: bill.total_amount, ...this.TRANSACTION_FEE[objPayment.method] });
      if(objPayment.method == "cc") {
        const { 
          hasError: hasTokenError, 
          message: tokenError, 
          Token,
          Token_SF,
        } = await module.exports.createCCTokenForPayment(userId, objPayment, accountKeyObj)
        if(hasTokenError) return { status: 'failed', message: tokenError};
        
        const { 
          hasError: hasProcessError, 
          message: proccesError, 
          data,
        } = await module.exports.processCCPayment(
          userId, 
          { ...bill.dataValues, ServiceFeeAdditionalAmount }, 
          Token, 
          Token_SF, 
          accountKeyObj)
        return hasProcessError 
          ? { status: 'failed', message: proccesError}
          : { status: 'success', data };
      } else if(objPayment.method == "ach") {
        const { 
          hasError: hasTokenError, 
          message: tokenError, 
          Token,
          Token_SF,
        } = await module.exports.createACHTokenForPayment(userId, objPayment, accountKeyObj);
        if(hasTokenError) return { status: 'failed', message: tokenError};

        const { 
          hasError: hasProcessError, 
          message: proccesError, 
          data,
        } = await module.exports.processACHPayment(
          userId, 
          { ...bill.dataValues, ServiceFeeAdditionalAmount }, 
          Token, 
          Token_SF, 
          accountKeyObj)
        return hasProcessError 
          ? { status: 'failed', message: proccesError}
          : { status: 'success', data };
      }
    } catch ({ message }) {
      throw new Error(message);
    }
}
exports.createCCTokenForPayment = async (userId, objPayment, accountKeyObj) => {
    const ccDataObj = fuseController.mapCCObject(objPayment);
    const tokenResponse = await fuseController.createCCToken({ ...ccDataObj, ...accountKeyObj});
    const { data, status, config, hasError } = tokenResponse;
    const dataLog = {
      data,
      status,
      url: config ? config.url : '',
      method: config ? config.method : '',
      payload: config ? config.data: '',
    };

    if(data.ResultCode === 0 && !hasError) {
      await GatewayLog.create({
        date: new Date(),
        user_id: userId,
        data: JSON.stringify(dataLog),
        gateway: 'pace',
        result: 'success',
        resultDetail: 'CC Token created',
      })
    } else {
      await GatewayLog.create({
        date: new Date(),
        user_id: userId,
        data: JSON.stringify(dataLog),
        gateway: 'pace',
        result: 'failed',
        resultDetail: data.ResultDetail,
      });

      return { 
        hasError: true, 
        message: data.ResultDetail, 
      };
    }
    //save the payment method if requested or first one
    const isPaymentMethodExist = await paymentMethodController.isPaymentByReferenceExist({ paymentReference: objPayment.CardNumber, userId });
    if(objPayment.savePaymentMethod && !isPaymentMethodExist) {

      const obj = {
        user_id: userId,
        method: 'cc',
        gateway: 'pace',
        paymentObj: JSON.stringify(data),
        Token: data.Token,
        Token_SF: data.Token_SF,
        paymentReference: objPayment.CardNumber,
        order: 1,
        isDefault: objPayment.isDefault,
        isActive: 1,
        isDeleted: 0,
      }
      await paymentMethodController.add(obj)
    }
    return data;
}

exports.processCCPayment = async (userId, { total_amount, invoice_no, id: billId, ServiceFeeAdditionalAmount }, Token, Token_SF, accountKeyObj) => {
  const tokenData = {
    ServiceFeeAdditionalAmount,
    Token, 
    Token_SF,
    Amount: total_amount,
    Custom1: invoice_no,
    ...accountKeyObj,
  };
  const processPaymentResponse = await fuseController.ProcessCCToken(tokenData);
  return await module.exports.createPaymentLogs({
    processPaymentResponse,
    billId,
    total_amount,
    userId,
    modeOfPayment: 'CC',
  })
}

exports.createACHTokenForPayment = async (userId, objPayment, accountKeyObj) => {
    const achDataObj = fuseController.mapACHObject(objPayment);
    const tokenResponse = await fuseController.createACHToken({...achDataObj, ...accountKeyObj});
    const { data, status, config, hasError } = tokenResponse;
    const dataLog = {
      data, 
      status,
      url: config ? config.url : '',
      method: config ? config.method : '',
      payload: config ? config.data: '',
    };

    if(data.ResultCode === 0 && !hasError) {
      await GatewayLog.create({
        date: new Date(),
        user_id: userId,
        data: JSON.stringify(dataLog),
        gateway: 'pace',
        result: 'success',
        resultDetail: 'ACH Token created',
      });
    } else {
      await GatewayLog.create({
        date: new Date(),
        user_id: userId,
        data: JSON.stringify(dataLog),
        gateway: 'pace',
        result: 'failed',
        resultDetail: data.ResultDetail,
      })
      return { 
        hasError: true, 
        message: data.ResultDetail, 
      };
    }
    
    //save the payment method if requested or first one
    const isPaymentMethodExist = await paymentMethodController.isPaymentByReferenceExist({ paymentReference: objPayment.ACHAccount, userId });
    if(objPayment.savePaymentMethod && !isPaymentMethodExist) {
      const obj = {
        user_id: userId,
        method: "ach",
        gateway: "pace",
        paymentObj: JSON.stringify(data),
        Token: data.Token,
        Token_SF: data.Token_SF,
        paymentReference: objPayment.ACHAccount,
        order: 1,
        isDefault: objPayment.isDefault,
        isActive: 1,
        isDeleted: 0,
      }
      await paymentMethodController.add(obj);
    }
    return data;
}

exports.processACHPayment = async (userId, { total_amount, invoice_no, id: billId, ServiceFeeAdditionalAmount }, Token, Token_SF, accountKeyObj) => {
  const tokenData = {
    ServiceFeeAdditionalAmount,
    Token,
    Token_SF,
    Amount: total_amount,
    Custom1: invoice_no,
    ...accountKeyObj
  };
  const processPaymentResponse = await fuseController.ProcessACHToken(tokenData);
  return await module.exports.createPaymentLogs({
    processPaymentResponse,
    billId,
    total_amount,
    userId,
    modeOfPayment: 'ACH',
  })
}

exports.createPaymentLogs = async ({ processPaymentResponse, billId, total_amount, userId, modeOfPayment }) => {
  const { data, status, config, hasError } = processPaymentResponse;
  const { id: transaction_log_id } = await TransactionLog.create({
    billId,
    paid_by: userId,
    type: 'PAYMENT_PROCESSING',
  });
    
  const dataLog = {
    data, 
    status,
    url: config ? config.url : '',
    method: config ? config.method : '',
    payload: config ? config.data: '',
  };
  const isPaymentSucess = data.ResultCode === 0 && !hasError;

  if(isPaymentSucess) {
    await TransactionLog.update({
      amount: total_amount,
      transRefId: data.TransRefID,
      gateway:'pace',
      completed: 1,
      currencyId: 0,
      remoteStatus: "success",
      updatedAt: new Date(),
    }, { where: { id: transaction_log_id } });

    await GatewayLog.create({
      date: new Date(),
      user_id: userId,
      data: JSON.stringify(dataLog),
      transaction_log_id,
      gateway: 'pace',
      result: "success",
      resultDetail: `${modeOfPayment} Payment processed.`
    });
    await upsertTransactionFeeByBillId({ billId, transFeeOption: this.TRANSACTION_FEE[modeOfPayment.toLowerCase()] });
    await Bill.update(
      { paid: 1 },
      { where: { id: billId }}
    );

    return { data };
  } else {
    await TransactionLog.update({
      gateway:'pace',
      completed: 1,
      remoteStatus: "failed",
      updatedAt: new Date(),
    }, { where: { id: transaction_log_id } });

    await GatewayLog.create({
      date: new Date(),
      user_id:userId,
      data: JSON.stringify(dataLog),
      transaction_log_id,
      gateway:'pace',
      result:"failed",
      updatedAt: new Date(),
      resultDetail: data.ResultDetail,
    });
    return processPaymentResponse;
  }
}