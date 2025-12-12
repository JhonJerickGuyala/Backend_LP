import express from 'express';
import OwnerAmenityController from '../../controller/owner/OwnerAmenityController.js';
import { uploadAmenities } from '../../middleware/upload.js'; 
import { protect, authorize } from '../../middleware/authMiddleware.js'; 

const router = express.Router();

router.get('/', protect, authorize('owner'), OwnerAmenityController.getAll);

router.post('/', 
    protect, 
    authorize('owner'), 
    uploadAmenities.single('image'), 
    OwnerAmenityController.create
);

router.put('/:id', 
    protect, 
    authorize('owner'), 
    uploadAmenities.single('image'), 
    OwnerAmenityController.update
);

router.delete('/:id', protect, authorize('owner'), OwnerAmenityController.delete);

export default router;