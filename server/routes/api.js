const express = require('express')
const api = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer")
const http = require('http')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
var https = require("https")
var axios = require('axios')

const VendorCategoryMaster = require('../models/vendor_category_master')
const Vendor = require('../models/vendor')
const User = require('../models/user')
const Salutation = require('../models/salutation')
const Country = require('../models/country_master')
const MaintenanceType = require('../models/maintenance_type')
const Building = require('../models/building')
const Property = require('../models/property')
const Unit = require('../models/unit')
const RequestStatus = require('../models/m_request_status')
const UserRole = require('../models/user_role')
const UserModule = require('../models/user_module')
const CountryAf = require('../models/country_af')
const BillType = require('../models/bill_type')
const UnitUser = require('../models/unit_user')
const Portfolio = require('../models/pmc')
const PmcUser = require('../models/pmc_user')
const PropertyUser = require('../models/property_user')
const PropertyManager = require('../models/property_manager')
const AmenityTime = require('../models/amenity_time')
const Freq = require('../models/freq')
const WorkWeek = require('../models/work_week')
const MaintenanceStaff = require('../models/maintenance_staff')
const UserOrgRole = require('../models/user_org_role');
const { findPropertyByRef } = require('../controllers/property.controller')

api.use(cors())
const today = new Date()

User.belongsTo(UserRole, {targetKey:'id', foreignKey: 'user_role_id'})
User.hasMany(UnitUser, {foreignKey: 'user_id'})
User.hasMany(PropertyManager, {foreignKey: 'user_id'})
User.hasMany(UserOrgRole, {foreignKey: 'user_id'})
UserOrgRole.belongsTo(UserRole, { targetKey:'id', foreignKey: 'user_role_id'})
User.hasMany(MaintenanceStaff, {foreignKey: 'user_id'})

process.env.SECRET_KEY = 'secret'

api.get('/freq/list', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  Freq.findAll({
    order: [
      ['id', 'ASC']
    ],
  })
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

api.get('/work-week/list', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  WorkWeek.findAll({
    order: [
      ['id', 'ASC']
    ],
  })
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

api.get('/amenity-time/list', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  AmenityTime.findAll({
    order: [
      ['id', 'ASC']
    ],
  })
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

api.get('/pmc/:id', async (req, res) => {
  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    var Port = Portfolio.findAll({
      where: {
        pmc_id: req.params.id,
      }
    })

    res.send(Port)   

  } catch(err){
    res.status(400).json({ error: err })
  }   
})

api.get('/pmc/properties/:id', async (req, res) => {
  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    var allProperty = await Property.findAndCountAll({
      attributes: [
        'name',
        // [sequelize.fn('count', sequelize.col('pmc_id')), 'total_pmcId'],
      ],
      // group: ['pmc_id'],
      where: {
        pmc_id: req.params.id,
      } 
    }) 

    res.send(allProperty)   

  } catch(err){
    res.status(400).json({ error: err })
  }   
})

api.get('/pmc/users/:id', async (req, res) => {
  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    var data = await PmcUser.findAndCountAll({
      attributes: [
        'user_id',
        // [sequelize.fn('count', sequelize.col('pmc_id')), 'total_pmcId'],
      ],
      // group: ['pmc_id'],
      where: {
        pmc_id: req.params.id,
      } 
    }) 

    res.send(data)   

  } catch(err){
    res.status(400).json({ error: err })
  }   
})

api.get('/property/users', async (req, res) => {
  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    var propertyRes = await Property.findAll({
      where: {
        ref: req.headers['property_ref']
      },
    })

    var data = await PropertyUser.findAndCountAll({
      attributes: [
        'user_id',
        // [sequelize.fn('count', sequelize.col('pmc_id')), 'total_pmcId'],
      ],
      // group: ['pmc_id'],
      where: {
        property_id: propertyRes[0]['dataValues']['id'],
      } 
    }) 

    res.send(data)   

  } catch(err){
    res.status(400).json({ error: err })
  }   
})

api.get('/property/managers', async (req, res) => {
  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    var propertyRes = await Property.findAll({
      where: {
        ref: req.headers['property_ref']
      },
    })

    var data = await User.findAll({
      include: [
        { 
          model: PropertyManager,
          where: {
            property_id: propertyRes[0]['dataValues']['id'],
          } 
        },      
      ],      
    }) 

    res.send(data)   

  } catch(err){
    res.status(400).json({ error: err })
  }   
})

api.get('/auth', (req, res) => {
  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    res.json('success')
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }
})

