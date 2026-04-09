const { validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    return sendError(res, 'Validation failed', 422, errors.array());
};

module.exports = { validateRequest };
