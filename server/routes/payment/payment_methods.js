import express, { response } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { 
  add,
  updateById,
  deleteById,
  findByUserId,
  view,
  getPaymentMethodByUserId,
} from '../../controllers/payment/payment_method.controller';
const router = express.Router();
router.use(cors());

router.post('/add', async (req, res) => {
  try {
    const { id } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const response  = await add(req.body);
    res.send({ response });
  } catch(err){
    res.status(400).json({ errors: error.toString('utf8') })
  }
})

router.post('/update/:id', async (req, res) => {
  try {
    const { id } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const response = await updateById(req.params.id,req.body);
    res.send(response);
  } catch(err){
    res.status(400).json({ errors: error.toString('utf8') })
  }
})

router.get('/delete/:id', async (req, res) => {
  try {
    const { id } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const response = await deleteById(req.params.id);
    res.send({ status: response });
  } catch (err) {
    res.status(400).json({ errors: error.toString('utf8') })
  }  
})

router.get('/viewAll/:userId', async (req, res) => {
  try {
    const { id } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const response = await findByUserId(req.params.userId)
    res.send(response);
  } catch (err) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
})

router.get('/view/:id', async (req, res) => {
  try {
    const { id } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const response = await view(req.params.id);
    res.send(response);
  } catch (err) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
})

const getPaymentMethodByCurrentUser = async (req, res) => {
  try {
    const { id: user_id } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const response = await getPaymentMethodByUserId(user_id);
    res.send(response);
  } catch (error) {
    res.status(400).json({ errors: error.toString('utf8') })
  }
}

router.get('/get-current-user', getPaymentMethodByCurrentUser);

module.exports = router;