import api from './axios';

export const getDoctors = async () => {
  const { data } = await api.get('/doctors');
  return data;
};

export const getDoctorById = async (id) => {
  const { data } = await api.get(`/doctors/${id}`);
  return data;
};

export const getDoctorsByDepartment = async (dept) => {
  const { data } = await api.get(`/doctors/department/${dept}`);
  return data;
};
