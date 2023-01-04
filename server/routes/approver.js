import express, { response } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import {
  getApprovers,
  getCurrentUser,
  getApproversByProperty,
  createApproverByProperties,
  deleteApprover,
  updateRoleByUserId,
} from '../controllers/approvers.controller';
// import { findPropertyByRef } from '../controllers/property.controller';
const { findPropertyByRef } = require('../controllers/property.controller');

const router = express.Router();
router.use(cors());

const getCurrentUserApproverDetails = async (req, res) => {
  try {
    const { id: user_id, current_env } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const { property_ref: ref } = current_env;
    const { id: property_id } = await findPropertyByRef({ ref })
    const response = await getCurrentUser({ ...req.query, user_id, property_id });
    res.send(response)
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
}

const getAllApprovers = async (req, res) => {
  try {
    const { id: user_id, current_env } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const { property_ref: ref } = current_env;
    const { id: property_id } = await findPropertyByRef({ ref })
    const response = await getApprovers({ ...req.query, property_id });
    res.send(response)
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
}

const saveApprover = async (req, res) => {
  try {
    const { id: user_id } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const response = await createApproverByProperties({ ...req.body });
    res.send(response)
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
}

const updateApproverRole = async (req, res) => {
  try {
    const { id: user_id } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const response = await updateRoleByUserId({ ...req.body });
    res.send(response)
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
}

const removeApprover = async (req, res) => {
  try {
    const { id: user_id } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const response = await deleteApprover({ ...req.params });
    res.send(response)
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
}

router.get('/current-user', getCurrentUserApproverDetails);
router.get('/get-approvers', getAllApprovers);
router.post('/save-approver', saveApprover);
router.post('/update-role', updateApproverRole);
router.delete('/:id', removeApprover);
module.exports = router;