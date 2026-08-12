// App-wide constants
export const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  RECEPTIONIST: 'receptionist',
  PHARMACIST: 'pharmacist',
  LAB_STAFF: 'lab-staff',
  ADMIN: 'admin',
};

export const APPOINTMENT_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const PRESCRIPTION_STATUS = {
  PRESCRIBED: 'Prescribed',
  DISPENSED: 'Dispensed',
};

export const LAB_TEST_STATUS = {
  REQUESTED: 'Requested',
  COMPLETED: 'Completed',
};

export const BILL_STATUS = {
  UNPAID: 'Unpaid',
  PAID: 'Paid',
};

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const GENDERS = ['Male', 'Female', 'Other'];

export const PAYMENT_METHODS = ['Cash', 'Card', 'Insurance', 'Online'];

export const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
];

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const DEPARTMENTS = [
  'Cardiology', 'Pediatrics', 'Orthopedics', 'Neurology',
  'Dermatology', 'General Medicine', 'Gynecology', 'Ophthalmology',
  'ENT', 'Psychiatry', 'Radiology', 'Pathology',
];

export const LAB_PANELS = [
  'Complete Blood Count (CBC)',
  'Lipid Profile Panel',
  'Urinalysis Screening',
  'Thyroid Stimulating Hormone (TSH)',
  'Liver Function Panel (LFT)',
  'Blood Glucose Fasting',
  'HbA1c (Glycated Hemoglobin)',
  'Kidney Function Test (KFT)',
  'Cardioglobin Enzyme Test',
  'Serum Electrolytes Panel',
];
