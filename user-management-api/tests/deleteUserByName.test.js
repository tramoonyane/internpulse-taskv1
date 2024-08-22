const mongoose = require('mongoose');
const { startDatabase, stopDatabase } = require('../src/config/db');
const User = require('../src/models/user.model');
const { handler } = require('../netlify/functions/deleteUserByName');

beforeAll(async () => {
    await startDatabase();
});

beforeEach(async () => {
    await User.deleteMany(); // Clear database before each test
});

afterAll(async () => {
    await stopDatabase(); // Ensure proper cleanup after all tests
});

describe('Netlify Function: Delete User By Name', () => {
    it('should delete an existing user by name', async () => {
        const user = await new User({ name: 'Jane Doe', email: 'janedoe@example.com', age: 25 }).save();

        const event = {
            httpMethod: 'DELETE',
            queryStringParameters: { name: user.name },
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(200);
        const result = JSON.parse(response.body);
        expect(result.message).toBe('User deleted successfully');

        const deletedUser = await User.findOne({ name: user.name });
        expect(deletedUser).toBeNull();
    });

    it('should return 400 for missing name', async () => {
        const event = {
            httpMethod: 'DELETE',
            queryStringParameters: {},
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body).message).toBe('Name is required');
    });

    it('should return 404 for non-existing user', async () => {
        const event = {
            httpMethod: 'DELETE',
            queryStringParameters: { name: 'NonExistingName' },
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.body).message).toBe('User not found');
    });
});
