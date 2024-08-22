// src/app.js

require('dotenv').config();
const express = require('express');
const app = express();

// Remove or comment out the line that imports the deleted routes
// const userRoutes = require('./routes/user.routes'); 

app.use(express.json());

// If the route was used, comment out or remove the corresponding app.use line
// app.use('/api/users', userRoutes);

module.exports = app;
