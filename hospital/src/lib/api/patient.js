import api from './axios';

export const getPatients = async () => {
  const { data } = await api.get('/patients');
  return data;
};

export const getPatientById = async (id) => {
  const { data } = await api.get(`/patients/${id}`);
  return data;
};

export const updatePatient = async (id, patientData) => {
  const { data } = await api.put(`/patients/${id}`, patientData);
  return data;
};
