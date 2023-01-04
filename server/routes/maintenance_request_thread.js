const express = require('express')
const thread = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const threadController = require('../controllers/maintenance_request_thread.controller')
thread.use(cors())

thread.get('/list/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const { id } = req.params
    const result = await threadController.getThreadByRequestId(id)

    res.send(result)
  } catch(err) {
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

thread.get('/view/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const { id } = req.params
    const result = await threadController.getThreadById(id)

    res.send(result)
  } catch(err) {
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

thread.post('/save/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body.data  
    data.current_env = decoded.current_env
    data.decoded = decoded

    const result = await threadController.postThread(data)

    res.send(result)
  } catch(err) {
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

thread.post('/delete/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const { id } = req.params
    const result = await threadController.deleteThreadById(id)    

    res.send('success')
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

module.exports = thread
