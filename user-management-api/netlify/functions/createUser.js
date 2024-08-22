// netlify/functions/createUser.js

const { startDatabase, stopDatabase } = require('../../src/config/db');
const User = require('../../src/models/user.model');

exports.handler = async (event) => {
    await startDatabase();
    try {
        if (event.httpMethod !== 'POST') {
            return { statusCode: 405, body: 'Method Not Allowed' };
        }

        const { name, email, age } = JSON.parse(event.body);

        if (!name || !email || (age === undefined)) {
            return { statusCode: 400, body: 'Bad Request' };
        }

        const user = new User({ name, email, age });
        await user.save();

        return { statusCode: 201, body: JSON.stringify(user) };
    } catch (error) {
        return { statusCode: 500, body: `Internal Server Error: ${error.message}` };
    } finally {
        await stopDatabase();
    }
};
