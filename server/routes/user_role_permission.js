const express = require('express')
const permission = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const userRolePermissionController = require('../controllers/user_role_permission.controller')
permission.use(cors())

permission.get('/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await userRolePermissionController.getUserRolePermission()

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

permission.get('/view/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await userRolePermissionController.getUserRolePermissionByUserRoleId(req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

permission.post('/save/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body.data
    const d = {
      paramsId: parseInt(req.params.id),
      userRoleId: parseInt(req.body.user_role_id)
    }
    const result = await userRolePermissionController.postUserRolePermission(data, d)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

permission.post('/delete/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const result = await userRolePermissionController.deleteUserRolePermissionById(req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

module.exports = permission
