const express = require('express')
const unitUser = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const unitUserController = require('../controllers/unit_user.controller')
unitUser.use(cors())

unitUser.get('/list/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    data = {
      paramsId: req.params.id,
      parent_org_id: parseInt(decoded.current_env.parent_org_id),
      property_ref: decoded.current_env.property_ref
    }
    const result = await unitUserController.getUnitUserById(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

unitUser.get('/view/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await unitUserController.getUnitUserById(req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

unitUser.post('/save/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = req.body.data
    data.paramsId = parseInt(req.params.id)
    const result = await unitUserController.postUnitUser(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  } 
})

unitUser.post('/delete/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await unitUserController.deleteUnitUserById(req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

module.exports = unitUser
