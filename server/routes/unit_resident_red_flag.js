const express = require('express')
const redFlags = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')
const UnitResidentRedFlag = require('../models/unit_resident_red_flag')
redFlags.use(cors())
const today = new Date()

process.env.SECRET_KEY = 'secret'

redFlags.get('/list', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  UnitResidentRedFlag.findAll({
    // where: {
    //   updatedAt: null
    // },
    order: [
      ['id', 'DESC']
    ],
  })
  .then(redFlags => {
    res.send(redFlags)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

redFlags.get('/view/:id', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  UnitResidentRedFlag.findAll({
    where: {
      id: req.params.id
    }
  })
  .then(redFlags => {
    res.send(redFlags)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

redFlags.get('/edit/:id', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  UnitResidentRedFlag.findAll({
    where: {
      id: req.params.id
    }
  })
  .then(redFlags => {
    res.send(redFlags)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })

})

redFlags.post('/save/:id', (req, res) => {

  try {
    var decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  if(req.params.id == -1) {
    UnitResidentRedFlag.create({
      unit_resident_id: req.body.data.unit_resident_id,
      note: req.body.data.note,
      from_date: req.body.data.from_date,
      to_date: req.body.data.to_date,
      unit_id: req.body.data.unit_id,
      updatedAt: today,
      createdAt: today
    })
    .then(result => {
      res.json('success')
    })
    .catch(error => {
      res.send('error: ' + error)
    })
  } else {

    UnitResidentRedFlag.findAll({
      where: {
        id: req.params.id
      }
    })
    .then(redFlags => {
      
      if (redFlags) {      
        UnitResidentRedFlag.update({
          unit_resident_id: req.body.data.unit_resident_id,
          note: req.body.data.note,
          from_date: req.body.data.from_date,
          to_date: req.body.data.to_date,
          unit_id: req.body.data.unit_id,
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

redFlags.post('/delete/:id', (req, res) => {

  try {
    var decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
  } catch(err){
    res.json('access_denied')
    return('token_err')
  }

  UnitResidentRedFlag.findAll({
    where: {
      id: req.params.id
    }
  })
  .then(redFlags => {

    if (redFlags) {      
      UnitResidentRedFlag.update({
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

module.exports = redFlags
