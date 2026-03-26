const express = require('express');
const router = express.Router();
const { 
    getStats, 
    getPendingBusinesses, 
    verifyBusiness, 
    getAllUsers, 
    updateUserStatus 
} = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/stats', getStats);
router.get('/pending-businesses', getPendingBusinesses);
router.patch('/business/:id/verify', verifyBusiness);
router.get('/users', getAllUsers);
router.patch('/user/:id/status', updateUserStatus);

module.exports = router;
