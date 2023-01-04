const express = require('express')
const billing = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const http = require('http')
const Bill = require('../../models/bill')
const BillLine = require('../../models/bill_line')
const UnitResident = require('../../models/unit_resident')
const UnitUser = require('../../models/unit_user')
const Unit = require('../../models/unit')
const Property = require('../../models/property')
const BillType = require('../../models/bill_type')
const UserRole = require('../../models/user_role')
const Vendor = require('../../models/vendor')
const User = require('../../models/user')
const TransactionLog = require('../../models/transaction_log')
const Country = require('../../models/country_master')
const Approval = require('../../models/approval')
const ApprovalItem = require('../../models/approval_item')
var request = require('request')
const mailController = require('../../controllers/mail')
const { createInvoice, updateInvoice, deleteBill } = require('../../controllers/billing.controller')
const sequelize = require('sequelize')
const { findPropertyByRef } = require('../../controllers/property.controller')
const { getRole } = require('../../controllers/user_org_role.controller');


billing.use(cors())
const today = new Date()

Bill.belongsTo(UnitResident, { targetKey:'id',foreignKey: 'unit_resident_id'})
Bill.belongsTo(User, { targetKey:'id',foreignKey: 'createdby_id'})
Bill.hasMany(BillLine, { targetKey:'id',foreignKey: 'bill_id'})
BillLine.belongsTo(BillType, {targetKey:'id',foreignKey: 'fee_type_id'})
UnitResident.belongsTo(User, { targetKey:'id',foreignKey: 'user_id' })
UnitResident.belongsTo(Unit, { targetKey:'id',foreignKey: 'user_id' })
Bill.belongsTo(Unit, { targetKey:'id',foreignKey: 'unit_id' })
Unit.hasMany(UnitResident, { foreignKey: 'unit_id' })
Unit.hasMany(UnitUser, { foreignKey: 'unit_id' })
Bill.belongsTo(Property, {targetKey:'id',foreignKey: 'property_id'})
Property.belongsTo(Country, { targetKey:'id',foreignKey: 'BillingCountry'})
User.belongsTo(Country, { targetKey:'id',foreignKey: 'country_id'})
Bill.belongsTo(Approval, { targetKey:'reference_id', foreignKey: 'id' })
Bill.belongsTo(TransactionLog, { targetKey:'billId',foreignKey: 'id'})
TransactionLog.belongsTo(User, { targetKey:'id',foreignKey: 'paid_by'})
Approval.belongsTo(User, { targetKey:'id',foreignKey: 'createdby_id' })
Approval.hasMany(ApprovalItem, { targetKey:'reference_id', foreignKey: 'approval_id' })
ApprovalItem.belongsTo(User, { targetKey:'id',foreignKey: 'user_id' })
Bill.belongsTo(Approval, { targetKey:'reference_id',foreignKey: 'id'})
Bill.belongsTo(Vendor, { foreignKey:'vendor_id' });
Vendor.belongsTo(Country, { targetKey:'id', foreignKey: 'billing_country' })

process.env.SECRET_KEY = 'secret'

billing.get('/list/status/:id', async (req, res) => {
  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }  

  Bill.findAll({
    attributes: [
      'vendor_id',
      [sequelize.fn('sum', sequelize.col('total_amount')), 'total_amount'],
    ],
    group: ['vendor_id'],
    where: {
      paid: req.params.id,
      vendor_id: decoded.vendor_id
    } 
  })
  .then(billing => {
    res.send(billing)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })  
})

billing.get('/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const { current_env } = decoded;
    const { 
      ledger_type, 
    } = req.query;

    const { id:property_id } = await findPropertyByRef({ ref: current_env.property_ref })
    const filter = {
      ledger_type,
      property_id,
      is_deleted: false,
    };
    const { user_role } = await getRole({ 
      property_id, 
      pmc_id: current_env.parent_org_id, 
      user_id: decoded.id,
      role_val: current_env.role_val,
    });
    const { val:role_val, permission } = user_role.dataValues;
    const role = JSON.parse(permission);
    if (role['account-receivable'] && role['account-receivable']['list']) {
      Bill.findAll({
        include: [
          { model: Unit, include: [ { model: UnitUser, include: [ { model: User, include: [ Country ]} ] }, ] },
          { model: Property },
          { model: User },
          { model: Approval },
          { model: Vendor, include: [ Country ] },
        ],
        where: filter,
        order: [
          ['id', 'DESC']
        ],
      })
      .then(billing => {
        res.send(billing)
      })
      .catch(err => {
        res.status(400).json({ error: err })
      })    
    } else if(role_val === 'vendor') {
      Bill.findAll({
        where: {
          vendor_id: decoded.vendor_id
        },
        include: [
          { model: Unit, include: [ { model: UnitUser, include: [ { model: User, include: [ Country ]} ] }, ] },
          { model: Property },
          { model: Vendor },
          { model: User },
          { model: Vendor, include: [ Country ] },
        ],
        where: filter,     
        order: [
          ['id', 'DESC']
        ],
      })
      .then(billing => {
        res.send(billing)
      })
      .catch(err => {
        res.status(400).json({ error: err })
      })
    } else {
      delete filter.ledger_type;
      Bill.findAll({
        include: [
          { model: Unit,
            required: true,
            include: [{
              model: UnitUser,
                required: true,
                include: [{
                  required: true,
                  model: User, where: { id: decoded.id }} 
                ]}
              ]},
          { model: Property },
          { model: User },
          { model: Vendor, include: [ Country ] },
        ],
        where: { ...filter, status: 'APPROVED' },
        order: [
          ['id', 'DESC']
        ],
      })
      .then(billing => {
        res.send(billing)
      })
      .catch(err => {
        console.log(err)
        res.status(400).json({ errors: err.toString('utf8') })
      })
    }
  } catch(error) {
    console.log(error)
    res.status(400).json({ errors: error.toString('utf8') })
  }
})

