const Chat = require('../models/chatModel');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const getChats = async (req, res, next) => {
    try {
        const rows = await Chat.listChatsForUser(req.user.id);
        const normalized = rows.map((r) => ({
            id: String(r.id),
            name: r.name,
            lastMessage: r.last_message || 'Start conversation',
            time: r.last_message_time ? new Date(r.last_message_time).toLocaleString() : 'New',
            unread: 0,
            isOnline: false,
            image: r.image_url || null
        }));
        return sendSuccess(res, normalized);
    } catch (err) {
        next(err);
    }
};

const getMessages = async (req, res, next) => {
    try {
        const chatId = Number(req.params.chatId);
        const rows = await Chat.getMessages(chatId, req.user.id);
        if (rows === null) {
            return sendError(res, 'Chat not found', 404);
        }
        const normalized = rows.map((m) => ({
            id: String(m.id),
            text: m.message,
            sender: m.sender_id === req.user.id ? 'me' : 'other',
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
        }));
        return sendSuccess(res, normalized);
    } catch (err) {
        next(err);
    }
};

const startChat = async (req, res, next) => {
    try {
        const businessId = Number(req.body.business_id);
        const chat = await Chat.getOrCreateChat(req.user.id, businessId);
        return sendSuccess(res, { chatId: String(chat.id) }, 'Chat ready', 201);
    } catch (err) {
        next(err);
    }
};

const sendMessage = async (req, res, next) => {
    try {
        const chatId = Number(req.params.chatId);
        const message = String(req.body.message || '').trim();
        if (!message) {
            return sendError(res, 'Message cannot be empty', 400);
        }
        const messageId = await Chat.sendMessage(chatId, req.user.id, message);
        return sendSuccess(res, { id: String(messageId) }, 'Message sent', 201);
    } catch (err) {
        next(err);
    }
};

module.exports = { getChats, getMessages, startChat, sendMessage };
