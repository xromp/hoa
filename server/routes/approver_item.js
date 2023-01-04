import express, { response } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import {
  sendApproverNotif,
  deleteById,
} from '../controllers/approval_item.controller';

const router = express.Router();
router.use(cors());

const sendFollowup = async (req, res) => {
  try {
    const { id: sender_id } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const response = await sendApproverNotif({ ...req.body, sender_id });
    res.send(response)
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
}

const deleteApprover = async (req, res) => {
  try {
    const { id: sender_id } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const response = await deleteById({ ...req.params });
    res.send(response)
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
}

router.post('/send-followup', sendFollowup);
router.delete('/delete-approver/:id', deleteApprover);
module.exports = router;