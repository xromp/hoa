const mapClientToProperty = (client) => {
  return {
    name: client.ClientName,
    address_line_1: client.OfficialAddress1,
    address_line_2: client.OfficialAddress2,
    address_line_3: client.OfficialAddress3,
    city: client.OfficialCity,
    postal_code: client.OfficialZip,
    state: client.OfficialState,
    country: client.OfficialCounty,
    // client.OfficialPhone,
    BillingAddress1: client.BillingAddress1,
    BillingAddress2: client.BillingAddress2,
    BillingAddress3: client.BillingAddress3,
    BillingCity: client.BillingCity,
    // BillingCountry: client.BillingCountry,
    BillingCountry: 236,
    BillingFax: client.BillingFax,
    BillingState: client.BillingState,
    BillingZip: client.BillingZip,
    BillingPhone: client.BillingPhone,
    BillingFax: client.BillingFax,
    code: client.Code,
  }  
};

export default mapClientToProperty;