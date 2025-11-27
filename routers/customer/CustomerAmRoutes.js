import express from 'express';
import { getAllAmenities, getAmenityById } from '../../controller/customer/CustomerAmController.js';

const router = express.Router();

router.get('/', getAllAmenities);
router.get('/:id', getAmenityById);

export default router;