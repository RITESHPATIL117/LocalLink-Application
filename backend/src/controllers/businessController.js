const Business = require('../models/businessModel');
const Category = require('../models/categoryModel');
const Lead = require('../models/leadModel');

const getAllBusinesses = async (req, res, next) => {
    try {
        const businesses = await Business.getAll(req.query);
        res.json(businesses);
    } catch (err) {
        next(err);
    }
};

const getBusinessById = async (req, res, next) => {
    try {
        const business = await Business.getById(req.params.id);
        if (!business) {
            return res.status(404).json({ success: false, message: 'Business not found' });
        }
        res.json(business);
    } catch (err) {
        next(err);
    }
};

const getNearbyBusinesses = async (req, res, next) => {
    try {
        const businesses = await Business.getAll(req.query);
        res.json(businesses);
    } catch (err) {
        next(err);
    }
};

const getBusinessesByCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const businesses = await Business.getByCategory(categoryId);
        res.json(businesses);
    } catch (err) {
        next(err);
    }
};

const getOwnerBusinesses = async (req, res, next) => {
    try {
        const providerId = req.user.id;
        const businesses = await Business.getByProviderId(providerId);
        res.json(businesses);
    } catch (err) {
        next(err);
    }
};

const createBusiness = async (req, res, next) => {
    try {
        const providerId = req.user.id;
        let { categoryName, category_id, ...businessData } = req.body;

        // Resolve category_id from categoryName if missing
        if (!category_id && categoryName) {
            const cat = await Category.getByName(categoryName);
            if (cat) {
                category_id = cat.id;
            }
        }

        const businessId = await Business.create({ 
            ...businessData, 
            category_id, 
            provider_id: providerId 
        });
        
        if (req.body.images && Array.isArray(req.body.images)) {
            await Business.addImages(businessId, req.body.images);
        }

        // Real-time Admin Notification
        const io = req.app.get('io');
        io.to('admin_room').emit('new_business_registered', {
            id: businessId,
            name: businessData.name,
            providerName: req.user.name,
            category: categoryName || 'General Service',
            timestamp: new Date()
        });

        res.json({
            success: true,
            message: 'Business created successfully and pending verification',
            businessId
        });
    } catch (err) {
        next(err);
    }
};

const updateBusiness = async (req, res, next) => {
    try {
        const providerId = req.user.id;
        await Business.updateById(req.params.id, providerId, req.body);
        res.json({ success: true, message: 'Business updated successfully' });
    } catch (err) {
        next(err);
    }
};

const deleteBusiness = async (req, res, next) => {
    try {
        const providerId = req.user.id;
        await Business.deleteById(req.params.id, providerId);
        res.json({ success: true, message: 'Business deleted successfully' });
    } catch (err) {
        next(err);
    }
};

const getPublicStats = async (req, res, next) => {
    try {
        const stats = await Business.getStats();
        res.json({
            totalUsers: stats.totalUsers,
            totalBusinesses: stats.totalBusinesses,
            happyCustomers: Math.floor(stats.totalUsers * 0.95),
            avgRating: 4.8
        });
    } catch (err) {
        next(err);
    }
};

const getProviderStats = async (req, res, next) => {
    try {
        const providerId = req.user.id;
        const businesses = await Business.getByProviderId(providerId);
        const totalLeads = await Lead.countByProviderId(providerId);
        
        let totalViews = 0;
        let activeListings = businesses.filter(b => b.is_verified === 1).length;
        
        businesses.forEach(b => {
            totalViews += (b.views || 0);
        });

        res.json({
            totalViews,
            totalLeads, 
            activeListings,
            pendingListings: businesses.length - activeListings
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllBusinesses,
    getBusinessById,
    getNearbyBusinesses,
    getBusinessesByCategory,
    getOwnerBusinesses,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    getPublicStats,
    getProviderStats
};
