const User = require('../../src/models/user.model');
const mongoose = require('mongoose');

exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'PUT') {
            return { statusCode: 405, body: 'Method Not Allowed' };
        }

        const { id } = event.queryStringParameters;
        const updates = JSON.parse(event.body);

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return { statusCode: 400, body: 'Invalid user ID' };
        }

        if (!Object.keys(updates).length) {
            return { statusCode: 400, body: 'No updates provided' };
        }

        const user = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!user) {
            return { statusCode: 404, body: 'User not found' };
        }
        return { statusCode: 200, body: JSON.stringify(user) };
    } catch (error) {
        return { statusCode: 500, body: `Internal Server Error: ${error.message}` };
    }
};
