const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { register, login, me, refresh, logout, forgotPassword } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { registerValidator, loginValidator } = require('../validators/authValidators');
const { validateRequest } = require('../middlewares/validateRequest');

// Rate limiter for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per window
    message: { success: false, message: 'Too many auth attempts, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/register', authLimiter, registerValidator, validateRequest, register);
router.post('/login', authLimiter, loginValidator, validateRequest, login);
router.post('/refresh', authLimiter, refresh);
router.post('/logout', logout);
router.post('/forgot-password', authLimiter, forgotPassword);
router.get('/me', protect, me);

module.exports = router;
