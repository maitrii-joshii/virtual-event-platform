require('dotenv').config();
const express = require('express');
const app = express();
const usersRoute = require('./routes/usersRoute');

//Inbuilt middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// User routes
app.use("/users", usersRoute);

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