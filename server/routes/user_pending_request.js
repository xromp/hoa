import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import {
	approveUserRequest,
	createRequest,
	denyUserRequest,
	findRequestsQry,
} from '../controllers/user_pending_request.controller';
import { findPropertyByRef } from '../controllers/property.controller';
const router = express.Router();
const register = async (req, res) => {
	const data = req.body;
	const user = {
		property_id: data.property_id,
		type: 'CreateUserAccount',
		description: '',
		requestDataObj: JSON.stringify(data),
	};
	const response = await createRequest(user);

	res.send(response);
};

const getUserPendingRequest = async (req, res) => {
	const { id: user_id, current_env } = jwt.verify(
		req.headers['authorization'],
		process.env.SECRET_KEY
	);
	const { property_ref: ref } = current_env;
	const { id: property_id } = await findPropertyByRef({ ref });
	const response = await findRequestsQry({
		property_id,
		type: 'CreateUserAccount',
	});
	res.send(response);
};

const approve = async (req, res) => {
	try {
		const { id: user_id, current_env } = jwt.verify(
			req.headers['authorization'],
			process.env.SECRET_KEY
		);
		const data = req.body;
		const response = await approveUserRequest(data);
		res.send(response);
	} catch (error) {
		res.status(400).json({ errors: error.toString('utf8') });
	}
};
const deny = async (req, res) => {
	try {
		const { id: user_id, current_env } = jwt.verify(
			req.headers['authorization'],
			process.env.SECRET_KEY
		);
		const data = req.body;
		const response = await denyUserRequest(data);
		res.send(response);
	} catch (error) {
		res.status(400).json({ errors: error.toString('utf8') });
	}
};

router.use(cors());
router.get('/get-user-requests', getUserPendingRequest);
router.post('/register', register);
router.post('/approve', approve);
router.post('/deny', deny);
module.exports = router;
