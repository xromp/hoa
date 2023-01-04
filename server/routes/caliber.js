const express = require('express')
const caliber = express.Router()
const cors = require('cors')
const http = require('http')
const jwt = require('jsonwebtoken')
var axios = require('axios');
var https = require("https");
var request = require('request')

import { createUsersFromClient } from '../controllers/caliber/Owner'
import { createPropertyFromClient } from '../controllers/caliber/Property';
import { createUnitsFromClient } from '../controllers/caliber/Unit';
import { createInvoicesFromClient } from '../controllers/caliber/Invoice';
import { createVendorsFromList } from '../controllers/caliber/Vendor';
import { getResponseByEndpoint } from '../controllers/caliber/utils';
caliber.use(cors())
const today = new Date()

/*
//This is the general API sandbox with a lot of clients to work with
const strBaseApiUrl = 'https://asp.calibersoftware.com/capi2_APISandbox/api/v2/';
const strAPICode = "aXess";
const strUsername = "aXess";
const strPassword = "Pword";
*/

//this one is specifically for FINITE

const strBaseApiUrl = 'https://frontsteps.cloud/CAPI2_FINITE/';
const strAPICode = "axp2019";
const strUsername = "aXessPoint";
const strPassword = "aX3ssP01nt2019";
const agent = new https.Agent({  
  rejectUnauthorized: false
});

let strSecurityString = `${strAPICode}:${strUsername}:${strPassword}`;
strSecurityString = Buffer.from(strSecurityString).toString('base64');
strSecurityString = `basic ${strSecurityString}`;

const axiosInstance = axios.create({
  headers: { 'Authorization': strSecurityString },
  httpsAgent: agent
})

function execute(method, resource, data) {
  const strUrl = strBaseApiUrl + resource;

  return new Promise(async (resolve, reject) => {
    try {  
	    let objResponse = await axiosInstance({
	      method,
	      url: strUrl,
	      data,	     
	    })

	    console.log('objResponse ', objResponse)
	    console.log('method ', method)
	    console.log('strUrl ', strUrl)
	    console.log('data ', data)

	    resolve(objResponse)
    } catch(err) {
      reject({blnOK:false,strMsg:err.message,strUrl:strUrl});
    }
  })  
}
caliber.post('/apiwrapper', async (req, res) => {
	var method ='post';

	const strUrl = strBaseApiUrl + req.body.data.path;
	var data = req.body.data.obj? req.body.data.obj : {};
	console.log('strUrl ', strUrl);
	var data = {
		"AccountNumber": "sample string 1",
		"Email": "sample string 2",
		"RefType": 1,
		"RefID": 3,
		"NameOption": 0,
		"URLForEmailLink": "sample string 4",
		"UnitAddress": "sample string 5",
		"UnitNumber": "sample string 6"
	  }
    try {  
	    let objResponse = await axiosInstance({
	      method,
	      url: strUrl,
	      data,	     
	    })

	    console.log('objResponse ', objResponse)
	    console.log('method ', method)
	    console.log('strUrl ', strUrl)
	    console.log('data ', data)

		res.send(objResponse.data);
    } catch(err) {
		res.status(400).json({ error: err.message})
    }
});
caliber.get('/apiwrapper', async (req, res) => {
	var method ='get';

	const strUrl = strBaseApiUrl + req.query.path;
	var data = req.body.data.obj? req.body.data.obj : {};
	console.log('strUrl ', strUrl);
	/*var data = {
		"AccountNumber": "sample string 1",
		"Email": "sample string 2",
		"RefType": 1,
		"RefID": 3,
		"NameOption": 0,
		"URLForEmailLink": "sample string 4",
		"UnitAddress": "sample string 5",
		"UnitNumber": "sample string 6"
	  }*/
    try {  
	    let objResponse = await axiosInstance({
	      method,
	      url: strUrl,
	      data,	     
	    })

	    console.log('objResponse ', objResponse)
	    console.log('method ', method)
	    console.log('strUrl ', strUrl)
	    console.log('data ', data)

		res.send(objResponse.data);
    } catch(err) {
		res.status(400).json({ error: err.message})
    }
});

