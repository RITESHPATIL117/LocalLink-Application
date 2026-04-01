const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getAllBusinesses, getBusinessesByCategory, getOwnerBusinesses, createBusiness, getPublicStats, getProviderStats } = require('../controllers/businessController');

router.get('/', getAllBusinesses);
router.get('/public-stats', getPublicStats);
router.get('/category/:categoryId', getBusinessesByCategory);

router.use(protect);
router.post('/', createBusiness);
router.get('/my-businesses', getOwnerBusinesses);
router.get('/owner/stats', getProviderStats);

module.exports = router;
