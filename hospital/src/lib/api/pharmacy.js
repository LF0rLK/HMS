import api from './axios';

export const getMedicines = async () => {
  const { data } = await api.get('/pharmacy/medicines');
  return data;
};

export const addMedicine = async (medData) => {
  const { data } = await api.post('/pharmacy/medicines', medData);
  return data;
};

export const updateMedicineStock = async (id, stock) => {
  const { data } = await api.put(`/pharmacy/medicines/${id}/stock`, { stock });
  return data;
};
