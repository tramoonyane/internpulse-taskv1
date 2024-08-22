const User = require('../../src/models/user.model');

exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'GET') {
            return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
        }

        // Optional: Apply filters based on query parameters if needed
        const users = await User.find({});
        
        return { statusCode: 200, body: JSON.stringify(users) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: `Internal Server Error: ${error.message}` }) };
    }
};
