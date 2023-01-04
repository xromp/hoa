import { postUnit, bulkCreateUnit } from '../../unit.controller';
import { bulkCreate } from '../../unit_user.controller';

import { getResponseByEndpoint } from '../utils';
import createUnitLoggings from './createUnitLoggings';
import CaliberUser from '../../../models/caliber_user';
import UnitUser from '../../../models/unit_user';
import CaliberUnitAccount from '../../../models/caliber_unit_account';
import { createTransactionLine, createTransactionHeader } from '../Transaction';

const clientUnitMapUnit = (client) => {
  return {
    number: client.UnitNumber,
    building_id: client.property_id,
    parent_org_id: client.parent_org_id,
    createdAt: new Date(),
    unit_square_feet: 0,
    hoa_fee: 0,
    parking_stall_number: '',
    wine_locker_number: '',
    storage_unit_number: '',
    surfboard_storage: '',
    bike_storage: '',
    kayak_storage_number: '',
    boat_storage_number: '',
    unit_status_id: 0,
    is_high_security: false,
    high_security_note: '',
    votes_pci: '',
    maint_fee: '',
    reserve_fee: '',
    rec_fee: '',
  };
};


const formatUnits = (caliber, axp) => {
  return axp
    .filter(({ id }) => id)
    .map(({ id }, i) => ({
      caliber_unit_id: caliber[i].UnitID,
      unit_id: id,
      last_modified_by: 'caliber',
    }));
}

const createUnitUsers = async(users, unitMapIds) => {
  console.log(`[Caliber] Uploading Unit User ...`);

  for (const { caliber_unit_id, unit_id } of unitMapIds) {
    const currentOwners = await getResponseByEndpoint(`api/v2/unit/${caliber_unit_id}/currentowners`);
    for (const { ContactID } of currentOwners) {
      const caliberUser = await CaliberUser.findOne({ 
        where: { caliber_user_id:ContactID },
        order: [ [ 'createdAt', 'DESC' ]],
      });

      if (caliberUser) {
        const { user_id } = caliberUser;
        const { dataValues:createdUnitUser } = await UnitUser.create({user_id, unit_id});
        const unitAccounts = await getResponseByEndpoint(`api/v2/unit/${caliber_unit_id}/unitaccounts/all`);
        for (const { UnitAccountID, AccountBalances } of unitAccounts) {
          CaliberUnitAccount.create({
            caliber_unit_account_id: UnitAccountID,
            unit_user_id: createdUnitUser.id,
          });
          createTransactionHeader({
            unit_id,
            caliber_unit_id,
            transaction: AccountBalances,
            unit_account_id: UnitAccountID,
          });
        }
      } else {
        const unitAccounts = await getResponseByEndpoint(`api/v2/unit/${caliber_unit_id}/unitaccounts/all`);
        for (const { AccountBalances } of unitAccounts) {
          createTransactionHeader({
            unit_id,
            caliber_unit_id,
            transaction: AccountBalances,
          });
        }
      }
    }
  }
}

const createUnitsFromClient = async({ client_id, property_id, parent_org_id }, users, currentUser) => {
  try {
    console.log(`[Caliber] Uploading Units...`);
    const caliberUnits = await getResponseByEndpoint(`api/v2/client/${client_id}/units`);
    if (!caliberUnits) throw new Error ('Invalid Client ID');

    const units = caliberUnits.map(unit => clientUnitMapUnit({ 
      ...unit, 
      property_id,
      parent_org_id,
      ...currentUser }));
    const createdUnits = await bulkCreateUnit(units);
    
    const caliberUnitIdsMap = formatUnits(caliberUnits, createdUnits);
    await createUnitLoggings(caliberUnitIdsMap);
    createUnitUsers(users, caliberUnitIdsMap);
    console.log(`[Caliber] Units created (${createdUnits.length})`);
    return createdUnits;
  } catch (error) {
    console.log(`[Caliber] ${error}`);
    throw new Error (error);
  }
}

export default createUnitsFromClient;