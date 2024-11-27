require('dotenv').config();
module.exports = {
  development: {
    username: process.env.DB_USER || 'default_username',
    password: process.env.DB_PASSWORD || 'default_password',
    database: process.env.DB_NAME || 'default_database',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql', 
  },
  test: {
    username: process.env.DB_USER || 'default_username',
    password: process.env.DB_PASSWORD || 'default_password',
    database: process.env.DB_NAME || 'test_database',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
  },
};
