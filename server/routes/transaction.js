import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

import  { getTransByUserId } from '../controllers/transaction.controller';
import  { findPropertyByRef } from '../controllers/property.controller';

const router = express.Router();
const getTransactions = async (req, res) => {
  try {
    const { id:user_id, current_env } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const { property_ref:ref } = current_env;
    const { id:property_id } = await findPropertyByRef({ ref });
    console.log({property_id})
    const result = await getTransByUserId({ user_id });
    res.send(result);
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
}

router.use(cors());
router.get('/', getTransactions);

module.exports = router;