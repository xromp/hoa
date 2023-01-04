const express = require('express')
const core_router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
var request = require('request')
core_router.use(cors())

core_router.authenticate = async (req,res)=>{
    try {
        var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
        //TODO: grab session
      } catch(err){
        res.json('access_denied')
        return('token_err')
      }  
}

core_router.responseHandler = (res,result) => {
    if(result && (!result.message || result.message =='success'))
        res.send(result);
    else if(result && result.message && result.message =='error')
        res.status(500).send(result);
    else 
        res.status(500).send({'message':'error','error':"undefined error"})
}

module.exports = core_router