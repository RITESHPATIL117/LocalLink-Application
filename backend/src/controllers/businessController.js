const Business = require('../models/businessModel');

const getAllBusinesses = async (req, res, next) => {
    try {
        const businesses = await Business.getAll();
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

module.exports = {
    getAllBusinesses,
    getBusinessesByCategory
};
