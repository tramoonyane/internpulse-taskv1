const mongoose = require('mongoose');
const User = require('../../src/models/user.model');

exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'GET') {
            return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
        }

        const { id } = event.queryStringParameters;

        if (!id) {
            return { statusCode: 400, body: JSON.stringify({ message: 'ID is required' }) };
        }

        const user = await User.findById(id);
        if (!user) {
            return { statusCode: 404, body: JSON.stringify({ message: 'User not found' }) };
        }

        return { statusCode: 200, body: JSON.stringify(user) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: `Internal Server Error: ${error.message}` }) };
    }
};
