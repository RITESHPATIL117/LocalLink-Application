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

const getAllBusinesses = async (req, res) => {
    try {
        const businesses = await Business.getAll(req.query);
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
        // Return structured reports (Mocked for futuristic UI until DB table is defined)
        const reports = [
            { id: '1', type: 'Flagged Review', entity: '"Fake Service" on SuperFast Plumbing', reporter: 'Priya Desai', date: '2 hours ago', status: 'Pending', severity: 'High' },
            { id: '2', type: 'Suspicious Listing', entity: 'Metro Electricians', reporter: 'Amit Sharma', date: '5 hours ago', status: 'Resolved', severity: 'Low' },
            { id: '3', type: 'User Conduct', entity: '@vikram.s', reporter: 'System Automod', date: '1 day ago', status: 'Pending', severity: 'Critical' },
            { id: '4', type: 'Payment Dispute', entity: 'Leads-2026-X', reporter: 'Quick Fix Home', date: 'Just now', status: 'Pending', severity: 'High' }
        ];
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateReportStatus = async (req, res) => {
    try {
        const { status } = req.body;
        // Logic for updating report status in DB would happen here
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
