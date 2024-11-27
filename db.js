const { Sequelize } = require('sequelize');
require('dotenv').config();  


const sequelize = new Sequelize(
  process.env.DB_NAME,          
  process.env.DB_USER,          
  process.env.DB_PASSWORD,      
  {
    host: process.env.DB_HOST,  
    port: process.env.DB_PORT,  
    dialect: 'mysql',           
    socketPath: process.env.DB_SOCKET_PATH || null, 
    logging: false,            
  }
);

module.exports = sequelize;
