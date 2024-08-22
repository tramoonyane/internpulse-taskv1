// netlify/functions/getUsers.js

const { startDatabase, stopDatabase } = require('../../src/config/db');
const User = require('../../src/models/user.model');

exports.handler = async (event) => {
    await startDatabase();
    try {
        if (event.httpMethod !== 'GET') {
            return { statusCode: 405, body: 'Method Not Allowed' };
        }

        const users = await User.find({});
        return { statusCode: 200, body: JSON.stringify(users) };
    } catch (error) {
        return { statusCode: 500, body: `Internal Server Error: ${error.message}` };
    } finally {
        await stopDatabase();
    }
};
