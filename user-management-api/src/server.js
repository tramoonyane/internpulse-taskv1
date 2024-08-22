// src/server.js

require('dotenv').config();
const app = require('./app');
const { startDatabase, stopDatabase } = require('./config/db');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await startDatabase();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server', error);
        process.exit(1);
    }
};

startServer();
