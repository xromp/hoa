const express = require('express')
const amenityReservationDetail = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const amenityReservationDetailController = require('../controllers/amenity_reservation_detail.controller')

amenityReservationDetail.use(cors())

amenityReservationDetail.get('/amenity/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      amenity_id: req.query.amenity_id,
      from_dates: req.query.from_dates,
      property_ref: decoded.current_env.property_ref,
    }

    const result = await amenityReservationDetailController.getAmenityReservationDetails(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

amenityReservationDetail.get('/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = req.body.data
    data.decodedId = decoded.id
    data.decodedUserRoleId = decoded.user_role_id
    data.headersPropertyRef = req.headers['property_ref']

    const result = await amenityReservationDetailController.getAmenityReservationDetail(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

amenityReservationDetail.post('/dup', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = req.body.data
    data.decodedId = decoded.id
    data.property_ref = decoded.current_env.property_ref
    data.parent_org_id = parseInt(decoded.current_env.parent_org_id)
    data.role_val = decoded.current_env.role_val

    const result = await amenityReservationDetailController.getAmenityReservationDetailDuplicate(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

amenityReservationDetail.post('/validate-time', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = req.body.data
    data.property_ref = decoded.current_env.property_ref

    const result = await amenityReservationDetailController.getMinMaxTime(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

amenityReservationDetail.post('/booking-limit', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = req.body.data
    data.decodedId = decoded.id
    data.property_ref = decoded.current_env.property_ref
    data.role_val = decoded.current_env.role_val
    
    const result = await amenityReservationDetailController.getBookingLimit(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

amenityReservationDetail.post('/max-user-allowed', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = req.body.data
    data.decodedId = decoded.id
    data.property_ref = decoded.current_env.property_ref
    data.role_val = decoded.current_env.role_val
    
    const result = await amenityReservationDetailController.getMaxUserAllowed(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

amenityReservationDetail.get('/view/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const { id } = req.params
    const result = await amenityReservationDetailController.getAmenityReservationDetailById(id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }  
})

amenityReservationDetail.post('/save/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    let result = []
    const data = req.body.data
    data.decodedPropertyId = decoded.property_id
    data.decodedUserRoleId = decoded.user_role_id
    data.current_env = decoded.current_env

    if(req.params.id == -1) {
      result = await amenityReservationDetailController.postAmenityReservationDetail(data)
    } 

    res.json({message:'success', result})
  } catch(err) {
    res.status(400).json({ errors: err.toString('utf8') })
  }    
})

amenityReservationDetail.post('/delete/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const { id } = req.params
    const result = await amenityReservationDetailController.deleteAmenityReservationDetailById(id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

module.exports = amenityReservationDetail
