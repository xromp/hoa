import express from 'express';
import cors from 'cors';
import { getPropertyForRegistration } from '../controllers/property.controller';
import { isEmailExist, registerUser } from '../controllers/user.controller';
import { createRequest } from '../controllers/user_pending_request.controller';

const router = express.Router();
const getProperty = async (req, res) => {
	const { code } = req.query;
	let response = {};
	if (!code) {
		response = { status: 'failed', message: 'Code is required.' };
	} else {
		const data = await getPropertyForRegistration({ code });
		response = {
			data,
			message: data ? '' : 'Invalid property code.',
			status: data ? 'success' : 'failed',
		};
	}

	res.send(response);
};

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

const checkEmail = async (req, res) => {
	const { email } = req.params;
	const response = await isEmailExist(email);
	res.send(response);
};

router.use(cors());
router.get('/get-property', getProperty);
router.post('/register', register);
router.get('/is-email-exist/:email', checkEmail);

module.exports = router;
