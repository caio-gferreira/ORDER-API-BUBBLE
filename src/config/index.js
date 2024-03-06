const dbconfig = require('./dbconfig');
const env = require('./env');

module.exports = {
    Env: env,
    Database: {
        config: dbconfig,
    },
}
