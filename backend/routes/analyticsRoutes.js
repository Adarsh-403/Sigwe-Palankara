import express from 'express';
import { getAnalyticsSummary, clearAllData } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/summary', getAnalyticsSummary);
router.delete('/clear', clearAllData);

export default router;
