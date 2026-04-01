const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getAllCategories, suggestCategory } = require('../controllers/categoryController');

router.get('/', getAllCategories);
router.post('/suggest', protect, suggestCategory);

module.exports = router;
