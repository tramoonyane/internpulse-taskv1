const mongoose = require('mongoose');
const User = require('../../src/models/user.model');

exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'PUT') {
            return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
        }

        const { name } = event.queryStringParameters;
        const updates = JSON.parse(event.body);

        if (!name) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Name is required' }) };
        }

        if (!Object.keys(updates).length) {
            return { statusCode: 400, body: JSON.stringify({ message: 'No updates provided' }) };
        }

        const user = await User.findOneAndUpdate({ name }, updates, { new: true });
        if (!user) {
            return { statusCode: 404, body: JSON.stringify({ message: 'User not found' }) };
        }

        return { statusCode: 200, body: JSON.stringify(user) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: `Internal Server Error: ${error.message}` }) };
    }
};
