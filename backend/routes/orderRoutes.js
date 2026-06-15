import express from 'express';
import {
  createOrder,
  completeOrder,
  getAllOrders,
  getOrdersByUser
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getAllOrders);

router.route('/pos')
  .post(protect, authorize('UnitAreaManager', 'SuperAdmin'), createOrder);

// Customer facing route (usually unprotected or protected by user auth)
router.route('/pickup')
  .post(createOrder);

router.route('/pickup/:code/complete')
  .put(protect, authorize('UnitAreaManager', 'SuperAdmin'), completeOrder);

router.route('/user/:userId')
  .get(protect, getOrdersByUser);

export default router;
