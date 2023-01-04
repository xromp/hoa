const express = require('express')
const amenityReservation = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const amenityReservationController = require('../controllers/amenity_reservation.controller')
amenityReservation.use(cors())

amenityReservation.get('/list/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const { id } = req.params
    const result = await amenityReservationController.getAmenityReservationById(id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

amenityReservation.get('/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      decodedId: parseInt(decoded.id),
      decodedUserRoleId: parseInt(decoded.current_env.role_id),
      role_val: decoded.current_env.role_val,
      property_ref: decoded.current_env.property_ref
    }
    const result = await amenityReservationController.getAmenityReservation(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

amenityReservation.get('/view/:id', async(req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const { id } = req.params
    const { property_ref } = req.headers
    const result = await amenityReservationController.getAmenityReservationByPropertyRef(id, property_ref)
    
    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

amenityReservation.post('/save/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body.data
    data.decodedId = decoded.id
    data.decodedUserRoleId = decoded.current_env.role_id
    data.decodedUserRoleVal = decoded.current_env.role_val
    data.paramsId = parseInt(req.params.id)
    data.headersPropertyRef = decoded.current_env.property_ref
    data.decodedPropertyRef = decoded.current_env.property_ref
    data.parentOrgId = parseInt(decoded.current_env.parent_org_id)
    // data.req = req
    const result = await amenityReservationController.postAmenityReservation(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }    
})

amenityReservation.post('/delete/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body.data
    data.paramsId = req.params.id
    const result = await amenityReservationController.deleteAmenityReservationById(data)    

    res.send('success')
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

module.exports = amenityReservation
