const express = require('express')
const amenity = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const amenityController = require('../controllers/amenity.controller')
amenity.use(cors())

amenity.get('/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const { property_ref } = req.headers
    const result = await amenityController.getAmenityByPropertyRef(property_ref)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

amenity.get('/view/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const { id } = req.params
    const { property_ref } = req.headers
    const result = await amenityController.getAmenityById(id, property_ref)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

amenity.post('/save/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body.data
    data.paramsId = parseInt(req.params.id)
    data.decodedId = decoded.id
    const result = await amenityController.postAmenity(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }  
})

amenity.post('/delete/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)   
    const result = await amenityController.deleteAmenityById(req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

module.exports = amenity
