const express = require('express')
const route = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const userDesignationController = require('../controllers/user_designation.controller')
route.use(cors())

route.get('/list/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      paramsId: req.params.id,
      parentOrgId: decoded.current_env.parent_org_id
    }
    const result = await userDesignationController.getUserDesignationByUserParentId(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

route.get('/view/:id', async (req, res) => {
  // try {
  //   const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  //   const result = await userDesignationController.getUserDesignationById(req.params.id)

  //   res.send(result)
  // } catch(err){
  //   res.status(400).json({ errors: err.toString('utf8') })
  // }
})

route.post('/save/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = req.body.data
    data.paramsId = req.params.id
    const result = await userDesignationController.postUserDesignation(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  } 
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
