const User = require('../models/userModel');
const Business = require('../models/businessModel');

const getStats = async (req, res) => {
    try {
        const stats = await Business.getStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPendingBusinesses = async (req, res) => {
    try {
        const businesses = await Business.getPending();
        res.json(businesses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyBusiness = async (req, res) => {
    try {
        await Business.verify(req.params.id);
        
        // Emit stats update to admin room
        const io = req.app.get('io');
        io.to('admin_room').emit('stats_update', { type: 'business_verified', id: req.params.id });
        
        res.json({ message: 'Business verified successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        await User.updateStatus(req.params.id, status);
        res.json({ message: 'User status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStats,
    getPendingBusinesses,
    verifyBusiness,
    getAllUsers,
    updateUserStatus
};
