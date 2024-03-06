require('dotenv').config();

const { env } = process;

module.exports = {
    SERVER: {
        PORT: env.SERVER_PORT,
    },
    AUTH: {
        KEY: env.AUTHORIZATION_KEY,
    },
};
