let strPublicKey = "k3trRP3sDSjca4EfFslMtScZz";

const strFuzeBaseUrl = "https://test.fuzepace.com/api/";

const strCaliberFuzeBaseUrl = "https://caliberbackend.axesspoint.app/fuze/";

import axios from "axios";

const fuzeClient = axios.create({
  baseURL: strFuzeBaseUrl,
  json: true
});

const caliberFuzeClient = axios.create({
  baseURL: strCaliberFuzeBaseUrl,
  json: true
});

const arrCardTypes = ["Visa", "MasterCard", "American Express", "Discover"];

export default {
  async execute(client, method, resource, data) {
    console.log("calling resource" + resource);
    // inject the accessToken for each request
    //let accessToken = await Vue.prototype.$auth.getAccessToken();

    let objResponse = await client({
      method,
      url: resource,
      data
      /*headers: {
            Authorization: `Bearer ${accessToken}`,
          },*/
    });
    console.log(objResponse.data);
    return objResponse.data;
  },
  async createCCToken(objParams) {
    const intCardTypeId = this.getCardTypeId(objParams.CardType);
    objParams.Fuze_PUBLIC_API_Key = strPublicKey;
    objParams.CardType = intCardTypeId;

    let objResponse = await this.execute(
      fuzeClient,
      "POST",
      "CreateCCToken",
      objParams
    );

    /*{
        "Token":"8761182347841111",
        "Token_SF":null,
        "Last4":"1111",
        "ExpirationMonth":11,
        "ExpirationYear":22,
        "FirstName":"James",
        "LastName":"Smith",
        "StreetAddress":"street",
        "City":"Fresno",
        "State":"CA",
        "Zip":"93727",
        "EmailAddress":"SMITH.JAMES1982@GMAIL.COM",
        "CardType":4,
        "ResultCode":0,
        "ResultDetail":"Successful",
        "CVV_Response":"0: NotSet",
        "AVS_Response":"0: NotSet"}
        */

    return objResponse;
  },
  getCardTypeId(strCardType) {
    //let intId;
    switch (strCardType) {
      case "American Express":
        return 1;
      case "Discover":
        return 2;
      case "MasterCard":
        return 3;
      case "Visa":
        return 4;
    }
    throw new Error("Invalid" + strCardType);
  },

  async processCCTokenSale(objParams, objToken) {
    console.log("processing CCTOKEN SALE");
    const strToken = objToken.Token;
    objParams.Token = strToken;
    let objResponse = await this.execute(
      caliberFuzeClient,
      "POST",
      "ProcessCCTokenSale",
      objParams
    );
    console.log(objResponse);
    return objResponse;
  },
  async createACHToken(objParams) {
    objParams.Fuze_PUBLIC_API_Key = strPublicKey;

    try {
      let objResponse = await this.execute(
        fuzeClient,
        "POST",
        "CreateACHToken",
        objParams
      );

      /*
      {
        "Token": "2200133556441111",
        "Token_SF": null,
        "ACHType": 1,
        "ACHAccountHolderType": 0,
        "FirstName": "James",
        "LastName": "Smith",
        "StreetAddress": "street",
        "City": "Fresno",
        "State": "CA",
        "Zip": "93727",
        "EmailAddress": "SMITH.JAMES1982@GMAIL.COM",
        "ResultCode": 0,
        "ResultDetail": "Successful"
      }
       */
      return objResponse;
    } catch (e) {
      console.log(e);
    }
  },
  async processACHTokenSale(objParams, objToken) {
    const strToken = objToken.Token;
    objParams.Token = strToken;
    //Token_SF: "8761182347841111",

    let objResponse = await this.execute(
      caliberFuzeClient,
      "POST",
      "ProcessACHTokenSale",
      objParams
    );
    
    console.log(objResponse);
    return objResponse;
  },
  async payCC(objParams) {
    let objToken = await this.createCCToken(objParams);
    console.log("The token is", objToken);
    let objResponse = await this.processCCTokenSale(
      objParams,
      objToken
    );
    return objResponse;
  },
  async payACH(objParams) {
    let objToken = await this.createACHToken(objParams);
    console.log("The token is", objToken);
    let objResponse = await this.processACHTokenSale(
      objParams,
      objToken
    );

    if(objResponse.ResultCode == 0){
      //approved
    }else if(objResponse.ResultCode == 1){
         //error
    }else if(objResponse.ResultCode == 2){
      //invalid token
    }

    this.$router.replace({path:"payment",params:objResponse});
  },



};
