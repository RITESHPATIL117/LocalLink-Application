const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getAllBusinesses, getBusinessById, getNearbyBusinesses, getBusinessesByCategory, getOwnerBusinesses, createBusiness, updateBusiness, deleteBusiness, getPublicStats, getProviderStats } = require('../controllers/businessController');

router.get('/', getAllBusinesses);
router.get('/public-stats', getPublicStats);
router.get('/nearby', getNearbyBusinesses);
router.get('/category/:categoryId', getBusinessesByCategory);
router.get('/:id', getBusinessById);

router.use(protect);
router.post('/', createBusiness);
router.put('/:id', updateBusiness);
router.delete('/:id', deleteBusiness);
router.get('/my-businesses', getOwnerBusinesses);
router.get('/owner/stats', getProviderStats);

module.exports = router;
