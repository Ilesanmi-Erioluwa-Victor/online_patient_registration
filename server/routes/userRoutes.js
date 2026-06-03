import express from 'express';
import { createUser, deleteUser, getUser, listDoctors, listUsers, updateUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/doctors', protect, listDoctors);
router.use(protect, restrictTo(['admin']));
router.route('/').post(createUser).get(listUsers);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

export default router;
