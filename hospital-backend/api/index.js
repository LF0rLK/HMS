/**
 * Vercel serverless entry point.
 * Vercel invokes this file as a serverless function.
 * It boots the Express app and exports it as the default handler.
 */
const app = require('../src/app');
const connectDB = require('../src/config/database');

// Connect once — connection is reused across warm invocations
connectDB();

module.exports = app;
