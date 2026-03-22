const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { registerUserSchema, loginUserSchema } = require('../schemas/authSchema');
const { validateRequest } = require('../middleware/validateRequest');

// Routes for authentication
router.post("/register", validateRequest(registerUserSchema), registerUser);
router.post("/login", validateRequest(loginUserSchema), loginUser);


module.exports = router;