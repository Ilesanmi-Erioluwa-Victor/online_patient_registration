import express from 'express';
import { createAppointment, deleteAppointment, getAppointment, listAppointments, updateAppointment } from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.route('/').post(restrictTo(['admin', 'doctor', 'receptionist']), createAppointment).get(listAppointments);
router.route('/:id').get(getAppointment).put(restrictTo(['admin', 'doctor', 'receptionist']), updateAppointment).delete(restrictTo(['admin', 'doctor', 'receptionist']), deleteAppointment);

export default router;
