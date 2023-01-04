const express = require('express')
const userRole = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const userRoleController = require('../controllers/user_role.controller')
userRole.use(cors())

userRole.get('/parent/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      'property_ref': req.query.property_ref,
      'parent_org_id': parseInt(req.query.parent_org_id),
      'role_id': parseInt(req.query.role_id),
      'role_val': req.query.role_val,
      'decodedId': decoded.id
    }
    const result = await userRoleController.getParentUserRole(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

userRole.get('/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      'property_ref': req.query.property_ref,
      'parent_org_id': parseInt(req.query.parent_org_id),
      'role_id': parseInt(req.query.role_id),
      'role_val': req.query.role_val,
      'decodedId': decoded.id
    }
    const result = await userRoleController.getSubUserRole(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

userRole.get('/list/all', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      'property_ref': req.query.property_ref,
      'property_id': parseInt(req.query.property_id),
      'parent_org_id': parseInt(req.query.parent_org_id),
      'role_id': parseInt(req.query.role_id),
      'role_val': req.query.role_val,
      'decodedId': decoded.id
    }
    const result = await userRoleController.getUserRoleByParentOrg(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

userRole.get('/list/sub/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      'property_ref': req.query.property_ref,
      'parent_org_id': parseInt(req.query.parent_org_id)
    }
    data.parent_id = parseInt(req.params.id)
    const result = await userRoleController.getSubUserRoleByParentId(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

userRole.get('/view/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      paramsId: req.params.id,
      property_ref: req.query.property_ref,
      parent_org_id: parseInt(req.query.parent_org_id),
      role_id: parseInt(req.query.role_id),
      role_val: req.query.role_val
    }    
    const result = await userRoleController.getUserRoleById(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

userRole.get('/view/sub/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await userRoleController.getUserRoleById(req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

userRole.post('/save/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body.data
    data.paramsId = parseInt(req.params.id)
    const result = await userRoleController.postUserRole(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

userRole.post('/permission/save', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      'property_ref': req.body.data.property_ref,
      'property_id': parseInt(req.body.data.property_id),
      'parent_org_id': parseInt(req.body.data.parent_org_id),
      'role_id': parseInt(req.body.data.role_id),
      'role_val': req.body.data.role_val,
      'decodedId': decoded.id
    }
    const result = await userRoleController.postUserRolePermission(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

userRole.post('/delete/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const result = await userRoleController.deleteUserRoleById(req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

module.exports = userRole
