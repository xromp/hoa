const express = require('express')
const userOrgRole = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const userOrgRoleController = require('../controllers/user_org_role.controller')
userOrgRole.use(cors())

userOrgRole.get('/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      'property_ref': req.query.property_ref,
      'parent_org_id': parseInt(req.query.parent_org_id)
    }
    const result = await userOrgRoleController.getUserOrgRole(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

userOrgRole.get('/list/:user_id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const { user_id } = req.params;
    const result = await userOrgRoleController.getUserOrgRoleByUserId({ user_id })

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

userOrgRole.post('/add', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = req.body.data
    data.paramsId = data.pmc_id
    data.decodedId = decoded.id
    data.is_clone = false;
    const result = await userOrgRoleController.postUserOrgRole(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

userOrgRole.get('/set', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      'decodedId': decoded.id,
      'limit': parseInt(req.query.limit)
    }
    const result = await userOrgRoleController.setUserOrgRoleByUserId(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

userOrgRole.get('/get', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      'property_ref': req.query.property_ref,
      'parent_org_id': parseInt(req.query.parent_org_id),
      'role_id': parseInt(req.query.role_id),
      'role_val': req.query.role_val,
      'decodedId': decoded.id
    } 
    const result = await userOrgRoleController.getUserOrgRoleByQuery(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

userOrgRole.get('/portfolio/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      'property_ref': req.query.property_ref,
      'parent_org_id': parseInt(req.query.parent_org_id),
      'role_id': parseInt(req.query.role_id),
      'role_val': req.query.role_val,
      'type': req.query.type,
      'decodedId': decoded.id
    }
    const result = await userOrgRoleController.getPortfolioByQuery(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

userOrgRole.get('/portfolio/view/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      'property_ref': req.query.property_ref,
      'parent_org_id': parseInt(req.query.parent_org_id),
      'role_id': parseInt(req.query.role_id),
      'role_val': req.query.role_val,
      'decodedId': decoded.id,
      'paramsId': req.params.id
    }
    const result = await userOrgRoleController.getPortfolioById(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

userOrgRole.get('/role/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      'property_ref': req.query.property_ref,
      'parent_org_id': parseInt(req.query.parent_org_id),
      'decodedId': decoded.id
    }    
    const result = await userOrgRoleController.getRoleByQuery(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

userOrgRole.get('/permission/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      'property_ref': req.query.property_ref,
      'parent_org_id': parseInt(req.query.parent_org_id),
      'role_id': parseInt(req.query.role_id),
      'role_val': req.query.role_val,
      'decodedId': decoded.id,
    }    
    const result = await userOrgRoleController.getPermissionByQuery(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})


userOrgRole.get('/property/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      'parent_org_id': parseInt(req.query.parent_org_id),
      'property_ref': req.query.property_ref,
      'role_id': parseInt(req.query.role_id),
      'role_val': req.query.role_val,
      'decodedId': decoded.id,
      'type': req.query.type
    }
    const result = await userOrgRoleController.getPropertyByParentOrgId(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

userOrgRole.post('/delete/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    data = {
      'decodedId': decoded.id,
      'paramsId': req.params.id
    }
    const result = await userOrgRoleController.deleteUserOrgRoleById(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

userOrgRole.post('/property/delete/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await userOrgRoleController.deleteUserOrgRoleByPropertyId(decoded.current_env, req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

module.exports = userOrgRole
