const Category = require('../models/categoryModel');

const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.getAll();
        res.json(categories);
    } catch (err) {
        next(err);
    }
};

const suggestCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const providerId = req.user.id;
        const requestId = await Category.createRequest(providerId, name);
        res.status(201).json({
            success: true,
            message: 'Category request submitted to Admin',
            requestId
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllCategories,
    suggestCategory
};
