const mongoose = require('mongoose');
const { startDatabase, stopDatabase } = require('../src/config/db');
const User = require('../src/models/user.model');
const { handler } = require('../netlify/functions/updateUserByName');

beforeAll(async () => {
    await startDatabase();
});

beforeEach(async () => {
    await User.deleteMany(); // Clear database before each test
});

afterAll(async () => {
    await stopDatabase(); // Ensure proper cleanup after all tests
});

describe('Netlify Function: Update User By Name', () => {
    it('should update an existing user by name', async () => {
        const user = await new User({ name: 'John Doe', email: 'johndoe@example.com', age: 30 }).save();
        
        const event = {
            httpMethod: 'PUT',
            queryStringParameters: { name: 'John Doe' },
            body: JSON.stringify({ age: 31 }),
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(200);
        const updatedUser = JSON.parse(response.body);
        expect(updatedUser.name).toBe('John Doe');
        expect(updatedUser.age).toBe(31);
    });

    it('should return 400 for missing user name', async () => {
        const event = {
            httpMethod: 'PUT',
            queryStringParameters: {},
            body: JSON.stringify({ age: 31 }),
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body).message).toBe('Name is required');
    });

    it('should return 400 for missing updates', async () => {
        const user = await new User({ name: 'John Doe', email: 'johndoe@example.com', age: 30 }).save();
        
        const event = {
            httpMethod: 'PUT',
            queryStringParameters: { name: 'John Doe' },
            body: JSON.stringify({}),
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body).message).toBe('No updates provided');
    });

    it('should return 404 for non-existing user', async () => {
        const event = {
            httpMethod: 'PUT',
            queryStringParameters: { name: 'Nonexistent User' },
            body: JSON.stringify({ age: 31 }),
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.body).message).toBe('User not found');
    });
});
