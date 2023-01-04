const express = require('express')
const docs = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const documentController = require('../controllers/document.controller')
docs.use(cors())

docs.post('/upload', async (req, res) => {
  try {    
    //const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body
    data.bodyFiles = req.files    
    data.filePath = req.body.filePath
    const result = await documentController.postDocumentUpload(data)

    res.send(result)
  } catch(err) {
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

docs.post('/table/read', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = {
      bodyPath: req.body.path,
    }
    const result = await documentController.getDocumentByPath(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

docs.post('/table/save', async (req, res) => {
  try {
    // const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body
    const result = await documentController.postDocument(data)

    res.send(result)
  } catch (err) {
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

docs.post('/table/delete', async (req, res) => {
  try {
    // const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body.data
    const result = await documentController.deleteDocument(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

docs.get('/folder/list', async (req, res) => {
  try {
    // const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = {
      queryId: parseInt(req.query.id)
    }
    const result = await documentController.getDocumentFolder(data)

    res.send(result)
  } catch(err) {
    res.status(400).json({ errors: err.toString('utf8') }) 
  }
})

docs.get('/file/list', async (req, res) => {
  try {
    // const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = {
      queryId: parseInt(req.query.id)
    }
    const result = await documentController.getDocumentById(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') }) 
  }
})


module.exports = docs
