const Review = require('../models/reviewModel');

const createReview = async (req, res, next) => {
    try {
        const { business_id, rating, comment } = req.body;
        const user_id = req.user.id;

        const reviewId = await Review.create({ user_id, business_id, rating, comment });

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: { id: reviewId }
        });
    } catch (err) {
        next(err);
    }
};

const getBusinessReviews = async (req, res, next) => {
    try {
        const { businessId } = req.params;
        const reviews = await Review.getByBusiness(businessId);

        res.json(reviews);
    } catch (err) {
        next(err);
    }
};

const getTopReviews = async (req, res, next) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 6;
        const reviews = await Review.getTopReviews(limit);
        res.json(reviews);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createReview,
    getBusinessReviews,
    getTopReviews
};
