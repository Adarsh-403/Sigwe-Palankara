import express from 'express';
import { createOrder, getOrderByCode, completeOrder, getAllOrders } from '../controllers/orderController.js';

const router = express.Router();

router.get('/', getAllOrders);
router.post('/', createOrder);
router.get('/:code', getOrderByCode);
router.put('/:code/complete', completeOrder);

export default router;
