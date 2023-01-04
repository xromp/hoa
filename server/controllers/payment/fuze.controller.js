
const axiosInstance = require('axios');

//class FuzeController {

    baseUrl = process.env.NODE_ENV != 'production'? "https://test.fuzepace.com/api/" : "https://fuzepace.com/api/";
    exports.mapCCObject = ({
      CardType,
      CardNumber,
      ExpirationMonth,
      ExpirationYear,
      CVV,
      FirstName,
      LastName,
      StreetAddress,
      City,
      State,
      Zip,
      EmailAddress,
    }) => ({
      CardType,
      CardNumber,
      ExpirationMonth,
      ExpirationYear,
      CVV,
      FirstName,
      LastName,
      StreetAddress,
      City,
      State,
      Zip,
      EmailAddress,
    });

    exports.mapACHObject = ({
      FirstName,
      LastName,
      StreetAddress,
      City,
      State,
      Zip,
      EmailAddress,
      ACHAccount,
      ACHAccountHolderType,
      ACHRouting,
      ACHType,
    }) => ({
      FirstName,
      LastName,
      StreetAddress,
      City,
      State,
      Zip,
      EmailAddress,
      ACHAccount,
      ACHAccountHolderType,
      ACHRouting,
      ACHType
    });

    exports.createCCToken =  async(paymentObj) => {
      try {  
        let ccTokenResponse = await axiosInstance({
          method:"post",
          url: baseUrl + "CreateCCToken",
          data: { ...paymentObj },
        })
        return ccTokenResponse;
      } catch({ message }) {
        return { hasError: true, message };
      }
    }
    
    exports.ProcessCCToken = async(paymentObj) =>{
      try {  
        const response = await axiosInstance({
          method:"post",
          url: baseUrl + "ProcessCCTokenSale",
          data: paymentObj,
        })
        return response;
      } catch({ message }) {
        return { hasError: true, message };
      }
    }

    exports.createACHToken = async (paymentObj) => {
      try {  
        let ccTokenResponse = await axiosInstance({
          method:"post",
          url: baseUrl + "CreateACHToken",
          data: paymentObj,
        })
        return ccTokenResponse;
      } catch({ message }) {
        return { hasError: true, message };
      }
    }
    exports.ProcessACHToken= async (paymentObj)=>{
      try {  
        const response = await axiosInstance({
          method:"post",
          url: baseUrl + "ProcessACHTokenSale",
          data:paymentObj,	     
        })
        return response;
      } catch({ message }) {
        return { hasError: true, message };
      }
    }

    exports.healthCheck = async (fuzeObj)=>{
      try {  
        const { data } = await axiosInstance({
          method:"post",
          url: baseUrl + "FuzeHealthCheck",
          data: fuzeObj,
        })
        return data;
      } catch({ message }) {
        return { hasError: true, message };
      }
    }

    exports.isFuzeUp = async({ Fuze_PRIVATE_API_Key }) => {
      const { ResultCode, ResultDetail: errorMessage } = await this.healthCheck({ Fuze_PRIVATE_API_Key });
      return ResultCode === 0 
        ? { isStable: true } 
        : { isStable: false, errorMessage };
    }

    //TODO: add delete CC
    //TODO: add update CC
    //TODO: add delete ACH
    //TODO: add update ACH
//}
//module.exports = FuzeController;