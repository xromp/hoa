const express = require('express')
const portfolio_user = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const portfolioUserController = require('../controllers/portfolio_user.controller')
portfolio_user.use(cors())

portfolio_user.get('/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await portfolioUserController.getPortfolioUserByPmcId(req.headers['pmc_id'])

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

portfolio_user.get('/view/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await portfolioUserController.getPortfolioUserById(req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

portfolio_user.post('/save/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const data = req.body.data;
    data.paramsId = req.params.id;
    const result = await portfolioUserController.postPortfolioUser(data)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

portfolio_user.post('/delete/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const result = await portfolioUserController.deletePortfolioUserById(req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

module.exports = portfolio_user
