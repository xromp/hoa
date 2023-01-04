const express = require('express')
const notification_template = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const notificationTemplateController = require('../controllers/notification_template.controller')

notification_template.use(cors())

notification_template.get('/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const { property_ref } = req.headers
    const result = await notificationTemplateController.getNotificationTemplateByPropertyRef(property_ref)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

notification_template.get('/view/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const { id } = req.params
    const { property_ref } = req.query
    const result = await notificationTemplateController.getNotificationTemplateById(id, property_ref)

    res.send(result)
  }
  catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

notification_template.post('/save/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = { title, message, property_ref, createdAt, updatedAt } = req.body.data
    data.paramsId = parseInt(req.params.id)

    const result = await notificationTemplateController.postNotificationTemplate(data)

    res.json({message:'success', result})
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }  
})

notification_template.post('/delete/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    // const result = await NotificationTemplate.update({
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

module.exports = notification_template
