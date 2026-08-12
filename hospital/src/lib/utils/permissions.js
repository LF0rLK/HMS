import { ROLES } from './constants';

// Check if a role can access a given route prefix
export const canAccess = (role, route) => {
  const roleRouteMap = {
    [ROLES.PATIENT]: ['/patient'],
    [ROLES.DOCTOR]: ['/doctor'],
    [ROLES.RECEPTIONIST]: ['/receptionist'],
    [ROLES.PHARMACIST]: ['/pharmacist'],
    [ROLES.LAB_STAFF]: ['/lab-staff'],
    [ROLES.ADMIN]: ['/admin', '/patient', '/doctor', '/receptionist', '/pharmacist', '/lab-staff'],
  };
  const allowed = roleRouteMap[role] || [];
  return allowed.some((prefix) => route.startsWith(prefix));
};

// Get dashboard home route for a role
export const getDashboardRoute = (role) => {
  const map = {
    [ROLES.PATIENT]: '/patient',
    [ROLES.DOCTOR]: '/doctor',
    [ROLES.RECEPTIONIST]: '/receptionist',
    [ROLES.PHARMACIST]: '/pharmacist',
    [ROLES.LAB_STAFF]: '/lab-staff',
    [ROLES.ADMIN]: '/admin',
  };
  return map[role] || '/login';
};

// Get sidebar navigation links for a role
export const getSidebarLinks = (role) => {
  const links = {
    [ROLES.PATIENT]: [
      { label: 'Dashboard', href: '/patient', icon: 'LayoutDashboard' },
      { label: 'My Profile', href: '/patient/profile', icon: 'User' },
      { label: 'Appointments', href: '/patient/appointments', icon: 'Calendar' },
      { label: 'Book Appointment', href: '/patient/appointments/book', icon: 'CalendarPlus' },
      { label: 'Prescriptions', href: '/patient/prescriptions', icon: 'FileText' },
      { label: 'Lab Reports', href: '/patient/lab-reports', icon: 'FlaskConical' },
      { label: 'Bills', href: '/patient/bills', icon: 'CreditCard' },
    ],
    [ROLES.DOCTOR]: [
      { label: 'Dashboard', href: '/doctor', icon: 'LayoutDashboard' },
      { label: 'Appointments', href: '/doctor/appointments', icon: 'Calendar' },
      { label: 'My Patients', href: '/doctor/patients', icon: 'Users' },
      { label: 'Write Prescription', href: '/doctor/prescriptions/create', icon: 'FilePlus' },
      { label: 'Prescriptions', href: '/doctor/prescriptions', icon: 'FileText' },
      { label: 'Request Lab Test', href: '/doctor/lab-tests/request', icon: 'TestTube' },
      { label: 'Lab Tests', href: '/doctor/lab-tests', icon: 'FlaskConical' },
    ],
    [ROLES.RECEPTIONIST]: [
      { label: 'Dashboard', href: '/receptionist', icon: 'LayoutDashboard' },
      { label: 'Register Patient', href: '/receptionist/patients/register', icon: 'UserPlus' },
      { label: 'Patient Search', href: '/receptionist/patients/search', icon: 'Search' },
      { label: 'All Patients', href: '/receptionist/patients', icon: 'Users' },
      { label: 'Schedule Appointment', href: '/receptionist/appointments/schedule', icon: 'CalendarPlus' },
      { label: 'Appointments', href: '/receptionist/appointments', icon: 'Calendar' },
      { label: 'Billing', href: '/receptionist/billing', icon: 'CreditCard' },
      { label: 'Generate Invoice', href: '/receptionist/billing/generate', icon: 'Receipt' },
    ],
    [ROLES.PHARMACIST]: [
      { label: 'Dashboard', href: '/pharmacist', icon: 'LayoutDashboard' },
      { label: 'Prescription Queue', href: '/pharmacist/prescriptions', icon: 'FileText' },
      { label: 'Inventory', href: '/pharmacist/inventory', icon: 'Package' },
      { label: 'Add Medicine', href: '/pharmacist/inventory/add', icon: 'PackagePlus' },
      { label: 'Dispense', href: '/pharmacist/dispense', icon: 'Pill' },
    ],
    [ROLES.LAB_STAFF]: [
      { label: 'Dashboard', href: '/lab-staff', icon: 'LayoutDashboard' },
      { label: 'Test Queue', href: '/lab-staff/tests', icon: 'FlaskConical' },
      { label: 'Pending Tests', href: '/lab-staff/tests/pending', icon: 'Clock' },
    ],
    [ROLES.ADMIN]: [
      { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
      { label: 'Users', href: '/admin/users', icon: 'Users' },
      { label: 'Add User', href: '/admin/users/add', icon: 'UserPlus' },
      { label: 'Doctors', href: '/admin/doctors', icon: 'Stethoscope' },
      { label: 'Add Doctor', href: '/admin/doctors/add', icon: 'UserPlus' },
      { label: 'Staff', href: '/admin/staff', icon: 'Briefcase' },
      { label: 'Reports', href: '/admin/reports', icon: 'BarChart2' },
      { label: 'Analytics', href: '/admin/reports/analytics', icon: 'TrendingUp' },
      { label: 'System Logs', href: '/admin/reports/logs', icon: 'Terminal' },
      { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
    ],
  };
  return links[role] || [];
};
