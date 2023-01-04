//https://dev.mendeley.com/reference/topics/authorization_client_credentials.html


const strKey = "wOnGAq72vj7UeU7K2OiidoXPMIy5az9R"; //username
const strPassword = "L7yX881wEReMJ3mX"; //password

const axios=require("axios");
const https = require("https");
var strUrl = "";

const client = axios.create({
  baseURL: strUrl,
  auth: {
    username: strKey,
    password: strPassword
  },
  json: true,
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  })
}); 

 
  
  
  

module.exports = {
  async execute(method, resource, data) {
    console.log("calling resource" + resource);
    // inject the accessToken for each request
    //let accessToken = await Vue.prototype.$auth.getAccessToken();
    return client({
      method,
      url: resource,
      data,
      /*headers: {
          Authorization: `Bearer ${accessToken}`,
        },*/
    }).then(req => {
      console.log(req);
      return req.data;
    });
  },
  async postAxia(){
/*
    this also works
    var res = await axios.post('https://test-api.i3verticals.com/v2/services/oauth2/token',
    'grant_type=client_credentials&scope=all&client_id=wOnGAq72vj7UeU7K2OiidoXPMIy5az9R&client_secret=L7yX881wEReMJ3mX'
    );
    console.log(res);
*/
    var data = {
      "grant_type": "client_credentials",
      "scope":"all",
   
      "client_id": "wOnGAq72vj7UeU7K2OiidoXPMIy5az9R",
      "client_secret": "L7yX881wEReMJ3mX"   
    };
    const querystring = require('querystring');
    data = querystring.stringify(data);

    let res = await axios.request({
      url: "https://test-api.i3verticals.com/v2/services/oauth2/token",
      method: "post",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data:data
    })
    console.log(res);





  },
  
  
};
