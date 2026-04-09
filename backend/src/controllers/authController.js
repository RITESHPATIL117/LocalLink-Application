const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const RefreshToken = require('../models/refreshTokenModel');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const ACCESS_TOKEN_EXPIRY = '7d';
const REFRESH_TOKEN_EXPIRY_DAYS = 30;

const signAccessToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

const createRefreshToken = () => crypto.randomBytes(48).toString('hex');
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const issueAuthTokens = async (user) => {
    const token = signAccessToken(user);
    const refreshToken = createRefreshToken();
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    await RefreshToken.save({ userId: user.id, tokenHash, expiresAt });

    return { token, refreshToken };
};

const register = async (req, res, next) => {
    try {
        const { name, email, password, role, phone } = req.body;
        
        // Check if user exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const userId = await User.create({ name, email, password, role, phone });
        const user = { id: userId, name, email, role };
        const { token, refreshToken } = await issueAuthTokens(user);

        return sendSuccess(
            res,
            {
                token,
                refreshToken,
                user
            },
            'User registered successfully',
            201
        );
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;

        const user = await User.findByEmail(email);
        if (!user) {
            return sendError(res, 'Invalid credentials', 401);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendError(res, 'Invalid credentials', 401);
        }

        // Enforce the requested role (e.g. user cannot login as provider)
        if (role && user.role !== role) {
            return sendError(res, `Access denied. You are not registered as a ${role}`, 403);
        }

        const authUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        const { token, refreshToken } = await issueAuthTokens(authUser);

        return sendSuccess(res, {
            token,
            refreshToken,
            user: authUser
        });
    } catch (err) {
        next(err);
    }
};

const me = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return sendError(res, 'User not found', 404);
        }
        return sendSuccess(res, user);
    } catch (err) {
        next(err);
    }
};

const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return sendError(res, 'Refresh token is required', 400);
        }

        const tokenHash = hashToken(refreshToken);
        const storedToken = await RefreshToken.find(tokenHash);

        if (!storedToken) {
            return sendError(res, 'Invalid refresh token', 401);
        }

        if (new Date(storedToken.expires_at) < new Date()) {
            await RefreshToken.deleteByHash(tokenHash);
            return sendError(res, 'Refresh token expired', 401);
        }

        const user = await User.findById(storedToken.user_id);
        if (!user) {
            await RefreshToken.deleteByHash(tokenHash);
            return sendError(res, 'User not found', 401);
        }

        await RefreshToken.deleteByHash(tokenHash);
        const { token, refreshToken: rotatedRefreshToken } = await issueAuthTokens(user);

        return sendSuccess(res, {
            token,
            refreshToken: rotatedRefreshToken,
            user
        }, 'Token refreshed');
    } catch (err) {
        next(err);
    }
};

const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            await RefreshToken.deleteByHash(hashToken(refreshToken));
        }
        return sendSuccess(res, null, 'Logged out successfully');
    } catch (err) {
        next(err);
    }
};

module.exports = {
    register,
    login,
    me,
    refresh,
    logout,
    forgotPassword: async (req, res, next) => {
        try {
            const { email } = req.body;
            // Simulated check and email sending
            return sendSuccess(res, null, 'If an account exists with this email, a reset link has been sent.');
        } catch (err) {
            next(err);
        }
    }
};
