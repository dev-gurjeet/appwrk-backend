const { Sequelize } = require('sequelize');

require('dotenv').config(); // Add this at the top
console.log('Connecting to database...', process.env.DATABASE_NAME);
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: 'mysql'
});

module.exports = sequelize;