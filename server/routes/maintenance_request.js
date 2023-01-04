const express = require('express')
const maintenanceRequest = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const maintenanceRequestController = require('../controllers/maintenance_request.controller')
maintenanceRequest.use(cors())

maintenanceRequest.get('/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      decodedId: decoded.id,
      decodedUserRoleId: decoded.user_role_id,
      headersPropertyRef: req.headers['property_ref'],
      queryDataType: req.query.dataType === undefined ? [] : req.query.dataType,
      current_env: decoded.current_env
    }

    const result = await maintenanceRequestController.getMaintenanceRequest(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

maintenanceRequest.get('/list/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      decodedId: decoded.id,
      decodedUserRoleId: decoded.user_role_id,
      headersPropertyRef: req.headers['property_ref'],
      paramsId: parseInt(req.params.id),
    }
    const result = await maintenanceRequestController.getMaintenanceRequestByOrderId(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

maintenanceRequest.get('/list/status/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      paramsId: parseInt(req.params.id),
      decodedVendorId: decoded.vendor_id,  
      requestStatusId: parseInt(req.params.id)
    }
    const result = await maintenanceRequestController.getMaintenanceRequestByStatusId(data)
    
    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }  
})

maintenanceRequest.get('/view/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      paramsId: parseInt(req.params.id),
    }
    const result = await maintenanceRequestController.getMaintenanceRequestById(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

maintenanceRequest.post('/save/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body.data
    data.decodedId = decoded.id
    data.paramsId = parseInt(req.params.id)
    data.decodedUserRoleId = decoded.user_role_id
    data.decodedVendorId = decoded.vendor_id   
    const result = await maintenanceRequestController.postMaintenanceRequest(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

maintenanceRequest.post('/update-stat/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body.data
    data.paramsId = parseInt(req.params.id)
    data.decodedVendorId = decoded.vendor_id
    data.decodedFullName = decoded.first_name+' '+decoded.last_name
    data.req = req
    const result = await maintenanceRequestController.postMaintenanceRequestStatus(data)

    res.send({ message:'success', result })
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

maintenanceRequest.post('/reject/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body.data
    data.paramsId = parseInt(req.params.id)
    data.decodedVendorId = decoded.vendor_id
    data.req = req
    const result = await maintenanceRequestController.postMaintenanceRequestReject(data)

    res.send({ message:'success', result })
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

maintenanceRequest.patch('/select-approval', async (req, res) => {
  try {
    const { id: user_id } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const result = await maintenanceRequestController.updateForApprovalById({ ...req.body })
    res.send({ message:'success', result })
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

module.exports = maintenanceRequest
