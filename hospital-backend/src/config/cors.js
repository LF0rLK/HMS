/**
 * CORS configuration.
 *
 * In development:  all origins are allowed (wildcard).
 * In production:   only the URL in FRONTEND_URL env var is allowed.
 *                  Set FRONTEND_URL in Vercel environment variables to your
 *                  deployed frontend URL, e.g. https://one-hms.vercel.app
 */
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:3000']
  : ['http://localhost:3000'];

module.exports = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin '${origin}' is not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
