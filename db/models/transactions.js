const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../client');

const Transactions = sequelize.define('transactions', {
  description: DataTypes.TEXT,
  credit: DataTypes.INTEGER,
  debit: DataTypes.INTEGER,
  balance: DataTypes.INTEGER,
  date: DataTypes.DATE,
});

(async () => {
  await sequelize.sync({ force: true });
  // Code here
})();

module.exports = Transactions;