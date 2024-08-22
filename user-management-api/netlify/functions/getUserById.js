// netlify/functions/getUserById.js

const { startDatabase, stopDatabase } = require('../../src/config/db');
const User = require('../../src/models/user.model');
const mongoose = require('mongoose');

exports.handler = async (event) => {
    await startDatabase();
    try {
        if (event.httpMethod !== 'GET') {
            return { statusCode: 405, body: 'Method Not Allowed' };
        }

        const { id } = event.queryStringParameters;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return { statusCode: 400, body: 'Invalid user ID' };
        }

        const user = await User.findById(id);
        if (!user) {
            return { statusCode: 404, body: 'User not found' };
        }
        return { statusCode: 200, body: JSON.stringify(user) };
    } catch (error) {
        return { statusCode: 500, body: `Internal Server Error: ${error.message}` };
    } finally {
        await stopDatabase();
    }
};
