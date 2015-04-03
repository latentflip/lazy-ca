// Update with your config settings.
var Config = require('getconfig');

module.exports = {
  development: {
    client: 'pg',
    connection: Config.db.connection
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  },
};
