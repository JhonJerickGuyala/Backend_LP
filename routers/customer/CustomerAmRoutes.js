import express from 'express';
import CustomerAmController from '../../controller/customer/CustomerAmController.js';

const router = express.Router();

router.get('/featured', CustomerAmController.getFeatured); 
router.get('/', CustomerAmController.getAll);
router.get('/:id', CustomerAmController.getById);

export default router;