billing.get('/view/:id', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  Bill.findAll({
    include: [
      { model: Property, include: [ Country ] },
      { model: BillLine, include: [ BillType ] },
      { model: TransactionLog, include: [ User ] },
      { model: Vendor, include: [ Country ] },
      { model: Unit, include: [ { model: UnitUser, include: [ { model: User, include: [ Country ]} ] }, ] },
      { model: Approval, 
        include: [ 
          { model: User },
          { 
            model: ApprovalItem, 
            attributes: {
              include: [
                [sequelize.literal('IF(`approval->approval_items`.`user_id` = '+ decoded.id+', 1, 0)'), 'is_self']
              ]
            },
            include: [ User ] 
          }
        ]
      },
    ],    
    where: {
      id: req.params.id
    }
  })
  .then(billing => {
    res.send(billing)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

billing.get('/edit/:id', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  Bill.findAll({
    include: [
      { model: UnitResident },
      { model: Unit },
      { model: Property },
      { model: BillType },
        { model: Vendor }
    ],     
    where: {
      id: req.params.id
    }
  })
  .then(billing => {
    res.send(billing)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})


billing.patch('/update/:id', async (req, res) => {
  try {
    const { id: createdby_id, vendor_id } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const { id } = req.params;
    const response = await updateInvoice({ id, data: { ...req.body, createdby_id } });
    res.send(response)
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
})
billing.post('/save', async (req, res) => {
  try {
    // TODO: add vendor invoice creation to be billed/notified to the property's managers.
    const { id: createdby_id, current_env } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const { property_ref: ref } = current_env;
    const { id: property_id } = await findPropertyByRef({ ref });
    const response = await createInvoice({ ...req.body, property_id, createdby_id });
    res.send(response)
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
})

billing.post('/delete/:id', async (req, res) => {
  try {
    const { id: createdby_id, current_env } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const { id } = req.params;
    await deleteBill(id);
    res.send('success')
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
})

billing.post('/portfolio-reg', async function(req,res) {
  try {
    var decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  var dataObj = { 
    id: "4a36b348-9086-4f12-8c35-b0ec34edcc72",
    dpoPaymentToken: "22EEF8E8-C756-496E-BD68-EDAEF2741FB011",
    externalSystemId: decoded.id,
    dpoPaymentServiceId: "8162",
    gatewayId: "DPOG"
  }

  var invoiceObj = { 
   customerName: req.body.data.customerName,
   customerLastname: req.body.data.customerLastname,
   customerEmail: req.body.data.customerEmail,
   customerCountry: req.body.data.customerCountry,
   customerPhone: req.body.data.customerPhone,
   customerCity: req.body.data.customerCity,
   customerAddress: req.body.data.customerAddress,
   amountToCharge: req.body.data.amountToCharge,
   currencyToCharge: "KES",
   portfolioId: decoded.id, 
   accountingRef: "example-ref001290",
   callbackUrl: "https://webhook.site/#!/a54908a0-f0a3-4646-bb3d-838194a1a871"
  }

  const portReg = () => {
    return new Promise((resolve, reject) => {
      try {
        request({
          url: "http://paymentmodule-env.eba-4rbnxiwj.us-east-2.elasticbeanstalk.com:5000/portfolios/register/",
          method: "POST",
          json: true,   
          body: dataObj
        }, function (error, response, body){            
            resolve(response)
        });
      } catch(err) {
        reject(err.toString('utf8'));
      }
    })
  }

  const invoiceNew = () => {
    return new Promise((resolve, reject) => {
      try {
        request({
          url: "http://paymentmodule-env.eba-4rbnxiwj.us-east-2.elasticbeanstalk.com:5000/portfolios/invoice/new/",
          method: "POST",
          json: true,   
          body: invoiceObj
        }, function (error, response, body){   
          res.send(response)         
          resolve(response)
        });
      } catch(err) {
        reject(err.toString('utf8'));
      }
    })
  }

  await portReg()
  await invoiceNew()
})




module.exports = billing
