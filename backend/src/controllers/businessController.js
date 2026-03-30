const Business = require('../models/businessModel');

const getAllBusinesses = async (req, res, next) => {
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
        // req.user is set by authMiddleware protect
        const providerId = req.user.id;
        const businesses = await Business.getByProviderId(providerId);
        res.json(businesses);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllBusinesses,
    getBusinessesByCategory,
    getOwnerBusinesses
};
