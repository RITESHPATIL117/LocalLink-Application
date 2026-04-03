const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    console.log(`[AUTH DEBUG] ${req.method} ${req.originalUrl} | Auth Header: ${req.headers.authorization ? 'Present' : 'Missing'}`);

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        console.log(`[AUTH DEBUG] No token found for ${req.originalUrl}`);
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log(`[AUTH DEBUG] Token verified for User ID: ${decoded.id}`);
        next();
    } catch (err) {
        console.log(`[AUTH DEBUG] Token verification failed for ${req.originalUrl}: ${err.message}`);
        res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

const optionalAuth = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (err) {
            // Optional auth, so we ignore invalid tokens and treat as unauthenticated
        }
    }
    next();
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, optionalAuth, admin };
