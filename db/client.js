const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('transaction_app', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;