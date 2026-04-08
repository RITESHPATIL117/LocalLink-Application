const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getAllCategories, suggestCategory, getSubcategories } = require('../controllers/categoryController');

router.get('/', getAllCategories);
router.get('/:parentId/subcategories', getSubcategories);
router.post('/suggest', protect, suggestCategory);

module.exports = router;
