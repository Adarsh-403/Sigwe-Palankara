import express from 'express';
import {
  getProducts,
  createProduct,
  updateProductStock,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getProducts)
  .post(protect, authorize('SuperAdmin'), createProduct);

router.route('/:id/stock')
  .put(protect, authorize('WarehouseManager', 'SuperAdmin'), updateProductStock);

export default router;
