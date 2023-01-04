import express, { response } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import {
  saveApprovers,
  findOpenApprovalByUser,
  findHistoryApprovalByUser,
  exportApprovals
} from '../controllers/approval.controller';
import {
  submitApproverAction,
} from '../controllers/approval_item.controller';
import { findPropertyByRef } from '../controllers/property.controller';

const router = express.Router();
router.use(cors());

const getOpenHistoryByUser = async (req, res) => {
  try {
    const { id: user_id, current_env } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);  
    const { property_ref: ref } = current_env;
    const { id: property_id } = await findPropertyByRef({ ref });
    
    const history = await findHistoryApprovalByUser({ user_id, property_id });
    const open = await findOpenApprovalByUser({ user_id, property_id });
    res.send({ history, open });
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
}

const approverAction = async (req, res) => {
  try {
    const { id: user_id } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const response = await submitApproverAction({ ...req.body, user_id });
    res.send(response)
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
}

const saveApprovalApprovers = async (req, res) => {
  try {
    const { id: createdby_id, current_env } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const { property_ref: ref } = current_env;
    const { id: property_id } = await findPropertyByRef({ ref });
    const response = await saveApprovers({ ...req.body, createdby_id, property_id });
    res.send(response)
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
}

const exportApprovalPerProperty = async (req, res) => {
  try {
    const { id: requestedby_id } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const { id: property_id } = await findPropertyByRef({ ref: req.query.property_ref });
    const response = await exportApprovals({ requestedby_id, property_id });
    res.send(response)
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
}

router.get('/open-history', getOpenHistoryByUser);
router.post('/submit-approver-action', approverAction);
router.post('/save-approvers', saveApprovalApprovers);
router.get('/export-approvals', exportApprovalPerProperty);
module.exports = router;