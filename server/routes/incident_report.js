const express = require('express')
const incidentReport = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')
const IncidentReport = require('../models/incident_report')
incidentReport.use(cors())
const today = new Date()

process.env.SECRET_KEY = 'secret'

incidentReport.get('/list', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  IncidentReport.findAll({
    // where: {
    //   updatedAt: null
    // },
    order: [
      ['id', 'DESC']
    ],
  })
  .then(incidentReport => {
    res.send(incidentReport)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

incidentReport.get('/view/:id', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  IncidentReport.findAll({
    where: {
      id: req.params.id
    }
  })
  .then(incidentReport => {
    res.send(incidentReport)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

incidentReport.get('/edit/:id', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  IncidentReport.findAll({
    where: {
      id: req.params.id
    }
  })
  .then(incidentReport => {
    res.send(incidentReport)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

incidentReport.post('/save/:id', (req, res) => {

  try {
    var decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  if(req.params.id == -1) {
    IncidentReport.create({
      property_id: req.body.data.property_id,
      building_id: req.body.data.building_id,
      unit_id: req.body.data.unit_id,
      incident_type_id: req.body.data.incident_type_id,
      occured_date: req.body.data.occured_date,
      occured_time: req.body.data.occured_time,
      reported_date: req.body.data.reported_date,
      reported_time: req.body.data.reported_time,
      location: req.body.data.location,
      witness1_name: req.body.data.witness1_name,
      witness1_address: req.body.data.witness1_address,
      witness1_telephone: req.body.data.witness1_telephone,
      witness2_name: req.body.data.witness2_name,
      witness2_address: req.body.data.witness2_address,
      witness2_telephone: req.body.data.witness2_telephone,
      description: req.body.data.description,      
      action_taken: req.body.data.action_taken,
      additional_comments: req.body.data.additional_comments,
      police_called: req.body.data.police_called,
      police_called_time: req.body.data.police_called_time,
      police_arrived_time: req.body.data.police_arrived_time,
      police_departed_time: req.body.data.police_departed_time,
      fire_called: req.body.data.fire_called,
      fire_called_time: req.body.data.fire_called_time,
      fire_arrived_time: req.body.data.fire_arrived_time,
      fire_departed_time: req.body.data.fire_departed_time,
      ambulance_called: req.body.data.ambulance_called,
      ambulance_called_time: req.body.data.ambulance_called_time,
      ambulance_arrived_time: req.body.data.ambulance_arrived_time,
      ambulance_departed_time: req.body.data.ambulance_departed_time,
      unit_resident1_id: req.body.data.unit_resident1_id,
      unit_resident2_id: req.body.data.unit_resident2_id,      
      createdAt: today
    })
    .then(result => {
      res.json('success')
    })
    .catch(error => {
      res.send('error: ' + error)
    })
  } else {

    IncidentReport.findAll({
      where: {
        id: req.params.id
      }
    })
    .then(incidentReport => {
      
      if (incidentReport) {      
        IncidentReport.update({
          property_id: req.body.data.property_id,
          building_id: req.body.data.building_id,
          unit_id: req.body.data.unit_id,
          incident_type_id: req.body.data.incident_type_id,
          occured_date: req.body.data.occured_date,
          occured_time: req.body.data.occured_time,
          reported_date: req.body.data.reported_date,
          reported_time: req.body.data.reported_time,
          location: req.body.data.location,
          witness1_name: req.body.data.witness1_name,
          witness1_address: req.body.data.witness1_address,
          witness1_telephone: req.body.data.witness1_telephone,
          witness2_name: req.body.data.witness2_name,
          witness2_address: req.body.data.witness2_address,
          witness2_telephone: req.body.data.witness2_telephone,
          description: req.body.data.description,      
          action_taken: req.body.data.action_taken,
          additional_comments: req.body.data.additional_comments,
          police_called: req.body.data.police_called,
          police_called_time: req.body.data.police_called_time,
          police_arrived_time: req.body.data.police_arrived_time,
          police_departed_time: req.body.data.police_departed_time,
          fire_called: req.body.data.fire_called,
          fire_called_time: req.body.data.fire_called_time,
          fire_arrived_time: req.body.data.fire_arrived_time,
          fire_departed_time: req.body.data.fire_departed_time,
          ambulance_called: req.body.data.ambulance_called,
          ambulance_called_time: req.body.data.ambulance_called_time,
          ambulance_arrived_time: req.body.data.ambulance_arrived_time,
          ambulance_departed_time: req.body.data.ambulance_departed_time,
          unit_resident1_id: req.body.data.unit_resident1_id,
          unit_resident2_id: req.body.data.unit_resident2_id,
          updatedAt: today
        }, {
          where: {
            id: req.params.id
          }
        })
        .then(result => {
          res.json('success')
        })
        .catch(error => {
          res.send('error: ' + error)
        })
      } else {
        res.json('not_exist')
      }

    })
    .catch(err => {
      res.status(400).json({ error: err })
    })

  }
})

incidentReport.post('/delete/:id', (req, res) => {

  try {
    var decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  IncidentReport.findAll({
    where: {
      id: req.params.id
    }
  })
  .then(incidentReport => {

    if (incidentReport) {      
      IncidentReport.update({
        updatedAt: today
      }, {
        where: {
          id: req.params.id
        }
      })
      .then(result => {
        res.json('success')
      })
      .catch(error => {
        res.send('error: ' + error)
      })
    } else {
      res.json('not_exist')
    }

  })
  .catch(err => {
    res.status(400).json({ errors: err })
  })

})

module.exports = incidentReport
