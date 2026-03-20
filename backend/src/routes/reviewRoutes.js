const express = require('express');
const router = express.Router();
const { createReview, getBusinessReviews } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createReview);
router.get('/business/:businessId', getBusinessReviews);

module.exports = router;
