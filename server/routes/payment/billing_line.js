import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { 
  createLine, 
  deleteLine, 
  updateLine,
} from "../../controllers/billing_line.controller";

const router = express.Router();
router.use(cors());

const create = async (req, res) => {
  try {
    const { id: user_id } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);  
    const response =  await createLine({ ...req.body });
    res.send(response);
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
}

const update = async (req, res) => {
  try {
    const { id: user_id } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);  
    const { id } = req.params;
    const response =  await updateLine(id, { ...req.body });
    res.send(response);
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
}

const remove = async (req, res) => {
  try {
    const { id: user_id } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);  
    const { id } = req.params;
    const response =  await deleteLine(id, req.body);
    res.send({status: true});
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
}

router.post('/save', create);
router.patch('/update/:id', update);
router.delete('/delete/:id', remove);
module.exports = router;