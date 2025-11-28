const express = require('express');
const router = express.Router();
const OwnerAmenityController = require('../../controllers/owner/OwnerAmenityController');
const upload = require('../../middleware/upload');

router.get('/', OwnerAmenityController.getAll);
router.post('/', upload.single('image'), OwnerAmenityController.create);
router.put('/:id', upload.single('image'), OwnerAmenityController.update);
router.delete('/:id', OwnerAmenityController.delete);

module.exports = router;
