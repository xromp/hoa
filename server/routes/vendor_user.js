const express = require('express')
const route = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const vendorUserController = require('../controllers/vendor_user.controller')
route.use(cors())

route.get('/list/:id', async (req, res) => {
  // try {
  //   const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  //   res.send(result)
  // } catch(err){
  //   res.status(400).json({ errors: err.toString('utf8') })
  // }
})

route.get('/view/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await vendorUserController.getVendorUserById(req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

route.post('/save/:id', async (req, res) => {
  // try {
  //   const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  //   res.send(result)
  // } catch(err){
  //   res.status(400).json({ errors: err.toString('utf8') })
  // } 
})

route.post('/delete/:id', async (req, res) => {
  // try {
  //   const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  //   res.send(result)
  // } catch(err){
  //   res.status(400).json({ errors: err.toString('utf8') })
  // }
})

module.exports = route
