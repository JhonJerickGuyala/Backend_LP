import express from 'express';
const router = express.Router();
import OwnerDashboardController from '../../controller/owner/OwnerDashboardController.js';

// 👇 1. IMPORT MO ANG MIDDLEWARE
import { protect, authorize } from '../../middleware/authMiddleware.js'; 

// 👇 2. LAGYAN NG 'protect' AT 'authorize' ANG ROUTES
// Ang 'authorize("owner")' ay sisiguraduhin na OWNER lang ang makakapasok dito.

// 1. Get All Analytics (Stats, Charts, Table Data)
router.get('/analytics', protect, authorize('owner'), OwnerDashboardController.getAnalyticsData); 

// 2. Export CSV
router.get('/export', protect, authorize('owner'), OwnerDashboardController.exportData);

export default router;