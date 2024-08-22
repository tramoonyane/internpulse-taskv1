// src/config/db.js

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod;

async function startDatabase() {
    try {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to the in-memory database successfully');
    } catch (error) {
        console.error('Failed to connect to the database', error);
        throw error;
    }
}

async function stopDatabase() {
    try {
        await mongoose.disconnect();
        await mongod.stop();
        console.log('Disconnected from the in-memory database successfully');
    } catch (error) {
        console.error('Failed to disconnect from the database', error);
        throw error;
    }
}

module.exports = {
    startDatabase,
    stopDatabase,
};
