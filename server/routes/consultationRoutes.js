import express from 'express';
import { consultationsByPatient, createConsultation, deleteConsultation, getConsultation, updateConsultation } from '../controllers/consultationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.post('/', restrictTo(['admin', 'doctor']), createConsultation);
router.get('/patient/:id', restrictTo(['admin', 'doctor', 'nurse']), consultationsByPatient);
router.route('/:id').get(getConsultation).put(restrictTo(['admin', 'doctor']), updateConsultation).delete(restrictTo(['admin']), deleteConsultation);

export default router;
