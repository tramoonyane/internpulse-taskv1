const mongoose = require('mongoose');
const User = require('../../src/models/user.model');

exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'DELETE') {
            return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
        }

        const { name } = event.queryStringParameters;

        if (!name) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Name is required' }) };
        }

        const result = await User.findOneAndDelete({ name });
        if (!result) {
            return { statusCode: 404, body: JSON.stringify({ message: 'User not found' }) };
        }

        return { statusCode: 200, body: JSON.stringify({ message: 'User deleted successfully' }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: `Internal Server Error: ${error.message}` }) };
    }
};
