const express = require('express')
const property = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const propertyController = require('../controllers/property.controller')
property.use(cors())

property.get('/pmc/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      decodedId: decoded.id,
      headersPmcId: req.headers['pmc_id']
    }
    const result = await propertyController.getPropertyByPmcId(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

property.get('/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      decodedId: decoded.id,
      decodedPmcId: decoded.pmc_id,
      decodedUserRoleId: decoded.user_role_id,
      queryPmcId: req.query.pmc_id === undefined ? decoded.pmc_id : parseInt(req.query.pmc_id),

      'property_ref': req.query.property_ref,
      'parent_org_id': parseInt(req.query.parent_org_id),
      'role_id': parseInt(req.query.role_id),
      'role_val': req.query.role_val
    }
    const result = await propertyController.getProperty(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

property.get('/view/:type/:val', async (req, res) => {
  try {
    //const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    let propertiesF = null
    const data = {
      paramsId: parseInt(req.params.id),
      paramsVal: req.params.val,
      paramsType: req.params.type,

      'property_ref': req.query.property_ref,
      'parent_org_id': parseInt(req.query.parent_org_id),
      'role_id': parseInt(req.query.role_id),
      'role_val': req.query.role_val
    }
    const result = await propertyController.getPropertyByType(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

property.get('/view/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      paramsId: parseInt(req.params.id)
    }
    const result = await propertyController.getPropertyByParamsId(data.paramsId)

    res.send(result)    
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

property.post('/save/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body.data
    data.paramsId = parseInt(req.params.id)
    data.decodedId = decoded.id
    data.current_env = decoded.current_env
    const result = await propertyController.postProperty(data)

    res.send(result)  
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

property.post('/delete/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = {
      id: req.params.id,
      decodedId: decoded.id,
      parent_org_id: parseInt(decoded.current_env.parent_org_id)
    }

    const result = await propertyController.deletePropertyById(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

property.get('/all/:pmc_id', async (req, res) => {
  try {
    const { id: user_id } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const { pmc_id } = req.params;
    const result = await propertyController.findPropertyByPMC({ pmc_id })

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
});

module.exports = property
