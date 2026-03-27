const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const { UnauthorizedError, TokenError, ForbiddenError } = require('../errors/authError');
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to validate JWT token in the Authorization header
const validateJWT = async(req, res, next) => {
    try {
        const headers = req.headers || {};
        const authHeader = headers.authorization;
        const token = authHeader?.split(' ')[1];

        if(!token) {
            throw new UnauthorizedError();
        }

        // Verify the token and decode it
        const decodedToken = jwt.verify(token, JWT_SECRET);

        if(!decodedToken) {
            throw new TokenError();
        }
        
        const user = await userRepository.findByEmailAndRole(decodedToken.email, decodedToken.role);

        if(!user) {
            throw new TokenError();
        }

        req.user = decodedToken;

        next();
    } catch(err) {
        next(err);
    }
};

// Middleware to validate user role for protected routes
const validateUserRole = (requiredRole) => (req, res, next) => {
    try {
        const userRole = req.user.role; 

        if(userRole !== requiredRole) {
            throw new ForbiddenError();
        }

        next();
    } catch(err) {
        next(err);
    }
};

module.exports = {
    validateJWT,
    validateUserRole
};