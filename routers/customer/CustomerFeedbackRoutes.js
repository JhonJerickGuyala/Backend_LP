import express from 'express';
import { getAllFeedbacks, createFeedback } from '../../controller/customer/CustomerFeedbackController.js';

const router = express.Router();

router.get('/', getAllFeedbacks);
router.post('/', createFeedback);

export default router;