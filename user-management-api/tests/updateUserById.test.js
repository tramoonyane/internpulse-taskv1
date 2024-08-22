const mongoose = require('mongoose'); // Import mongoose
const { startDatabase, stopDatabase } = require('../src/config/db');
const User = require('../src/models/user.model');
const { handler } = require('../netlify/functions/updateUserById');

beforeAll(async () => {
    await startDatabase();
});

beforeEach(async () => {
    await User.deleteMany(); // Clear database before each test
});

afterAll(async () => {
    await stopDatabase(); // Ensure proper cleanup after all tests
});

describe('Netlify Function: Update User By ID', () => {
    it('should update an existing user by ID', async () => {
        const user = await new User({ name: 'John Doe', email: 'johndoe@example.com', age: 30 }).save();
        
        const event = {
            httpMethod: 'PUT',
            queryStringParameters: { id: user._id.toString() },
            body: JSON.stringify({ name: 'John Updated', age: 31 }),
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(200);
        const updatedUser = JSON.parse(response.body);
        expect(updatedUser.name).toBe('John Updated');
        expect(updatedUser.age).toBe(31);
    });

    it('should return 400 for invalid user ID', async () => {
        const event = {
            httpMethod: 'PUT',
            queryStringParameters: { id: 'invalid-id' },
            body: JSON.stringify({ name: 'John Updated', age: 31 }),
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(400);
        expect(response.body).toBe('Invalid user ID');
    });

    it('should return 400 for missing updates', async () => {
        const user = await new User({ name: 'John Doe', email: 'johndoe@example.com', age: 30 }).save();
        
        const event = {
            httpMethod: 'PUT',
            queryStringParameters: { id: user._id.toString() },
            body: JSON.stringify({}),
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(400);
        expect(response.body).toBe('No updates provided');
    });

    it('should return 404 for non-existing user', async () => {
        const event = {
            httpMethod: 'PUT',
            queryStringParameters: { id: new mongoose.Types.ObjectId() },
            body: JSON.stringify({ name: 'Nonexistent User' }),
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(404);
        expect(response.body).toBe('User not found');
    });
});
