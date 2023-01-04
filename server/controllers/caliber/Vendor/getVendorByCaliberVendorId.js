import CaliberVendor from '../../../models/caliber_vendor';

const getVendor = async({ caliber_vendor_id }) => {
  return await CaliberVendor.findOne({ 
    where: { caliber_vendor_id },
    order: [ [ 'createdAt', 'DESC' ]]
  });
}

export default getVendor;