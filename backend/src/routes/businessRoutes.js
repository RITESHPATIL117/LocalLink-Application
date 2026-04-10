const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getAllBusinesses, getBusinessById, getNearbyBusinesses, getBusinessesByCategory, getOwnerBusinesses, createBusiness, updateBusiness, deleteBusiness, getPublicStats, getProviderStats } = require('../controllers/businessController');

router.get('/', getAllBusinesses);
router.get('/public-stats', getPublicStats);
router.get('/nearby', getNearbyBusinesses);
router.get('/category/:categoryId', getBusinessesByCategory);
router.get('/my-businesses', protect, getOwnerBusinesses);
router.get('/owner/stats', protect, getProviderStats);
router.get('/:id', getBusinessById);

router.post('/', protect, createBusiness);
router.put('/:id', protect, updateBusiness);
router.delete('/:id', protect, deleteBusiness);

module.exports = router;
