const express = require('express');
const router = express.Router();

// Routes for user management
router.post("/", register);
router.post("/login", login);


module.exports = router;