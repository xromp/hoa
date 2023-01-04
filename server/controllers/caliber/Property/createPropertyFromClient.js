import { postPortfolio } from '../../portfolio.controller';
import createPropertyClientLogging from './createPropertyClientLogging';
import mapClientToProperty from './mapClientToProperty';

import { getResponseByEndpoint } from '../utils';

const clientMapPMC = (client) => {
  return {
    name: client.ClientName,
    property_name: client.ClientName,
    notes: '',
    address: client.OfficialAddress1,
    phone: client.OfficialPhone,
    classification: '',
    email: '',
  }
};

const createPropertyFromClient = async(client_id, currentUser) => {
  try {
    console.log(`[Caliber] Uploading property...`);
    const clients = await getResponseByEndpoint(`api/v2/client/${client_id}`);
    if (!clients) throw new Error ('Invalid Client ID');

    const pmc = clientMapPMC(clients[0]); 
    const property = mapClientToProperty(clients[0]);
    const pmcResult = await postPortfolio({ ...pmc, ...property, ...currentUser });
    const createdProperty = {
      property_id: pmcResult.property_result.result.id,
      parent_org_id: pmcResult.portfolio_result.id,
    }
    await createPropertyClientLogging({ ...createdProperty, client_id, last_modified_by: 'caliber' });
    console.log(`[Caliber] Property created ${JSON.stringify(createdProperty)}`);
    return createdProperty;
  } catch (error) {
    throw new Error(error)
  }
}

export default createPropertyFromClient;