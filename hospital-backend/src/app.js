const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize } = require('./config/database');
const routes = require('./routes');
const errorMiddleware = require('./middleware/errorMiddleware');
const corsConfig = require('./config/cors');

const app = express();
const START_TIME = Date.now();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors(corsConfig));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Root status page ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - START_TIME) / 1000);
  const dbStatus = sequelize ? sequelize.getDialect() : 'unknown';

  res.status(200).json({
    name: 'ONE Hospital Management System — API Server',
    status: 'online',
    uptime: `${uptimeSeconds}s`,
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: [
        { method: 'POST', path: '/api/auth/register', description: 'Register a new user' },
        { method: 'POST', path: '/api/auth/login', description: 'Login and receive JWT' },
        { method: 'GET', path: '/api/auth/me', description: 'Get current authenticated user (auth required)' },
      ],
      patients: [
        { method: 'GET', path: '/api/patients', description: 'List all patients (admin/doctor/receptionist/pharmacist)' },
        { method: 'GET', path: '/api/patients/:id', description: 'Get patient by ID' },
        { method: 'PUT', path: '/api/patients/:id', description: 'Update patient profile' },
      ],
      doctors: [
        { method: 'GET', path: '/api/doctors', description: 'List all doctors' },
        { method: 'GET', path: '/api/doctors/department/:dept', description: 'Get doctors by department' },
        { method: 'GET', path: '/api/doctors/:id', description: 'Get doctor by ID' },
      ],
      appointments: [
        { method: 'GET', path: '/api/appointments', description: 'List appointments (filtered by role)' },
        { method: 'POST', path: '/api/appointments', description: 'Book a new appointment' },
        { method: 'GET', path: '/api/appointments/:id', description: 'Get appointment by ID' },
        { method: 'PUT', path: '/api/appointments/:id/status', description: 'Update appointment status' },
      ],
      billing: [
        { method: 'GET', path: '/api/billing', description: 'List bills (filtered by role)' },
        { method: 'POST', path: '/api/billing', description: 'Create a new bill' },
        { method: 'GET', path: '/api/billing/:id', description: 'Get bill by ID' },
        { method: 'PUT', path: '/api/billing/:id/pay', description: 'Mark bill as paid' },
      ],
      labTests: [
        { method: 'GET', path: '/api/lab-tests', description: 'List lab tests (filtered by role)' },
        { method: 'POST', path: '/api/lab-tests', description: 'Request a new lab test' },
        { method: 'PUT', path: '/api/lab-tests/:id/complete', description: 'Submit lab test results' },
      ],
      pharmacy: [
        { method: 'GET', path: '/api/pharmacy/medicines', description: 'List medicine inventory' },
        { method: 'POST', path: '/api/pharmacy/medicines', description: 'Add new medicine to inventory' },
        { method: 'PUT', path: '/api/pharmacy/medicines/:id/stock', description: 'Update medicine stock' },
        { method: 'GET', path: '/api/pharmacy/prescriptions', description: 'List prescriptions' },
        { method: 'POST', path: '/api/pharmacy/prescriptions', description: 'Create a prescription' },
        { method: 'PUT', path: '/api/pharmacy/prescriptions/:id/dispense', description: 'Mark prescription as dispensed' },
      ],
    },
  });
});

// ─── API routes ───────────────────────────────────────────────────────────────
// Mounted at /api (canonical) AND at / (fallback for when NEXT_PUBLIC_API_URL
// is set to the bare domain without /api suffix).
// The root GET / status handler above is registered first and takes priority.
app.use('/api', routes);
app.use('/', routes);

// ─── Error handling ───────────────────────────────────────────────────────────
app.use(errorMiddleware);

module.exports = app;
