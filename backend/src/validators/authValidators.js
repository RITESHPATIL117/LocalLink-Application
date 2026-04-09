const { body } = require('express-validator');

const registerValidator = [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['user', 'provider', 'admin']).withMessage('Invalid role'),
    body('phone').optional().trim().isLength({ min: 8, max: 20 }).withMessage('Invalid phone number')
];

const loginValidator = [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 1 }).withMessage('Password is required'),
    body('role').optional().isIn(['user', 'provider', 'admin']).withMessage('Invalid role')
];

module.exports = {
    registerValidator,
    loginValidator
};
