const express = require('express')
const unitResident = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const unitResidentController = require('../controllers/unit_resident.controller')
unitResident.use(cors())

unitResident.get('/list/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await unitResidentController.getUnitResidentById(req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

unitResident.get('/view/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await unitResidentController.getUnitResidentById(req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

unitResident.post('/save/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = req.body.data
    data.paramsId = parseInt(req.params.id)
    const result = await unitResidentController.postUnitResident(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  } 
})

unitResident.post('/delete/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await unitResidentController.deleteUnitResidentById(req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

module.exports = unitResident
