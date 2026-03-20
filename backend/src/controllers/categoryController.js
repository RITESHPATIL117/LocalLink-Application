const Category = require('../models/categoryModel');

const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.getAll();
        res.json(categories);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllCategories
};
