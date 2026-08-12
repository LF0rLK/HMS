# Hospital Management System

This project is a full-stack hospital management system built with a Next.js frontend and an Express + Sequelize backend. It is designed to support patient, doctor, receptionist, pharmacist, lab-staff, and admin workflows through a role-based dashboard.

## Project structure

- `hospital/` — frontend application (Next.js / React UI)
- `hospital-backend/` — backend API (Express server + SQLite database)

### Frontend layout

- `hospital/src/app/` — route-based pages for login, registration, and dashboard views
- `hospital/src/context/` — Auth and app state management
- `hospital/src/lib/api/` — API helpers for each module
- `hospital/src/lib/hooks/` — data-fetching hooks
- `hospital/src/lib/utils/` — role checks, constants, formatting helpers
- `hospital/src/components/` — reusable UI components

### Backend layout

- `hospital-backend/src/routes/` — route registration for auth, patients, appointments, doctors, billing, lab tests, pharmacy
- `hospital-backend/src/controllers/` — business logic for each domain
- `hospital-backend/src/middleware/` — authentication and role-based access checks
- `hospital-backend/src/models/` — Sequelize models
- `hospital-backend/src/config/` — database, environment, and CORS configuration
- `hospital-backend/src/seeders/` — seed data generation for demo users, doctors, and sample records

---

## How the system works

### 1. User authentication flow

The login flow starts in the frontend:

1. User enters email and password on the login page.
2. The frontend calls the backend login endpoint at `/api/auth/login`.
3. The backend verifies the credentials against the `User` table.
4. If valid, it creates a JWT token using the secret defined in the backend environment.
5. The frontend stores the token in localStorage and redirects the user to their dashboard based on role.

The frontend `AuthContext` handles this lifecycle:

- It reads the saved token and user from localStorage when the app loads.
- It stores the session after login or registration.
- It clears the session when the token expires or a user logs out.

The API client automatically adds the Authorization header with the bearer token for each request.

### 2. Role-based access control

Each user has a role stored in the database:

- patient
- doctor
- receptionist
- pharmacist
- lab-staff
- admin

The backend uses `authMiddleware` to validate the JWT and attach the authenticated user to the request. Then route handlers can restrict access using `roleMiddleware`, which checks whether the user has one of the allowed roles.

On the frontend, the route permissions are defined in `permissions.js`. For example:

- patients can access `/patient/*`
- doctors can access `/doctor/*`
- receptionists manage `/receptionist/*`
- admin has access to multiple sections

Users are redirected to the correct dashboard home route after login, based on their role.

### 3. Frontend and backend communication

The frontend API base is configured in `hospital/src/lib/api/axios.js`:

- It reads `NEXT_PUBLIC_API_URL`
- If the variable is missing, it falls back to `http://localhost:5000`
- It automatically appends `/api` if needed

Requests are therefore made like:

- `/auth/login`
- `/patients`
- `/appointments`
- `/doctors`
- `/lab-tests`
- `/pharmacy`

The backend mounts all routes under `/api`, as defined in `hospital-backend/src/routes/index.js`.

### 4. Core business modules

#### Authentication

- `POST /api/auth/register` — create a new user and create a matching patient or doctor profile
- `POST /api/auth/login` — verify credentials and return a JWT
- `GET /api/auth/me` — return the current logged-in user and their profile

#### Patients

- `GET /api/patients` — list patients
- `GET /api/patients/:id` — fetch a patient profile
- `PUT /api/patients/:id` — update patient details

#### Appointments

- `GET /api/appointments` — fetch appointment records
- `POST /api/appointments` — create an appointment
- `PUT /api/appointments/:id/status` — update appointment status

#### Doctors

- `GET /api/doctors` — list doctors
- `GET /api/doctors/department/:department` — list doctors by department
- `GET /api/doctors/:id` — get doctor details

#### Billing

- `GET /api/billing` — fetch bills
- `POST /api/billing` — create a bill
- `PUT /api/billing/:id/pay` — mark a bill as paid

#### Lab tests

- `GET /api/lab-tests` — list lab test requests
- `POST /api/lab-tests` — add a lab test request
- `PUT /api/lab-tests/:id/complete` — mark a lab test as complete

#### Pharmacy

- `GET /api/pharmacy/medicines` — list medicine stock
- `POST /api/pharmacy/medicines` — add or update inventory
- `GET /api/pharmacy/prescriptions` — list prescriptions
- `POST /api/pharmacy/prescriptions` — create a prescription
- `PUT /api/pharmacy/prescriptions/:id/dispense` — mark prescription as dispensed

