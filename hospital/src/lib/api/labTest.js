import api from './axios';

export const getLabTests = async () => {
  const { data } = await api.get('/lab-tests');
  return data;
};

export const createLabTest = async (testData) => {
  const { data } = await api.post('/lab-tests', testData);
  return data;
};

export const completeLabTest = async (id, results) => {
  const { data } = await api.put(`/lab-tests/${id}/complete`, { results });
  return data;
};
