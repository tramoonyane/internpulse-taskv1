// netlify/functions/deleteUserByName.js

const { startDatabase, stopDatabase } = require('../../src/config/db');
const User = require('../../src/models/user.model');

exports.handler = async (event) => {
    await startDatabase();
    try {
        if (event.httpMethod !== 'DELETE') {
            return { statusCode: 405, body: 'Method Not Allowed' };
        }

        const { name } = event.queryStringParameters;

        if (!name) {
            return { statusCode: 400, body: 'Name is required' };
        }

        const user = await User.findOneAndDelete({ name });
        if (!user) {
            return { statusCode: 404, body: 'User not found' };
        }
        return { statusCode: 204, body: '' };
    } catch (error) {
        return { statusCode: 500, body: `Internal Server Error: ${error.message}` };
    } finally {
        await stopDatabase();
    }
};
