const express = require('express');
const router = express.Router();
const { getAllBusinesses, getBusinessesByCategory } = require('../controllers/businessController');

router.get('/', getAllBusinesses);
router.get('/category/:categoryId', getBusinessesByCategory);

module.exports = router;