---

## Database and data model

The backend uses SQLite with Sequelize.

### Main models

- `User` — auth credentials, role, and name
- `Patient` — patient data and profile
- `Doctor` — doctor profile and specialization
- `Appointment` — patient/doctor appointment data and status
- `Prescription` — issued medications and dispensing state
- `LabTest` — diagnostic requests and completion status
- `Bill` — patient billing records
- `Medicine` — stock data for the pharmacy

Database initialization is handled in `hospital-backend/src/config/database.js`:

- authenticate database connection
- load all models
- call `sequelize.sync()` to create/update the tables automatically

This means the app can boot with a SQLite database file and create tables without a separate migration step during development.

---

## How the app is initialized

### Backend startup

The backend loads its environment configuration from `.env` using `dotenv`.

The environment config file sets values such as:

- `PORT` — API port, default `5000`
- `JWT_SECRET` — secret for signing JWTs
- `JWT_EXPIRE` — token expiry such as `7d`
- `FRONTEND_URL` — allowed frontend origin for CORS in production
- `SQLITE_STORAGE` — the SQLite file location

The backend also uses CORS configuration from `hospital-backend/src/config/cors.js`.

### Frontend startup

The frontend app reads environment variables like:

- `NEXT_PUBLIC_API_URL` — full backend base URL, such as `http://localhost:5000/api`

This variable is needed so the UI can talk to the backend correctly.

---

## Local development setup

### 1. Backend

From the `hospital-backend/` folder:

```bash
npm install
cp .env.example .env
```

Example `.env`:

```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
SQLITE_STORAGE=hospital.sqlite
NODE_ENV=development
```

Then start the backend:

```bash
npm run dev
```

If your backend project uses a production script instead, the equivalent is commonly:

```bash
npm start
```

### 2. Frontend

From the `hospital/` folder:

```bash
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Then start the frontend:

```bash
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`

---

## Production deployment

### Option A: Deploy frontend to Vercel

1. Import the `hospital/` app into Vercel.
2. Set the framework to Next.js.
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api`
4. Deploy.

### Option B: Deploy backend to Render, Railway, or similar

1. Create a Node.js service from the `hospital-backend/` project.
2. Set environment variables:
   - `PORT=5000`
   - `JWT_SECRET=your-production-secret`
   - `JWT_EXPIRE=7d`
   - `FRONTEND_URL=https://your-frontend-domain.com`
   - `NODE_ENV=production`
3. Start the server with the app’s Node command.
4. Make sure the deployed backend is reachable from the frontend.

### Recommended production setup

- Frontend: Vercel
- Backend: Render or Railway
- Database: SQLite file in the backend service directory for small deployments, or a real production database for scale

### Production CORS configuration

The backend allows only the configured `FRONTEND_URL` in production. If the frontend is served from a different domain, update the environment variable to match the deployed frontend origin.

---

## Operational flow by user role

### Patient

- Register account
- Sign in
- View profile
- Book appointment
- Check prescriptions
- View lab tests and bills

### Doctor

- Sign in and access dashboard
- View assigned appointments
- Manage patient records
- Create prescriptions
- Request lab tests

### Receptionist

- Register patients
- Search patient records
- Schedule appointments
- Create bills and invoice documents

### Pharmacist

- Review prescriptions
- Check medicine inventory
- Update stock
- Dispense medicines

### Lab staff

- Review queued lab tests
- Mark tests as complete
- Share results or update statuses

### Admin

- Manage users
- Manage doctors and staff records
- Review reports and dashboard data
- Configure hospital system access

---

## Notes for maintainers

- The backend uses JWT-based authentication, so the token must be preserved on the frontend.
- The current database is SQLite, which is ideal for local development and small deployments.
- The app is built around modular API endpoints; new features can be added by creating controllers, routes, and models in the same pattern.
- The project uses a role-based frontend structure, so new roles should be added both in the backend and in the `permissions.js` mapping.

---

## Quick summary

This project is a role-based hospital management system where:

- the frontend handles the UI, auth session, and dashboard navigation;
- the backend protects resources with JWT and role checks;
- Sequelize models store hospital data in SQLite;
- the app is deployed as two separate services: frontend + backend.

For local work, run both apps together: the frontend on port 3000 and the backend on port 5000.
