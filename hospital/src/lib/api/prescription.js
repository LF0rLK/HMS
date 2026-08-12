import api from './axios';

export const getPrescriptions = async () => {
  const { data } = await api.get('/pharmacy/prescriptions');
  return data;
};

export const createPrescription = async (prescData) => {
  const { data } = await api.post('/pharmacy/prescriptions', prescData);
  return data;
};

export const dispensePrescription = async (id) => {
  const { data } = await api.put(`/pharmacy/prescriptions/${id}/dispense`);
  return data;
};
