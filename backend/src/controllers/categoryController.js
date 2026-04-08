const Category = require('../models/categoryModel');

const getAllCategories = async (req, res, next) => {
    try {
        const { tree } = req.query;
        const categories = await Category.getAll(tree === 'true');
        res.json(categories);
    } catch (err) {
        next(err);
    }
};

const getSubcategories = async (req, res, next) => {
    try {
        const { parentId } = req.params;
        const subcategories = await Category.getSubcategories(parentId);
        res.json(subcategories);
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
    getSubcategories,
    suggestCategory
};
