const express = require('express')
const portfolio = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const portfolioController = require('../controllers/portfolio.controller')
portfolio.use(cors())

portfolio.get('/check-duplicate', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await portfolioController.getPortfolioByName(req.query)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

portfolio.get('/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await portfolioController.getPortfolioByUserId(decoded.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

portfolio.get('/view/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await portfolioController.getPortfolioById(req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

portfolio.post('/save/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body.data
    data.paramsId = parseInt(req.params.id)
    data.decodedId = decoded.id
    data.current_env = decoded.current_env
    const result = await portfolioController.postPortfolio(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

portfolio.post('/delete/:id', async (req, res) => {
  try {
    const { current_env, id } = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = {
      'property_ref': current_env.property_ref,
      'parent_org_id': parseInt(current_env.parent_org_id),
      'role_id': parseInt(current_env.role_id),
      'role_val': current_env.role_val,
      'paramsId': req.params.id,
      'decodedId': id
    }
    const result = await portfolioController.deletePortfolio(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

portfolio.patch('/setting/:id', async (req, res) => {
  const { current_env } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  const { id } = req.params;
  const result = await portfolioController.updateSettingById(id, req.body);
  res.send({ result });
})

module.exports = portfolio
