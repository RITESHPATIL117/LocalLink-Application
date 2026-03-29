const express = require('express');
const router = express.Router();
const { createReview, getBusinessReviews, getTopReviews } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createReview);
router.get('/top', getTopReviews);
router.get('/business/:businessId', getBusinessReviews);

module.exports = router;
