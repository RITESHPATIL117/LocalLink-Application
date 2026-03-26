const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getAllBusinesses, getBusinessesByCategory, getOwnerBusinesses } = require('../controllers/businessController');

router.get('/', getAllBusinesses);
router.get('/my-businesses', protect, getOwnerBusinesses);
router.get('/category/:categoryId', getBusinessesByCategory);

module.exports = router;
