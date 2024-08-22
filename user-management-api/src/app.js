const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user.routes'); // Import the user routes

const app = express();
app.use(bodyParser.json());

// Use the user routes under the `/api/users` path
app.use('/api/users', userRoutes);

module.exports = app;
