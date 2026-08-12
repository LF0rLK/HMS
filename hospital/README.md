# ONE Hospital Management System

This repository contains the full-stack hospital management system built with:

- **Frontend:** `Next.js 16` with the App Router, React, and client-side authentication flow
- **Backend:** `Express` + `Sequelize` + `SQLite`
- **Auth:** JWT-based login and role-based access control
- **API client:** Axios configured for `NEXT_PUBLIC_API_URL`

---

## Project layout

```
project-root/
  hospital/             # Frontend application
    package.json
    next.config.ts
    src/
      app/
      components/
      context/
      lib/
      styles/
    .env.example
  hospital-backend/      # API server + database
    package.json
    server.js
    src/
      app.js
      config/
      controllers/
      middleware/
      models/
      routes/
      seeders/
    .env.example
```

---

## How it works

### Frontend (`hospital/`)

- `src/app/layout.tsx` is the root layout.
- `AuthProvider`, `ThemeProvider`, and `LoadingProvider` wrap the app and provide global state.
- `src/lib/api/axios.js` creates a shared Axios instance that
  - sets `baseURL` from `NEXT_PUBLIC_API_URL`
  - appends `/api` if needed
  - attaches the JWT token from `localStorage`
  - redirects to `/login` on `401` responses
- Role-based dashboard pages are served under `src/app/(dashboard)/...`.
- UI components are in `src/components/` and reusable app logic lives in `src/lib/`.
- Protected pages and auth status are managed using `AuthContext` and `ProtectedRoute`.

### Backend (`hospital-backend/`)

- `server.js` starts the Express server and connects to SQLite.
- `src/app.js` configures middleware and mounts routing:
  - `helmet`, `cors`, `morgan`, JSON parsing
  - `/api` routes from `src/routes/index.js`
- `src/config/database.js` and `src/config/sequelize.js` configure Sequelize to use SQLite.
- `src/config/env.js` reads environment variables for port, JWT settings, SQLite storage location, and file size limits.
- Models are defined in `src/models/` using Sequelize.
- Controllers handle CRUD logic for patients, doctors, appointments, billing, lab tests, pharmacy, and auth.
- Middleware includes auth validation and role checks.
- `src/seeders/index.js` initializes or resets the database with sample data.

---

## Development setup

### Prerequisites

- Node.js `>= 20`
- npm
- Git (optional)

### Backend setup

```bash
cd hospital-backend
npm install
cp .env.example .env
```

Edit `.env` if needed. For most local development the defaults are:

```env
NODE_ENV=development
PORT=5000
SQLITE_STORAGE=./hospital.sqlite
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
MAX_FILE_SIZE=5242880
```

Start the backend:

```bash
npm run dev
```

Seed the database if you want initial sample data:

```bash
npm run seed
```

### Frontend setup

```bash
cd hospital
npm install
cp .env.example .env.local
```

Set the API URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## Running both apps together

1. Start the backend on port `5000`.
2. Start the frontend on port `3000`.
3. The frontend calls the backend through `NEXT_PUBLIC_API_URL`.

### Recommended workflow

```bash
# in one terminal
cd hospital-backend
npm run dev

# in another terminal
cd hospital
npm run dev
```

---

## API and auth flow

- Frontend sends HTTP requests to `/api/...`.
- Backend routes are mounted under `/api` and include:
  - `/api/auth`
  - `/api/patients`
  - `/api/doctors`
  - `/api/appointments`
  - `/api/billing`
  - `/api/lab-tests`
  - `/api/pharmacy`
- Authentication uses JWT tokens:
  - login/register endpoints return a token
  - the frontend stores it in `localStorage`
  - Axios sends it in the `Authorization: Bearer ...` header
- Protected backend endpoints validate the JWT and enforce role permissions.

---

## Notes about SQLite

- The backend uses SQLite through Sequelize.
- The default database file is `hospital.sqlite` in the backend root.
- You can change the file path with `SQLITE_STORAGE` in `hospital-backend/.env`.
- `npm run seed` resets the data and rebuilds models.

---

## Common tasks

- Add a new frontend page: place it under `hospital/src/app/` or `hospital/src/app/(dashboard)/...`.
- Add a new backend route: create a route file in `hospital-backend/src/routes/`, a controller in `src/controllers/`, and mount it in `src/routes/index.js`.
- Add a new database model: add the model to `hospital-backend/src/models/`, import it in `src/models/index.js` if needed, and sync.

---

## Useful commands

- `cd hospital && npm run dev` — start frontend
- `cd hospital-backend && npm run dev` — start backend
- `cd hospital-backend && npm run seed` — seed/reset SQLite data
- `cd hospital && npm run lint` — lint frontend files
- `cd hospital && npm run typecheck` — run TypeScript type check

---

## Deployment notes

- Set `NEXT_PUBLIC_API_URL` to the deployed backend URL.
- The backend can be deployed to Vercel or any Node host.
- The frontend is a static/dynamic Next.js app and also deploys cleanly to Vercel.
- Make sure the backend `.env` contains a secure `JWT_SECRET`.

---

## What changed from the original setup

- The system now uses **SQLite** for backend storage across the full stack.
- All previous branding references have been updated to **ONE Healthcare / ONE HMS**.

If you want, I can also add a root-level README for the monorepo containing both `hospital` and `hospital-backend`.
