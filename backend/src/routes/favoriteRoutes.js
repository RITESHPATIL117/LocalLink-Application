const express = require('express');
const { body, param } = require('express-validator');
const { protect } = require('../middlewares/authMiddleware');
const { validateRequest } = require('../middlewares/validateRequest');
const { getFavorites, addFavorite, removeFavorite, toggleFavorite } = require('../controllers/favoriteController');

const router = express.Router();

router.use(protect);

router.get('/', getFavorites);
router.post(
    '/',
    body('business_id').isInt({ min: 1 }).withMessage('business_id must be a valid number'),
    validateRequest,
    addFavorite
);
router.post(
    '/toggle',
    body('business_id').isInt({ min: 1 }).withMessage('business_id must be a valid number'),
    validateRequest,
    toggleFavorite
);
router.delete(
    '/:businessId',
    param('businessId').isInt({ min: 1 }).withMessage('businessId must be a valid number'),
    validateRequest,
    removeFavorite
);

module.exports = router;
