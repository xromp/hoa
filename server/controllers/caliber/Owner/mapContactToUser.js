import { optionalChaning } from '../utils';

const mapContactToUser = (owner) => {
  const randomChars = Math.random().toString(36).substr(2, 6);
  const [first_name, last_name] = owner.Name.split(' ');
  return {
    email: `caliber${randomChars}@test.com`,//optionalChaning(() => owner.EmailAddresses[0].Email),
    first_name,
    last_name,
    user_role_id: owner.user_role_id,
    type: "",
    createdAt: new Date(),
    // updatedAt: "",
    is_activated: 0,
    password: "",
    generatePassword: true,
    // profile_json: "",
    phone1: `(${optionalChaning(() => owner.Phones[0].AreaCode)}) ${optionalChaning(() => owner.Phones[0].Number)}`,
    // push_user_id: "",
    // push_token: "",
    // dob: "",
    address: optionalChaning(() => owner.Address1),
    middle_name: owner.MiddleInitial1,
    // phone2: "",
    // salutation_id: "",
    suffix: owner.Suffix1,
    // notes: "",
    // avatar_filename: "",
    city: optionalChaning(() => owner.City),
    state: optionalChaning(() => owner.State),
    country_id: 236, //US
    address_line_1: optionalChaning(() => owner.Address1),
    province: "",
    address_line_2: "",
    property_id: 0,
    postcode: owner.ZipCode,
    emails: "",
    vendor_id: 0,
    emergency_contact_name: "",
    relation: "",
    emergency_contact_no: "",
    pmc_id: 0,
    phone_1_area: "",
    phone_1_type: "",
    phone_2_area: "",
    phone_2_type: "",
    caliber_contact_id: '',
    is_deleted: false,
    socket_id: "",
    is_reset: false,
    company_na: "",
  };
};

export default mapContactToUser;