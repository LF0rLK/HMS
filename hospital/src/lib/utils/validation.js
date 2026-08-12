// Form validation helpers
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone) => {
  return /^\+?[\d\s\-().]{7,15}$/.test(phone);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  return value !== undefined && value !== null && String(value).trim() !== '';
};

export const validateDate = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
};

export const validateFutureDate = (dateStr) => {
  if (!validateDate(dateStr)) return false;
  return new Date(dateStr) >= new Date();
};

// Registration form validation
export const validateRegistrationForm = (form) => {
  const errors = {};
  if (!validateRequired(form.name)) errors.name = 'Name is required';
  if (!validateEmail(form.email)) errors.email = 'Valid email is required';
  if (!validatePhone(form.phone)) errors.phone = 'Valid phone number is required';
  if (!validateRequired(form.gender)) errors.gender = 'Gender is required';
  if (!validateDate(form.dateOfBirth)) errors.dateOfBirth = 'Valid date of birth is required';
  if (!validateRequired(form.address)) errors.address = 'Address is required';
  return errors;
};

// Appointment form validation
export const validateAppointmentForm = (form) => {
  const errors = {};
  if (!validateRequired(form.doctorId)) errors.doctorId = 'Please select a doctor';
  if (!validateFutureDate(form.date)) errors.date = 'Please select a future date';
  if (!validateRequired(form.slot)) errors.slot = 'Please select a time slot';
  return errors;
};
