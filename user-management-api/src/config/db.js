const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const startDatabase = async () => {
    if (!mongoose.connection.readyState) {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        await mongoose.connect(uri, {
            // Mongoose v6+ no longer needs these options
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });

        console.log('Connected to the in-memory database successfully');
    }
};

const stopDatabase = async () => {
    if (mongoose.connection.readyState) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
        console.log('Disconnected from the in-memory database successfully');
    }
};

module.exports = { startDatabase, stopDatabase };
