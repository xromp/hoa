import { optionalChaning } from '../utils';

const mapVendor = (caliber) => {
  return {
    name: caliber.CompanyName,
    email: caliber.Email,
    phone: caliber.Phone,
    category_id: '[4]',
    billing_address_line_1: caliber.Address1,
    billing_city: caliber.City,
    billing_state: caliber.State,
    billing_zip: caliber.Zip,
    billing_email: caliber.Email,
    billing_phone: caliber.Phone,
    business_name: caliber.CompanyName,
    business_address_line_1: caliber.Address1,
    business_city: caliber.City,
    business_state: caliber.State,
    business_zip: caliber.Zip,
    business_email: caliber.Email,
    business_phone: caliber.Phone,
    business_license: caliber.BusinessLicense,
    business_license_exp: new Date('12/12/2050'),
    insurance_license: '',
    insurance_license_exp: '',
    bond_docs: '',
    bond_docs_exp: '',
    service_radius: '',
    business_country: 236,
    billing_country: 236,
  };
};

export default mapVendor;