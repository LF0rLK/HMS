const sequelize = require('./sequelize');

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`SQLite connected at ${sequelize.options.storage}`);

    require('../models');
    await sequelize.sync();
    console.log('SQLite database synchronized');
  } catch (error) {
    console.error('SQLite connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
