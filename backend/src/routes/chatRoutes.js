const express = require('express');
const { body, param } = require('express-validator');
const { protect } = require('../middlewares/authMiddleware');
const { validateRequest } = require('../middlewares/validateRequest');
const { getChats, getMessages, startChat, sendMessage } = require('../controllers/chatController');

const router = express.Router();

router.use(protect);

router.get('/', getChats);
router.post(
    '/',
    body('business_id').isInt({ min: 1 }).withMessage('business_id must be a valid number'),
    validateRequest,
    startChat
);
router.get(
    '/:chatId/messages',
    param('chatId').isInt({ min: 1 }).withMessage('chatId must be a valid number'),
    validateRequest,
    getMessages
);
router.post(
    '/:chatId/messages',
    param('chatId').isInt({ min: 1 }).withMessage('chatId must be a valid number'),
    body('message').trim().isLength({ min: 1 }).withMessage('message is required'),
    validateRequest,
    sendMessage
);

module.exports = router;
