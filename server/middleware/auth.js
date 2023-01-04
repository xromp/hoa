const jwt = require('jsonwebtoken');

const auth =  (async (req, res, next) => {
  const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  req.currentUser = decoded;
  next();
})
module.exports = auth;