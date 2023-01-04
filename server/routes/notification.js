const express = require('express')
const notification = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const notificationController = require('../controllers/notification.controller')

notification.use(cors())

notification.get('/list/user', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const { id } = decoded
    const result = await notificationController.getNotificationMessageByUserId(id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

notification.get('/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const property_ref = req.headers['property_ref']
    const result = await notificationController.getNotificationMessageAll(decoded, property_ref)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

notification.get('/received', async (req, res) => {
  const { id: user_id, current_env } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
  const { parent_org_id, property_ref } = current_env;
  try {
    const result = await notificationController.getReceivedNotifications({ user_id, property_ref, parent_org_id });
    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

notification.get('/received/:id', async (req, res) => {
  // TODO: auth strategy:  const { id: userId } = req.currentUser
  const { id: userId } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  const { id } = req.params;
  const { property_ref } = req.query;  
  try {
    const result = await notificationController.getReceivedNotificationById({ userId, id, property_ref })
    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

notification.delete('/received/:id', async (req, res) => {
  // TODO: auth strategy:  const { id: userId } = req.currentUser
  const { id: userId } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  const { id } = req.params;
  try {
    const result = await notificationController.removeReceivedNotification({ userId, id })
    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

notification.get('/view/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const { id } = req.params
    const result = await notificationController.getNotificationMessageById(id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

notification.post('/save/:id', async (req, res) => {
  try {
    const { id:user_id, current_env } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const { property_ref } = current_env;
    const data = { 
      ...req.body.data,
      paramsId: parseInt(req.params.id),
      decodedId: user_id,
      req,
      property_ref,
      is_automated: false,
    };
    const result = await notificationController.postNotification(data);
    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }  
})

notification.post('/delete/:id', async (req, res) => {
  try {
    const { id: userId } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const { id } = req.params;

    const result = await notificationController.removeSentNotification({ userId, id })
    res.send(result)
  }
  catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

notification.get('/receive-messages', async (req, res) => {
  const { id: user_id } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
  const result = await notificationController.getReceivedMessages({ user_id })
  res.send(result);
});

notification.post('/seen-current-notif',  async (req, res) => {
  const { id: user_id } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
  const result = await notificationController.updateSeenNotif({ user_id })
  res.send(result);
})

module.exports = notification
