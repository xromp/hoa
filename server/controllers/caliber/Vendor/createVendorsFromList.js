import { bulkCreate } from '../../vendor.controller';

import { getResponseByEndpoint } from '../utils';
import createVendorLoggings from './createVendorLoggings';
import mapVendor from './mapVendor';

const formatCaliberVendors = (caliberVendors, axpVendors) => {
  return axpVendors
    .filter(({ id }) => id)
    .map(({ id }, i) => ({
      caliber_vendor_id: caliberVendors[i].VendorID,
      vendor_id: id,
      last_modified_by: 'caliber',
    }))
}

const createVendorsFromClient = async() => {
  try {
    console.log(`[Caliber] Uploading Vendors...`);
    const caliberVendors = await getResponseByEndpoint(`api/v2/vendorlist`);
    if (!caliberVendors) throw new Error ('Invalid Client ID');

    const vendors = caliberVendors.map(vendor => mapVendor(vendor));
    const createVendors = await bulkCreate(vendors);
    const axpVendors = createVendors.map(({ dataValues }) => dataValues);
    const caliberVendorMapping = formatCaliberVendors(caliberVendors, axpVendors);
    await createVendorLoggings(caliberVendorMapping);
    console.log(`[Caliber] Vendors created (${createVendors.length})`);
    return createVendors;
  } catch (error) {
    console.log(`[Caliber] ${error}`);
    throw new Error (error);
  }
}

export default createVendorsFromClient;