import api from './axios';

export const getBills = async () => {
  const { data } = await api.get('/billing');
  return data;
};

export const getBillById = async (id) => {
  const { data } = await api.get(`/billing/${id}`);
  return data;
};

export const createBill = async (billData) => {
  const { data } = await api.post('/billing', billData);
  return data;
};

export const payBill = async (id, paymentMethod) => {
  const { data } = await api.put(`/billing/${id}/pay`, { paymentMethod });
  return data;
};
