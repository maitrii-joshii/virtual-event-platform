require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const errorHandler = require('./middleware/errorHandler');
const { globalLimiter, authLimiter } = require('./middleware/rateLimiter');

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(globalLimiter);



// Auth routes
app.use("/api/v1/auth", authLimiter, authRoutes);

// Event routes
app.use("/api/v1/events", eventRoutes);

// Registration routes
app.use("/api/v1/", registrationRoutes);

// Error handling middleware
app.use(errorHandler);

// Health check route
app.get("/", (req, res) => {
    res.send("API is running");
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Server is running",
        timeStamp: new Date().toISOString()
    });
});


module.exports = app;