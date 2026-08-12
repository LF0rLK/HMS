import api from './axios';

export const getAppointments = async () => {
  const { data } = await api.get('/appointments');
  return data;
};

export const getAppointmentById = async (id) => {
  const { data } = await api.get(`/appointments/${id}`);
  return data;
};

export const createAppointment = async (appointmentData) => {
  const { data } = await api.post('/appointments', appointmentData);
  return data;
};

export const updateAppointmentStatus = async (id, status) => {
  const { data } = await api.put(`/appointments/${id}/status`, { status });
  return data;
};
