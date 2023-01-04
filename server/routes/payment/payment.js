import express from 'express';
import { logPayment } from '../../controllers/payment/flutterwave.controller';
import { getFirstPaymentProviderByPmcId, healthCheck } from '../../controllers/pmc_payment_provider.controller';
const jwt = require('jsonwebtoken');
const PaymentController = require('../../controllers/payment/payment.controller');

const router = express.Router();
const processPayment = async (req, res) => {
  try {
    const data = req.body;
    const { id:userId, current_env } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const { parent_org_id:pmc_id } = current_env;
    const { accountKeyObj:accountKey, code } = await getFirstPaymentProviderByPmcId({ pmc_id });
    const accountKeyObj = JSON.parse(accountKey);
    await healthCheck({ code, accountKeyObj });
    const response = await PaymentController.processPayment({ 
        ...data, 
        userId, 
        accountKeyObj,
      });
    res.send(response);
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
}

const useExistingPaymentMethod = async (req, res) => {
  try {
    const { id: userId, current_env } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const { parent_org_id:pmc_id } = current_env;
    const { accountKeyObj:accountKey, code } = await getFirstPaymentProviderByPmcId({ pmc_id });
    const accountKeyObj = JSON.parse(accountKey);
    await healthCheck({ code, accountKeyObj });
    const response = await PaymentController.processExistingPayment({ 
      ...req.body, 
      userId, 
      accountKeyObj,
    });
    res.send(response);
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
}

const flutterwavePaymentCallback = async(req, res) => {
  try {
    const { id: paid_by } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const { billId, paymentCallback } = req.body;
    const response = await logPayment({ billId, paid_by, paymentCallback });
    res.send(response);  
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  } 
}

router.post('/process-payment', processPayment);
router.post('/process-existing-payment', useExistingPaymentMethod);
router.post('/flutterwave-payment-callback', flutterwavePaymentCallback);
module.exports = router;