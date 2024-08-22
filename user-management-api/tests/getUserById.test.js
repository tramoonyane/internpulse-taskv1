const mongoose = require('mongoose');
const { startDatabase, stopDatabase } = require('../src/config/db');
const User = require('../src/models/user.model');
const { handler } = require('../netlify/functions/getUserById');

beforeAll(async () => {
    await startDatabase();
});

beforeEach(async () => {
    await User.deleteMany(); // Clear database before each test
});

afterAll(async () => {
    await stopDatabase(); // Ensure proper cleanup after all tests
});

describe('Netlify Function: Get User By ID', () => {
    it('should return a user by ID', async () => {
        const user = await new User({ name: 'Jane Doe', email: 'janedoe@example.com', age: 25 }).save();

        const event = {
            httpMethod: 'GET',
            queryStringParameters: { id: user._id.toString() },
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(200);
        const result = JSON.parse(response.body);
        expect(result.name).toBe('Jane Doe');
        expect(result.email).toBe('janedoe@example.com');
        expect(result.age).toBe(25);
    });

    it('should return 400 for missing ID', async () => {
        const event = {
            httpMethod: 'GET',
            queryStringParameters: {},
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body).message).toBe('ID is required');
    });

    it('should return 404 for non-existing user', async () => {
        // Create a new ObjectId instance
        const nonExistingId = new mongoose.Types.ObjectId().toString();

        const event = {
            httpMethod: 'GET',
            queryStringParameters: { id: nonExistingId },
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.body).message).toBe('User not found');
    });
});
