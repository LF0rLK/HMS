const app = require('./src/app');
const { connectDB } = require('./src/config/database');
const { PORT } = require('./src/config/env');

// Connect to SQLite
connectDB();

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});
