const express = require('express')
const notificationSent = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const notificationSentController = require('../controllers/notification_sent.controller')

notificationSent.use(cors())

notificationSent.get('/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const property_ref = req.query.property_ref
    const result = await notificationSentController.getNotificationSentAll(property_ref)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

notificationSent.get('/list/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const id = req.params.id
    const result = await notificationSentController.getNotificationMessageById(id)

    res.send(result[0]['notifications'])
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

notificationSent.get('/view/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await notificationSentController.getNotificationSentById(id)

    res.send(result)    
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

notificationSent.post('/delete/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)

    // const result = await Notification.update({
    //   updatedAt: today
    // }, {
    //   where: {
    //     id: req.params.id
    //   }
    // })

    res.json('success')
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

module.exports = notificationSent
