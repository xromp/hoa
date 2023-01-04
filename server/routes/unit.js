const express = require('express')
const unit = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const unitController = require('../controllers/unit.controller')
unit.use(cors())

unit.get('/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      'property_ref': req.query.property_ref,
      'parent_org_id': parseInt(req.query.parent_org_id),
      'role_val': decoded.current_env.role_val,
      'decodedId': decoded.id
    }
    const result = await unitController.getUnits(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

unit.get('/list/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      decodedId: decoded.id,
      headersPropertyRef: req.headers['property_ref'],
    }
    const result = await unitController.getUnitByUserId(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

unit.get('/user/list/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      'property_ref': req.query.property_ref,
      'parent_org_id': parseInt(req.query.parent_org_id)
    }
    data.paramsId = parseInt(req.params.id)
    const result = await unitController.getUnitUser(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})


unit.get('/property/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await unitController.getUnit()

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

unit.get('/view/:type/:val', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      paramsType: req.params.type,
      paramsVal: req.params.val
    }
    const result = await unitController.getUnitByPropertyId(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

unit.get('/view/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      paramsId: req.params.id,
      property_ref: req.query.property_ref,
      parent_org_id: parseInt(req.query.parent_org_id),
      role_id: parseInt(req.query.role_id),
      role_val: req.query.role_val
    }
    const result = await unitController.getUnitById(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

unit.post('/save/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = req.body.data
    data.paramsId = req.params.id
    const result = await unitController.postUnit(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

unit.post('/user/save/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = req.body
    const result = await unitController.postUnitUser(data)

    res.send(result)
  } catch(err) {
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

unit.post('/delete/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await unitController.deleteUnitById(req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

module.exports = unit
