const { startDatabase, stopDatabase } = require('../src/config/db');
const User = require('../src/models/user.model');
const { handler } = require('../netlify/functions/getUsers');

beforeAll(async () => {
    await startDatabase();
});

beforeEach(async () => {
    await User.deleteMany(); // Clear database before each test
});

afterAll(async () => {
    await stopDatabase(); // Ensure proper cleanup after all tests
});

describe('Netlify Function: Get Users', () => {
    it('should return a list of users', async () => {
        const users = [
            { name: 'Jane Doe', email: 'janedoe@example.com', age: 25 },
            { name: 'John Smith', email: 'johnsmith@example.com', age: 30 },
        ];

        await User.insertMany(users);

        const event = {
            httpMethod: 'GET',
            queryStringParameters: {}, // No filters applied
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(200);
        const result = JSON.parse(response.body);
        expect(result.length).toBe(users.length);
        expect(result[0].name).toBe('Jane Doe');
        expect(result[1].name).toBe('John Smith');
    });

    it('should return 500 for server error', async () => {
        // Simulate server error by throwing an exception in the handler
        jest.spyOn(User, 'find').mockImplementation(() => {
            throw new Error('Database error');
        });

        const event = {
            httpMethod: 'GET',
            queryStringParameters: {},
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.body).message).toBe('Internal Server Error: Database error');
    });
});
