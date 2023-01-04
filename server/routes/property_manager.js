const express = require('express')
const property_manager = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const propertyManagerController = require('../controllers/property_manager.controller')
property_manager.use(cors())

property_manager.get('/list/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      paramsId: req.params.id,
      headersPmcId: req.headers['pmc_id']
    }
    const result = await propertyManagerController.getPropertyManagerByPropertyIdPmcId(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

property_manager.get('/user/list/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      paramsId: req.params.id,
      headersPmcId: req.headers['pmc_id']
    }
    const result = await propertyManagerController.getPropertyManagerByUserIdPmcId(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

property_manager.get('/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      headersPmcId: req.headers['pmc_id']
    }
    const result = await propertyManagerController.getPropertyManagerByPmcId(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

property_manager.get('/view/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await propertyManagerController.getPropertyManagerById(req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

property_manager.post('/save/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body.data
    data.paramsId = req.params.id
    const result = await propertyManagerController.postPropertyManager(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

property_manager.post('/delete/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const result = await propertyManagerController.deletePropertyManagerById(req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

module.exports = property_manager
