const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res, next) => {
    try {
        const { name, email, password, role, phone } = req.body;
        
        // Check if user exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const userId = await User.create({ name, email, password, role, phone });
        
        const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: { id: userId, name, email, role }
        });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Enforce the requested role (e.g. user cannot login as provider)
        if (role && user.role !== role) {
            return res.status(403).json({ success: false, message: `Access denied. You are not registered as a ${role}` });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    register,
    login,
    forgotPassword: async (req, res, next) => {
        try {
            const { email } = req.body;
            // Simulated check and email sending
            res.json({
                success: true,
                message: 'If an account exists with this email, a reset link has been sent.'
            });
        } catch (err) {
            next(err);
        }
    }
};
