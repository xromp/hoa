const express = require('express')
const vendor = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const vendorController = require('../controllers/vendor.controller')
const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid')
const s3 = new AWS.S3({
  apiVersion: "2020-11-16",
  acesskeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  region: "us-east-2"
})

vendor.use(cors())

vendor.get('/read',async (req, res) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: "docs/new/02fc6294-e365-48da-abad-eab29c24656c.png"
  }

  s3.getObject(params, (err, data) => {
    if (err) {
      console.log(err.toString('utf8'));
    }
    res.send(data)
  })
})

vendor.post('/upload',async (req, res) => {
  let myFile = req.files.file_0.name.split(".")
  const fileType = myFile[myFile.length - 1]

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${uuidv4()}.${fileType}`,
    Body: req.files.file_0.data
  }

  s3.upload(params, (err, data) => {
    if (err) {
      console.log(err.toString('utf8'));
    }
    console.log('success')
  })
})

vendor.get('/list',async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await vendorController.getVendor()

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

vendor.get('/property/list',async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = {
      property_ref: decoded.current_env.property_ref
    }
    const result = await vendorController.getVendorByProperty(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

vendor.get('/view/:id', async (req, res) => {
  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)    
    const result = await vendorController.getVendorById(req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

vendor.post('/save/:id',async (req, res) => {
  try {
    const data = req.body.data
    if (req.query.mode !== 'test') {
      let decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)    
      data.current_env = decoded.current_env
    }
    data.paramsId = parseInt(req.params.id)
    data.queryMode = req.query.mode
    const result = await vendorController.postVendor(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

vendor.post('/delete/:id',async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const result = await vendorController.deleteVendor(req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

vendor.post('/invite',async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body
    data.property_ref = decoded.current_env.property_ref
    const result = await vendorController.inviteVendor(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

vendor.get('/check-duplicate',async (req, res) => {
  try {
    if (req.query.mode !== 'test') {
      let decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)  
    }    
    const data = req.query  
    const result = await vendorController.getVendorByQuery(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

const upload = (f, id, path) => {  
  let myFile = f.name.split(".")
  const fileType = myFile[myFile.length - 1]

  return new Promise((resolve, reject) => {
    try {

      AWS.config.getCredentials(function(err) {
        if (err) console.log(err.stack);
        // credentials not loaded
        else {
          console.log("Access key:", AWS.config.credentials.accessKeyId);
        }
      });      

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `docs/${path}/${id}/${uuidv4()}.${fileType}`,
        Body: f.data
      }

      s3.upload(params, (err, data) => {
        if (err) {
          reject(err.toString('utf8'))
        }
        resolve(data)
      }) 

    } catch(err) {
      reject(err.toString('utf8'))
    }
  })  
}

module.exports = vendor
