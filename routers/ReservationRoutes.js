import express from 'express';
import ReservationController from '../controller/ReservationController.js';
// 👇 1. IMPORT MO YUNG MIDDLEWARE
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// 👇 2. LAGYAN NG 'protect' LAHAT NG ROUTES

// Get all reservations (admin)
router.get('/', protect, ReservationController.getAll);

// Get reservation by ID
router.get('/:id', protect, ReservationController.getById);
router.get('/user/:userId', protect, ReservationController.getByUserId);
// Update reservation
router.put('/:id', protect, ReservationController.update);

// 👇 NEW: Extend reservation check-out date
router.put('/:id/extend', protect, ReservationController.extend);

// Delete reservation
router.delete('/:id', protect, ReservationController.delete);

export default router;