const defaultConfig = require('./src/server/ormconfig.json');

module.exports = {
  ...defaultConfig,
  host: process.env.DATABASE_HOST || defaultConfig.host,
  port: process.env.DATABASE_PORT || defaultConfig.port,
  username: process.env.DATABASE_USER || defaultConfig.username,
  password: process.env.DATABASE_PASS || defaultConfig.password,
  database: process.env.DATABASE_NAME || defaultConfig.database,
};
