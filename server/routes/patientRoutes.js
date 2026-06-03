import express from 'express';
import { createPatient, deletePatient, getPatient, listPatients, patientSummary, updatePatient, uploadPhoto } from '../controllers/patientController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);
router.route('/').post(restrictTo(['admin', 'receptionist']), createPatient).get(listPatients);
router.get('/:id/summary', patientSummary);
router.post('/:id/photo', restrictTo(['admin', 'receptionist']), upload.single('photo'), uploadPhoto);
router.route('/:id').get(getPatient).put(restrictTo(['admin', 'doctor']), updatePatient).delete(restrictTo(['admin']), deletePatient);

export default router;
