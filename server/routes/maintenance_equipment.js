const express = require('express')
const equipment = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')
const Equipment = require('../models/maintenance_equipment')
const User = require('../models/user')
const Vendor = require('../models/vendor')

equipment.use(cors())
const today = new Date()

Equipment.belongsTo(User, {targetKey:'id',foreignKey: 'serviced_by'})
Equipment.belongsTo(Vendor, {targetKey:'id',foreignKey: 'serviced_by'})

process.env.SECRET_KEY = 'secret'

equipment.get('/list', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  Equipment.findAll({
    include: [
      { model: User },
      { model: Vendor }
    ],    
    // where: {
    //   updatedAt: null
    // },
    order: [
      ['id', 'DESC']
    ],
  })
  .then(equipment => {
    res.send(equipment)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

equipment.get('/view/:id', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  Equipment.findAll({
    include: [
      { model: User },
      { model: Vendor }
    ],
    where: {
      id: req.params.id
    }
  })
  .then(equipment => {
    res.send(equipment)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

equipment.get('/edit/:id', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  Equipment.findAll({
    include: [
      { model: User },
      { model: Vendor }
    ],
    where: {
      id: req.params.id
    }
  })
  .then(equipment => {
    res.send(equipment)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

equipment.post('/save/:id', (req, res) => {

  try {
    var decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  if(req.params.id == -1) {
    Equipment.create({
      device_name: req.body.data.device_name,
      service_reminders: req.body.data.service_reminders,
      category: req.body.data.category,
      category_id: req.body.data.category_id,
      frequency_id: req.body.data.frequency_id,      
      components: JSON.stringify(req.body.data.components),
      files: req.body.data.files,
      serviced_by: req.body.data.serviced_by,
      model_no: req.body.data.model_no,
      part_no: req.body.data.part_no,
      unit_price: req.body.data.unit_price,
      location_name: req.body.data.location_name,
      location_description: req.body.data.location_description,
      longtitude: req.body.data.longtitude,
      latitude: req.body.data.latitude,
      input_location: req.body.data.input_location,
      warranty_start: req.body.data.warranty_start,
      warranty_end: req.body.data.warranty_end,
      standard_warranty: req.body.data.standard_warranty,
      extended_warranty: req.body.data.extended_warranty,
      expiration_reminder: req.body.data.expiration_reminder,
      location_name: req.body.data.location_name,
      reminder_type: req.body.data.reminder_type,
      notes: req.body.data.notes,
      createdAt: today
    })
    .then(result => {
      res.json({message:'success', result})
    })
    .catch(error => {
      res.send('error: ' + error)
    })
  } else {

    Equipment.findAll({
      where: {
        id: req.params.id
      }
    })
    .then(equipment => {
      
      if (equipment) {      
        Equipment.update({
          device_name: req.body.data.device_name,
          service_reminders: req.body.data.service_reminders,
          category: req.body.data.category,
          category_id: req.body.data.category_id,
          frequency_id: req.body.data.frequency_id,
          components: JSON.stringify(req.body.data.components),
          files: req.body.data.files,
          serviced_by: req.body.data.serviced_by,
          model_no: req.body.data.model_no,
          part_no: req.body.data.part_no,
          unit_price: req.body.data.unit_price,
          location_name: req.body.data.location_name,
          location_description: req.body.data.location_description,
          longtitude: req.body.data.longtitude,
          latitude: req.body.data.latitude,
          input_location: req.body.data.input_location,
          warranty_start: req.body.data.warranty_start,
          warranty_end: req.body.data.warranty_end,
          standard_warranty: req.body.data.standard_warranty,
          extended_warranty: req.body.data.extended_warranty,
          expiration_reminder: req.body.data.expiration_reminder,
          location_name: req.body.data.location_name,
          reminder_type: req.body.data.reminder_type,
          notes: req.body.data.notes,
          updatedAt: today
        }, {
          where: {
            id: req.params.id
          }
        })
        .then(result => {
          res.json({message:'success', result})
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

equipment.post('/delete/:id', (req, res) => {

  try {
    var decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  Equipment.findAll({
    where: {
      id: req.params.id
    }
  })
  .then(equipment => {

    if (equipment) {      
      Equipment.update({
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

module.exports = equipment
