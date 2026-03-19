require('dotenv').config();
const express = require('express');
const app = express();

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Server is running",
        timeStamp: new Date().toISOString()
    });
});


module.exports = app;