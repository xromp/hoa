import PmcPaymentProvider from '../models/pmc_payment_provider';
import { isFuzeUp } from './payment/fuze.controller';

const getAccountKeyObjByPmcId = async({ pmc_id, code }) =>{
  const provider = await PmcPaymentProvider.findOne({ 
    where: { 
      pmc_id,
      code,
      is_active: true,
      is_deleted: false,
    }
  });
  if (!provider) throw new Error(`No payment provide for this PMC ${pmc_id}`);
  const { accountKeyObj } = provider;
  return JSON.parse(accountKeyObj);
}

const getFirstPaymentProviderByPmcId = async({ pmc_id }) =>{
  const provider = await PmcPaymentProvider.findOne({ 
    where: { 
      pmc_id,
      is_active: true,
      is_deleted: false,
    }
  });
  if (!provider) throw new Error(`No payment provider for this PMC ${pmc_id}`);
  return provider;
}

const create = async(data) => {
  const { code, pmc_id } = data;
  const isExist = await PmcPaymentProvider.findOne({ where: { code, pmc_id } });
  if (isExist) throw new Error(`Payment provider ${code} exists in PMC ${pmc_id}.`);
  return await PmcPaymentProvider.create(data);
}

const healthCheck = async({ code, accountKeyObj }) => {
  if (code === 'PACE') {
    const { isStable, errorMessage } = await isFuzeUp(accountKeyObj);
    if (!isStable) throw new Error(errorMessage);
    return isStable;
  }
  return true; // Should check other payment health check. By default, expected they're up & running.
}

export {
  create,
  getAccountKeyObjByPmcId,
  getFirstPaymentProviderByPmcId,
  healthCheck,
}