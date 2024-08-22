const { handler } = require('../netlify/functions/createUser');
const mongoose = require('mongoose');
const { startDatabase, stopDatabase } = require('../src/config/db');
const User = require('../src/models/user.model');

beforeAll(async () => {
    await startDatabase();
});

beforeEach(async () => {
    await User.deleteMany(); // Clear database before each test
});

afterAll(async () => {
    await stopDatabase(); // Ensure proper cleanup after all tests
});

describe('Netlify Function: Create User', () => {
    it('should create a new user', async () => {
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({ name: 'John Doe', email: 'johndoe@example.com', age: 30 }),
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(201);
        const user = JSON.parse(response.body);
        expect(user.name).toBe('John Doe');
        expect(user.email).toBe('johndoe@example.com');
        expect(user.age).toBe(30);

        const userInDB = await User.findOne({ email: 'johndoe@example.com' });
        expect(userInDB).not.toBeNull();
    });

    it('should return 400 for missing fields', async () => {
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({ name: 'John Doe', email: 'johndoe@example.com' }), // missing age
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(400);
        expect(response.body).toBe('Bad Request');
    });

    it('should return 405 for non-POST methods', async () => {
        const event = {
            httpMethod: 'GET',
            body: JSON.stringify({ name: 'John Doe', email: 'johndoe@example.com', age: 30 }),
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(405);
        expect(response.body).toBe('Method Not Allowed');
    });
});
