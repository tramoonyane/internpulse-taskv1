const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

async function startDatabase() {
    try {
        // Create an instance of MongoMemoryServer and start it
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();

        // Connect Mongoose to the in-memory MongoDB instance
        await mongoose.connect(uri, {
            useNewUrlParser: true, // Optional: safe to remove since it's deprecated
            useUnifiedTopology: true, // Optional: safe to remove since it's deprecated
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
        if (mongod) {
            await mongod.stop();
        }
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
