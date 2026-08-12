import api from './axios';

export const getUsers = async () => {
  const { data } = await api.get('/admin/users');
  return data;
};

export const addUser = async (userData) => {
  const { data } = await api.post('/admin/users', userData);
  return data;
};

export const getDoctorsList = async () => {
  const { data } = await api.get('/doctors');
  return data;
};

export const addDoctor = async (doctorData) => {
  const { data } = await api.post('/doctors', doctorData);
  return data;
};

export const getSystemStats = async () => {
  const { data } = await api.get('/admin/stats');
  return data;
};
