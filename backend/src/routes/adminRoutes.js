const express = require('express');
const router = express.Router();
const { 
    getStats, 
    getPendingBusinesses, 
    verifyBusiness, 
    getAllUsers, 
    updateUserStatus,
    getAllBusinesses,
    updateBusinessStatus,
    getReports,
    updateReportStatus
} = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/stats', getStats);
router.get('/pending-businesses', getPendingBusinesses);
router.patch('/business/:id/verify', verifyBusiness);
router.get('/users', getAllUsers);
router.patch('/user/:id/status', updateUserStatus);

// Elite Admin Upgrades
router.get('/businesses', getAllBusinesses);
router.patch('/business/:id/status', updateBusinessStatus);
router.get('/reports', getReports);
router.patch('/report/:id/status', updateReportStatus);

module.exports = router;
