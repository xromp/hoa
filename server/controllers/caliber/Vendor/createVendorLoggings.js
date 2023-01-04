import CaliberVendor from '../../../models/caliber_vendor';

const createVendorLoggings = async(data) => {
  return await CaliberVendor.bulkCreate(data);
}

export default createVendorLoggings;