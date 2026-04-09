const Favorite = require('../models/favoriteModel');
const { sendSuccess } = require('../utils/apiResponse');

const getFavorites = async (req, res, next) => {
    try {
        const rows = await Favorite.listByUser(req.user.id);
        return sendSuccess(res, rows);
    } catch (err) {
        next(err);
    }
};

const addFavorite = async (req, res, next) => {
    try {
        const { business_id } = req.body;
        await Favorite.add(req.user.id, business_id);
        return sendSuccess(res, null, 'Added to favorites', 201);
    } catch (err) {
        next(err);
    }
};

const removeFavorite = async (req, res, next) => {
    try {
        const businessId = req.params.businessId;
        await Favorite.remove(req.user.id, businessId);
        return sendSuccess(res, null, 'Removed from favorites');
    } catch (err) {
        next(err);
    }
};

const toggleFavorite = async (req, res, next) => {
    try {
        const { business_id } = req.body;
        const exists = await Favorite.exists(req.user.id, business_id);
        if (exists) {
            await Favorite.remove(req.user.id, business_id);
            return sendSuccess(res, { isFavorite: false }, 'Removed from favorites');
        }
        await Favorite.add(req.user.id, business_id);
        return sendSuccess(res, { isFavorite: true }, 'Added to favorites');
    } catch (err) {
        next(err);
    }
};

module.exports = { getFavorites, addFavorite, removeFavorite, toggleFavorite };
