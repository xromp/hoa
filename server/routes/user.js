const express = require('express')
const user = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const userController = require('../controllers/user.controller')
user.use(cors())

user.post('/activate/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const result = await userController.activateUser(req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

user.get('/check-duplicate/:email', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await userController.findUserByEmail(req.params.email)

    res.send(result)
  } catch (err) {
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

user.post('/auth', async (req, res) => {
  try {
    const { push_token } = req.body.userDetails
    const result = await userController.getAuth(push_token)

    res.send(result)
  } catch (err) {
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

user.post('/logout', async (req, res) => {
  try {
    const { push_token } = req.body.userDetails
    const result = await userController.deleteUserDevice(push_token)

    res.send(result)
  } catch (err) {
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

user.post('/login', async (req, res) => {
  try {
    const data = req.body.userDetails
    const result = await userController.getUserByEmailPass(data)

    res.send(result)
  } catch (err) {
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

user.post('/refresh-token', async (req, res) => {
  try {
    const currentUser = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const token = await userController.refreshToken({ ...currentUser, ...req.body });
    res.send({ token });
  } catch (err) {
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

user.post('/recover', async (req, res) => {
  try {
    const {email} = req.body
    const result = await userController.postRecoverPass(email)

    res.send(result)
  } catch (err) {
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

user.post('/recover-password', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY, (err, decoded) => {
      if (err){
        // throw new Error('This password reset link has expired. Try resetting your password again.')
        res.send({ error: 'This password reset link has expired. Try resetting your password again.' })
        return false
      }
      return decoded
    })

    if (!decoded) return
    const data = req.body
    data.paramsId = decoded.id
    data.email = decoded.email
    const result = await userController.postResetPassword(data)

    res.send(result)
  } catch (err) {
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

user.post('/confirm-email-request', async (req, res) => {
  try {
    const {email} = req.body
    const result = await userController.confirmEmailRequest(email)

    res.send(result)
  } catch (err) {
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

user.post('/confirm-email', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY, (err, decoded) => {
      if (err){
        throw new Error('expired')
      }
      return decoded
    })

    if (!decoded) return
    const data = req.body
    data.paramsId = decoded.id
    data.email = decoded.email
    const result = await userController.confirmEmail(data)

    res.send(result)
  } catch (err) {
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

user.get('/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      'property_ref': req.query.property_ref,
      'parent_org_id': parseInt(req.query.parent_org_id),
      'role_id': parseInt(req.query.role_id),
      'role_val': req.query.role_val,
      'decodedId': decoded.id,
      'is_deleted': JSON.parse(req.query.is_deleted || null),
    }
    const result = await userController.getUsers(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

user.get('/staff/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      'property_ref': req.query.property_ref,
      'parent_org_id': parseInt(req.query.parent_org_id),
      'role_id': parseInt(req.query.role_id),
      'role_val': req.query.role_val,
      'decodedId': decoded.id,
      'is_deleted': JSON.parse(req.query.is_deleted || null),
    }
    const result = await userController.getUsersStaff(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

user.get('/all', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      'property_ref': req.query.property_ref,
      'parent_org_id': parseInt(req.query.parent_org_id),
      'role_id': parseInt(req.query.role_id),
      'role_val': req.query.role_val,
      'decodedId': decoded.id
    } 
    const result = await userController.getUserAll(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

user.get('/unit/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      headersUnitId: req.headers['unit_id'],
      headersPropertyRef: req.headers['property_ref']
    }
    const result = await userController.getUserByPropertyUnit(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

user.get('/unit/all', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await userController.getUserByPropertyRef(req.headers['property_ref'])

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

user.get('/pmc/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    data = {
      decodedPmcId: decoded.pmc_id,
      userAccessLevel: [99, 98]
    }
    const result = await userController.getUserByRole(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

user.get('/property-manager/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      headersPropertyRef: req.headers['property_ref'],
      decodedPmcId: decoded.pmc_id
    }
    const result = await userController.getPropertyManager(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

user.get('/view/:id',cors(), async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      paramsId: req.params.id,
      property_ref: req.query.property_ref,
      parent_org_id: parseInt(req.query.parent_org_id),
      role_id: parseInt(req.query.role_id),
      role_val: req.query.role_val
    }
    const result = await userController.getUserById(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

user.post('/save/:id', async (req, res) => {
  try {
    const data = req.body.data
    data.paramsId = req.params.id
    const result = await userController.postUser(data)

    res.send(result)
  } catch (err) {
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

user.post('/update-password/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body.data
    data.paramsId = req.params.id
    const result = await userController.postUserPassword(data)

    res.send(result)
  } catch (err) {
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

user.post('/import', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = req.body.data
    const params = {
      decodedId: decoded.id,
      property_ref: decoded.current_env.property_ref,
      parent_org_id: decoded.current_env.parent_org_id
    }
    const result = await userController.importUser(data, params)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

user.post('/delete/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const result = await userController.deleteUser(req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

user.get('/:id',cors(), async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await userController.getUser(req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})


module.exports = user
