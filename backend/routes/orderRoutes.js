import express from 'express';
import {
  createOrder,
  getOrderByCode,
  completeOrder,
  getAllOrders,
  getOrdersByUser,
  markDelivered,
} from '../controllers/orderController.js';

const router = express.Router();

router.get('/', getAllOrders);
router.post('/', createOrder);
router.get('/user/:userId', getOrdersByUser);
router.get('/:code', getOrderByCode);
router.put('/:code/complete', completeOrder);
router.patch('/:code/deliver', markDelivered);

export default router;
