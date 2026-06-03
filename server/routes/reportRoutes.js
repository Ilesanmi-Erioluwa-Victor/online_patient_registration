import express from 'express';
import { appointmentStats, bloodGroupStats, exportPatients, exportRecords, genderBreakdown, patientsByMonth, summary } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/summary', summary);
router.use(restrictTo(['admin']));
router.get('/patients-by-month', patientsByMonth);
router.get('/gender-breakdown', genderBreakdown);
router.get('/blood-group-stats', bloodGroupStats);
router.get('/appointments-stats', appointmentStats);
router.get('/export/patients', exportPatients);
router.get('/export/records', exportRecords);

export default router;