caliber.get('/api', async (req, res) => {
	try {
		// var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

	  // const strUrl = strBaseApiUrl + req.headers['caliber-url'];
	  // let objResponse = await axiosInstance.get(strUrl)
	  // res.send(objResponse.data)

		const options = {
		  hostname: 'frontsteps.cloud',
		  port: 443,
		  path: '/CAPI2_FINITE/'+req.headers['caliber-url'],
		  method: 'GET',
		  headers: {
				'Authorization': strSecurityString
			},
		}

		const d = await https.request(options, result => {
		  console.log(`statusCode: ${result.statusCode}`)

		  let data = ""

		  result.on("data", d => {
		    data += d
		  })
		  result.on("end", () => {
		    res.send(JSON.parse(data))
		  })
		})

		d.on('error', err => {
		  res.status(400).json({ error: err.toString('utf8') })
		})

		d.end()
	} catch(err) {
		res.status(400).json({ error: err.toString('utf8') })
	}
})

caliber.get('/contacts', async (req, res) => {
	try {

		const strUrl = strBaseApiUrl + "api/v2/clientlist";

		// const dd = await axios.get({
		// 	headers: { 'Authorization': strSecurityString },
  	//	httpsAgent: agent,
    //	url: strUrl
    //	method: 'get'
		// })

		// res.json(dd)

		var objData = {
		  "AccountNumber": "sample string 1",
		  "Email": "sample string 2",
		  "RefType": 1,
		  "RefID": 3,
		  "NameOption": 0,
		  "URLForEmailLink": "sample string 4",
		  "UnitAddress": "sample string 5",
		  "UnitNumber": "sample string 6"
		}

		// request({
		//     url: strUrl,
		//     method: "POST",
		//     headers: {
		//         'Authorization': strSecurityString
		//     },
		//     httpsAgent: agent,
		//     json: true,
		//     body: objData
		// }, function (error, response, body){
		//     res.json(response);
		// });

		// const dd = await axios.get(strUrl, {
		//   headers: {
		//     'Authorization': strSecurityString
		//   },
		// 	// httpsAgent: agent
		// })		

		// axios.get(
		// 	strUrl, 
		// 	objData,
		// 	// headers: {
		//  //    'Authorization': strSecurityString
		//  //  },
		//   httpsAgent: agent
		// )
		// .then((res) => {
		//     res.json(res)
		// }).catch((err) => {
		// 		res.json(err)
		// });		

		// var options = {
		//   host: 'https://frontsteps.cloud',
		//   // port: 443,
		//   path: '/CAPI2_FINITE/api/v2/clientlist',
		//   method: 'GET',
		// 	headers: {
		// 		'Authorization': strSecurityString
		// 	},  
		// };


		// 	https.request(options, function(result) {
		// try {
		// 	  // console.log('STATUS: ' + result.statusCode);
		// 	  // console.log('HEADERS: ' + JSON.stringify(result.headers));
		// 	  // result.setEncoding('utf8');
		// 	  // result.on('data', function (chunk) {
		// 	  //   console.log('BODY: ' + chunk);
		// 	  // });
		// 	  res.json(result)
		// } catch(e) {
		// 	res.json(e)
		// }
		// 	});

		// var obd = []
		const https = require('https')
		const options = {
		  hostname: 'frontsteps.cloud',
		  port: 443,
		  path: '/CAPI2_FINITE/api/v2/clientlist',
		  method: 'GET',
		  headers: {
				'Authorization': strSecurityString
			},
		}

		// const options = {
		//   hostname: 'frontsteps.cloud',
		//   path: '/CAPI2_FINITE/api/v2/clientlist',
		//   method: 'POST',
		//   headers: {
		// 		'Authorization': strSecurityString
		// 	},
		// 	body: JSON.stringify({
		//     objData
		//   })
		// }

		const d = await https.request(options, result => {
		  console.log(`statusCode: ${result.statusCode}`)

		  let data = ""

		  result.on("data", d => {
		    data += d
		  })
		  result.on("end", () => {
		    // console.log(data)
		    res.send(JSON.parse(data))
		  })
		})

		d.on('error', error => {
		  console.error(error)
		})

		d.end()

		// function httpsPost({body, ...options}) {
		//     return new Promise((resolve,reject) => {
		//         const reqi = https.request({
		//             method: 'POST',
		//             ...options,
		//         }, result => {
		//             const chunks = [];
		//             result.on('data', data => chunks.push(data))
		//             result.on('end', () => {
		//                 let body = Buffer.concat(chunks);
		//                 switch(result.headers['content-type']) {
		//                     case 'application/json':
		//                         body = JSON.parse(body);
		//                         break;
		//                 }
		//                 console.log('body ', body.toString('utf8'))
		//                 resolve(body)
		//             })
		//         })
		//         reqi.on('error',reject);
		//         if(body) {
		//             reqi.write(body);
		//         }
		//         reqi.end();
		//     })
		// }

		// async function main() {
		//   const result = await httpsPost({
		//     hostname: 'frontsteps.cloud',
		//     path: `/CAPI2_FINITE/api/v2/clientlist`,
		//     headers: {
		//         'Authorization': strSecurityString,
		//         'Content-Type': 'application/json',
		//     },
		//     body: JSON.stringify({
		//         objData
		//     })
		//   })
		// }

		// main().catch(err => {
		//   console.log(err)
		// })

		// var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
		// var objData = {
		//   "AccountNumber": "sample string 1",
		//   "Email": "sample string 2",
		//   "RefType": 1,
		//   "RefID": 3,
		//   "NameOption": 0,
		//   "URLForEmailLink": "sample string 4",
		//   "UnitAddress": "sample string 5",
		//   "UnitNumber": "sample string 6"
		// }

	  //  const strUrl = "api/v2/requestnewuseraccountcomplete";
	  //  let objResponse = await execute("POST", strUrl, objData)
	  //  console.log('objResponse ', objResponse)
	  // res.json(objResponse.data)
	} catch(err) {
		res.send(err);
	}
})

