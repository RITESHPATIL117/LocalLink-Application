require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

// Security and Logging Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Deep Diagnostic Middleware
app.use((req, res, next) => {
    if (req.originalUrl.includes('/rfq') || req.originalUrl.includes('/leads')) {
        console.log(`\n--- [RFQ/LEAD DEBUG] ---`);
        console.log(`URL: ${req.method} ${req.originalUrl}`);
        console.log(`Headers:`, JSON.stringify(req.headers, null, 2));
        console.log(`Body:`, JSON.stringify(req.body, null, 2));
        console.log(`--- [END DEBUG] ---\n`);
    }
    next();
});

const categoryRoutes = require('./routes/categoryRoutes');
const businessRoutes = require('./routes/businessRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const leadRoutes = require('./routes/leadRoutes');
const rfqRoutes = require('./routes/rfqRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/api/categories', categoryRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/rfq', rfqRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/chats', chatRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Friendly message for the root route so users don't see "Cannot GET /" if they accidentally hit the API port
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: system-ui, sans-serif; padding: 40px; text-align: center; color: #1f2937;">
            <h1 style="color: #1e40af; font-weight: 900;">LocalHub Backend Engine</h1>
            <p style="font-size: 18px; color: #4b5563;">The API is running successfully. 🟢</p>
            <div style="margin-top: 24px; padding: 16px; background-color: #f3f4f6; border-radius: 8px; display: inline-block;">
                <p style="margin: 0;"><b>Accessing the Web Portal?</b></p>
                <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 14px;">Next.js is likely running on <b>http://localhost:3001</b> since this backend is occupying port 3000.</p>
            </div>
        </div>
    `);
});

// Global Error Handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    
    // Structured logging for better debugging
    console.error(`[Error] ${status} - ${req.method} ${req.url} - ${req.ip} - ${message}`);
    if (process.env.NODE_ENV === 'development' && err.stack) {
        console.error(err.stack);
    }

    res.status(status).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Attach socket.io to app to use it in routes/controllers
app.set('io', io);

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Backward-compatible alias for older clients
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId} via joinRoom alias`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server with Socket.io is running on port ${PORT}`);
});
