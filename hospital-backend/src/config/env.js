const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  SQLITE_STORAGE: process.env.SQLITE_STORAGE || path.resolve(__dirname, '../../hospital.sqlite'),
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 5242880
};
