const path = require('path');
const { Sequelize } = require('sequelize');
const { SQLITE_STORAGE, NODE_ENV } = require('./env');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../../', SQLITE_STORAGE),
  logging: NODE_ENV === 'development' ? console.log : false,
});

module.exports = sequelize;
