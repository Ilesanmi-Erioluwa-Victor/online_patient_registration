import express from 'express';
import { auditLogs } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, restrictTo(['admin']), auditLogs);

export default router;
