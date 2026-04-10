const User = require('../models/userModel');
const Business = require('../models/businessModel');
const Report = require('../models/reportModel');

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
        
        const io = req.app.get('io');
        io.to('admin_room').emit('log_activity', {
            action: `User #${req.params.id} account status updated to ${status} by Admin`,
            timestamp: new Date()
        });

        res.json({ message: 'User status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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

const getAllBusinesses = async (req, res) => {
    try {
        const businesses = await Business.getAll({ ...req.query, includeUnverified: true });
        res.json(businesses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBusinessStatus = async (req, res) => {
    try {
        const { status } = req.body; 
        // 1=Active, 2=Suspended
        await Business.updateStatus(req.params.id, status === 'Active' ? 1 : 2);
        
        const io = req.app.get('io');
        io.to('admin_room').emit('log_activity', {
            action: `Business #${req.params.id} manually ${status === 'Active' ? 'Activated' : 'Suspended'} by Admin`,
            timestamp: new Date()
        });

        res.json({ message: 'Business status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getReports = async (req, res) => {
    try {
        const reports = await Report.getAll();
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateReportStatus = async (req, res) => {
    try {
        const { status } = req.body;
        await Report.updateStatus(req.params.id, status);
        res.json({ message: `Report status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStats,
    getPendingBusinesses,
    verifyBusiness,
    getAllUsers,
    updateUserStatus,
    getAllBusinesses,
    updateBusinessStatus,
    getReports,
    updateReportStatus
};