caliber.get('/query', async (req, res) => {
  try {
    const { url } = req.query;
    console.log({url});
    const data = await getResponseByEndpoint(`api/v2/${url}`);
    res.send({ results: { total: data.length, data } });  
  } catch (error) {
    console.log(`[Caliber] ${error}`);
    res.status(400).json({ errors: error.toString('utf8') })
  }
});

caliber.get('/validate/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const client = await getResponseByEndpoint(`api/v2/client/${clientId}`);
    const owners = await getResponseByEndpoint(`api/v2/client/${clientId}/owners/all`);
    const units = await getResponseByEndpoint(`api/v2/client/${clientId}/units`);
    const invoices = await getResponseByEndpoint(`api/v2/client/${clientId}/invoices/6`);
    const vendors = await getResponseByEndpoint(`api/v2/client/${clientId}/vendors`);
    
    res.send({
      client: { data: client, total: client.length },
      owners: { data: owners, total: owners.length },
      units: { data: units, total: units.length },
      invoices: { data: invoices, total: invoices.length },
      vendors: { data: vendors, total: vendors.length },
    });  
  } catch (error) {
    console.log(`[Caliber] ${error}`);
    res.status(400).json({ errors: error.toString('utf8') })
  }
});

caliber.post('/create/property/:client_id', async (req, res) => {
  try {
    const { client_id } = req.params;
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const { email, first_name, last_name } = req.body;
    const currentUser = {
      paramsId: -1,
      decodedId: decoded.id,
      current_env: decoded.current_env,
      email,
      first_name,
      last_name,
    };
    const property = await createPropertyFromClient(client_id, currentUser);
    // const property = {  "property_id": 302, "parent_org_id": 216 };
    const vendors = await createVendorsFromList();
    const { owners, boardMembers } = await createUsersFromClient({ client_id, ...property }, currentUser);
    const units = await createUnitsFromClient({ client_id, ...property }, [ ...owners, ...boardMembers ], currentUser);
    const invoices = await createInvoicesFromClient({ client_id, ...property }, boardMembers, currentUser);

    res.send({ 
      property,
      units: { data: units, total: units.length},
      owners: { data: owners, total: owners.length},
      boardMembers: { data: boardMembers, total: boardMembers.length},
      invoices: { data: invoices, total: invoices.length },
      vendors: { data: vendors, total: vendors.length },
    });
  } catch (error) {
    console.log(`[Caliber] ${error}`);
    res.status(400).json({ errors: error.toString('utf8') })
  }  
});

module.exports = caliber;