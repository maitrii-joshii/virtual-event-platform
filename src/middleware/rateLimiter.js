const rateLimit = require('express-rate-limit');

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: "Too many requests, please try again after 15 minutes"
    }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: "Too many requests, please try again after 15 minutes"
    }
});


module.exports = {
    globalLimiter,
    authLimiter
};