api.get('/salutation/list', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  Salutation.findAll({
    order: [
      ['id', 'ASC']
    ],
  })
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

api.get('/country/list', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  Country.findAll({
    order: [
      ['id', 'ASC']
    ],
  })
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

api.get('/maintenanceType/list', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  MaintenanceType.findAll({
    order: [
      ['id', 'ASC']
    ],
  })
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

api.get('/vendor/list', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  Vendor.findAll({
    order: [
      ['id', 'ASC']
    ],
  })
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

api.get('/staff/list', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  User.findAll({
    include: [
      { 
        model: MaintenanceStaff,
        required: true,
      },
    ],
    order: [
      ['id', 'ASC']
    ],
  })
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

api.get('/vendorCategoryMaster/list', (req, res) => {

  try {
    if (req.query.mode !== 'test') {
      let decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    }
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  VendorCategoryMaster.findAll({
    order: [
      ['name', 'ASC']
    ],
  })
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

api.get('/user/list', async (req, res) => {

  try {
    const { current_env } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const { parent_org_id, property_ref:ref } = current_env;
    const { id: property_id } = await findPropertyByRef({ ref })
    const filter = {
      pmc_id: parent_org_id,
      property_id,
    };
    const data = await User.findAll({
      include: [
        { model: UnitUser },
        { model: UserRole },
        { model: UserOrgRole, include: [UserRole], where: { ...filter } },
      ],
      order: [
        ['id', 'ASC']
      ],
      required: true,
    });
    res.send(data);
  } catch(err) {
    res.status(400).json({ error: err })
  }
})

api.get('/building/list', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  Building.findAll({
    order: [
      ['id', 'ASC']
    ],
  })
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

api.get('/property/list/ref', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  Property.findAll({
    order: [
      ['id', 'ASC']
    ],
    where: {
      ref: req.headers['property_ref'],
    }    
  })
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

api.get('/property/list', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  Property.findAll({
    order: [
      ['id', 'ASC']
    ],
    where: {
      pmc_id: decoded.pmc_id,
    }    
  })
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

api.get('/property/list/all', async (req, res) => {

  try {
    const { current_env } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const { parent_org_id } = current_env;
    const data = await Property.findAndCountAll({
      attributes: ['name'],
      order: [
        ['id', 'ASC']
      ],
      where: {
        pmc_id: parent_org_id,
      }
    });
    res.send(data);
  } catch(err){
    res.status(400).json({ error: err })
  }
})

api.get('/unit/list', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  Unit.findAll({
    order: [
      ['id', 'ASC']
    ],
  })
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

api.get('/requestStatus/list', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  RequestStatus.findAll({
    where: {
      updatedAt: {
        [Op.ne]: null
      }
    },
    order: [
      ['id', 'ASC']
    ],
  })
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

api.get('/userRole/list', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  UserRole.findAll({
    order: [
      ['name', 'ASC']
    ],
    where: {
      access_level: {
        [Op.ne]: 100
      }
    },

  })
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

api.get('/mainRole/list', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  UserRole.findAll({
    order: [
      ['name', 'ASC']
    ],
    where: {
      parent_id: 0,
      access_level: {
        [Op.ne]: 100
      }
    },
  })
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

api.get('/userModule/list', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  UserModule.findAll({
    order: [
      ['name', 'ASC']
    ],
    where: { is_active: true }
  })
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

api.get('/countryAf/list', async (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  const getCountry = () => {
    return new Promise((resolve, reject) => {
      try {
        Country.findAll({
          order: [
            ['id', 'ASC']
          ],
        })
        .then(data => {
          resolve(data)
        })
        .catch(err => {
          reject(err.toString('utf8'))
        })
      } catch(err) {
        reject(err.toString('utf8'))
      }
    })   
  }

  const getCountryAf = () => {
    return new Promise((resolve, reject) => {
      try {
        CountryAf.findAll({
          order: [
            ['id', 'ASC']
          ],
        })
        .then(data => {
          const d = {
            country_id: decoded.country_id,
            first_name: decoded.first_name,
            last_name: decoded.last_name,
            email: decoded.email,
            phone1: decoded.phone1,
            city: decoded.city,
            address_line_1: decoded.address_line_1,
            address_line_2: decoded.address_line_2
          }

          res.send({d, data})
          resolve(data)
        })
        .catch(err => {
          reject(err.toString('utf8'))
        })
      } catch(err) {
        reject(err.toString('utf8'))
      }
    })   
  }

  // const gC = await getCountry()
  const gCAF = await getCountryAf()
  // res.send({decoded['country_id'], gCAF})

})

api.get('/billType/list', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  BillType.findAll({
    order: [
      ['name', 'ASC']
    ]
  })
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

api.get('/insight/auth', async (req, res) => {
  try {

    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const strBaseApiUrl = 'https://api.insightpace.com/';
    const strUsername = "ZGZhOTFjMjZlMTk2NDg2MTkzM";
    const strPassword = "MGOyEjY4M2YjJWYmNmNwgTO1U";
    const agent = new https.Agent({  
      rejectUnauthorized: false
    });

    let strSecurityString = `${strUsername}:${strPassword}`;
    strSecurityString = Buffer.from(strSecurityString).toString('base64');
    strSecurityString = `basic ${strSecurityString}`;

    axiosInstance = axios.create({
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

          resolve(objResponse.data)
        } catch(err) {
          reject({blnOK:false,strMsg:err.message,strUrl:strUrl});
        }
      })  
    }

    var objData1 = {
      "User_ID": decoded.id,
      "Email": decoded.email,
      "FirstName": decoded.first_name,
      "LastName": decoded.last_name,
      "Timezone": "Pacific Standard Time",
      "AccountType": 1,
      "AccessGroups":["0M001R00WP"],
      "Functionality": {
        "VoidsReturns": false,
        "Statements": false
      }
    }

    const strUrl1 = "insightbridge/insightuserprovision";
    let objResponse = await execute("POST", strUrl1, objData1)

    var objData2 = {
      "User_ID": objResponse.User_ID,
      "User_Ref_ID": objResponse.User_Ref_ID,
      "User_Auth_Code": objResponse.User_Auth_Code,
      "Return_Path": "cc_funding_report"      
    }

    const strUrl2 = "insightbridge/insightuserauthenticate";
    let objResponse2 = await execute("POST", strUrl2, objData2)
    res.send(objResponse2)
    
  } catch(err){
    res.status(400).json({ error: err })
  }    
})
module.exports = api
