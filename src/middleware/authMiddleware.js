const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to validate JWT token in the Authorization header
const validateJWT = async(req, res, next) => {
    try {
        const headers = req.headers || {};
        const authHeader = headers.authorization;
        const token = authHeader?.split(' ')[1];

        if(!token) {
            throw new Error();
        }

        // Verify the token and decode it
        const decodedToken = jwt.verify(token, JWT_SECRET);

        if(!decodedToken) {
            throw new Error();
        }

        req.user = decodedToken;

        // User information can be attached to the request object for use in subsequent middleware or route handlers
    } catch(err) {
        next(err);
    }
}


module.exports = { validateJWT };