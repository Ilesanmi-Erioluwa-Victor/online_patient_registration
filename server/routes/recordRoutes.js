import express from 'express';
import { createRecord, deleteRecord, getRecord, recordsByPatient, updateRecord } from '../controllers/recordController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);
router.post('/', restrictTo(['admin', 'doctor', 'nurse']), upload.single('fileAttachment'), createRecord);
router.get('/patient/:id', recordsByPatient);
router.route('/:id').get(getRecord).put(restrictTo(['admin', 'doctor']), updateRecord).delete(restrictTo(['admin', 'doctor']), deleteRecord);

export default router;
