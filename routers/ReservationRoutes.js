import express from 'express';
import ReservationController from '../controller/ReservationController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();


// Get all reservations (admin)
router.get('/', protect, ReservationController.getAll);

// Get reservation by ID
router.get('/:id', protect, ReservationController.getById);
router.get('/user/:userId', protect, ReservationController.getByUserId);
// Update reservation
router.put('/:id', protect, ReservationController.update);
router.put('/:id/extend', protect, ReservationController.extend);
// Delete reservation
router.delete('/:id', protect, ReservationController.delete);

export default router;