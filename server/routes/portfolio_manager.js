const express = require('express')
const portfolio_manager = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const portfolioManagerController = require('../controllers/portfolio_manager.controller')
portfolio_manager.use(cors())

portfolio_manager.get('/list', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await portfolioManagerController.getPortfolioManagerByPmcId(req.headers['pmc_id'])

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

portfolio_manager.get('/view/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const result = await portfolioManagerController.getPortfolioManagerById(req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: err.toString('utf8') })
  }
})

portfolio_manager.post('/save', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const data = req.body.data
    const result = await portfolioManagerController.postPortfolioManager(data)

    res.send(result)
  } catch(err) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
});

portfolio_manager.patch('/update/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const data = req.body.data
    data.paramsId = req.params.id
    const result = await portfolioManagerController.patchPortfolioManager(data)

    res.send(result)
  } catch(err) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
});

portfolio_manager.post('/delete/:id', async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY)
    const result = await portfolioManagerController.deletePortfolioManagerById(req.params.id)

    res.send(result)
  } catch(err){
    res.status(400).json({ errors: error.toString('utf8') })
  }
})

module.exports = portfolio_manager
