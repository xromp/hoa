const express = require('express')
const maintenanceOrder = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const maintenanceOrderController = require('../controllers/maintenance_order.controller')
maintenanceOrder.use(cors())

maintenanceOrder.get('/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      queryDataType: req.query.dataType === undefined ? [] : req.query.dataType,
      decodedId: decoded.id,
      paramsId: req.params.id,
      property_ref: req.query.property_ref,
      parent_org_id: parseInt(req.query.parent_org_id),
      role_id: parseInt(req.query.role_id),
      role_val: req.query.role_val
    }

    const result = await maintenanceOrderController.getMaintenanceOrder(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

maintenanceOrder.get('/view/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      paramsId: parseInt(req.params.id),
      formType: req.query.formType,
      decodedVendorId: decoded.vendor_id,
      decodedUserRoleId: decoded.user_role_id,
      decodedId: decoded.id,

      'property_ref': req.query.property_ref,
      'parent_org_id': parseInt(req.query.parent_org_id),
      'role_id': parseInt(req.query.role_id),
      'role_val': req.query.role_val
    }
    const result = await maintenanceOrderController.getMaintenanceOrderById(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

maintenanceOrder.post('/save/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    let data = req.body.data
    data.decodedId = decoded.id
    data.paramsId = parseInt(req.params.id) 
    data.property_ref = req.query.property_ref
    data.parent_org_id = parseInt(req.query.parent_org_id)
    data.role_id = parseInt(req.query.role_id)
    data.role_val = req.query.role_val

    const result = await maintenanceOrderController.postMaintenanceOrder(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

maintenanceOrder.post('/delete/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    // const result = await Maintenance.update({
    //   updatedAt: today
    // }, {
    //   where: {
    //     id: req.params.id
    //   }
    // })

    res.send('success')
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

maintenanceOrder.post('/received-by/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body.data
    data.paramsId = parseInt(req.params.id)
    data.decodedId = decoded.id
    const result = await maintenanceOrderController.postMaintenanceOrderReceived(data)

    res.send('success')
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

maintenanceOrder.post('/update-stat/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body.data
    const params = req.body.params
    data.paramsId = parseInt(req.params.id)
    data.decodedId = decoded.id
    data.decodedFullName = decoded.first_name+' '+decoded.last_name
    data.decodedUserRoleId = decoded.user_role_id
    const result = await maintenanceOrderController.postMaintenanceOrderStatus(data, params)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

maintenanceOrder.post('/assign/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body.data
    data.staffId = JSON.stringify(data.assigned_to)
    data.due_date = data.createdAt
    data.paramsId = parseInt(req.params.id)
    data.decodedId = decoded.id
    data.decodedFullName = decoded.full_name
    data.decodedEmail = decoded.email
    data.decodedPhone1 = decoded.phone1
    // data.req = req
    const result = await maintenanceOrderController.postMaintenanceOrderAssign(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

maintenanceOrder.post('/reopen/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body.data
    data.paramsId = parseInt(req.params.id)
    const result = await maintenanceOrderController.postMaintenanceOrderReopen(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

maintenanceOrder.post('/accept/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body.data
    data.paramsId = parseInt(req.params.id)
    data.decodedVendorId = decoded.vendor_id
    data.decodedId = decoded.id
    data.decodedFullName = decoded.first_name+' '+decoded.last_name
    data.parent_org_id = parseInt(decoded.current_env.parent_org_id)
    data.req = req
    const result = await maintenanceOrderController.postMaintenanceOrderAccept(data)

    res.send({ message:'success', result })
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})


//Not using
maintenanceOrder.get('/list/status/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const { id } = req.params
    const result = await maintenanceOrderController.getMaintenanceOrderById(id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

maintenanceOrder.post('/dt/save/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body.data
    data.paramsId = parseInt(req.params.id)
    const result = await maintenanceOrderController.postMaintenanceOrderAvailability(data)

    res.send({ maintenanceDt:result })
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

maintenanceOrder.post('/reject/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body.data
    res.send(data)
    data.paramsId = parseInt(req.params.id)
    data.decodedVendorId = decoded.vendor_id
    data.req = req

    return false
    const result = await maintenanceOrderController.postMaintenanceOrderReject(data)

    res.send({ message:'success', result })
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

// function sendEmail2(email, req) {
//   const sgMail = require('@sendgrid/mail');
//   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//   const msg = {
//     to: email,
//     from: process.env.MAILER_USER, // Use the email address or domain you verified above
//     subject: 'Sending with Twilio SendGrid is Fun',
//     text: 'and easy to do anywhere, even with Node.js',
//     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
//   };
//   //ES6
//   sgMail
//     .send(msg)
//     .then(() => {}, error => {
//       console.error(error);
   
//       if (error.response) {
//         console.error(error.response.body)
//       }
//     });
//   //ES8
//   (async () => {
//     try {
//       await sgMail.send(msg);
//     } catch (error) {
//       console.error(error);
   
//       if (error.response) {
//         console.error(error.response.body)
//       }
//     }
//   })();
// }

module.exports = maintenanceOrder
