'use client';

import { useState, useEffect, useCallback } from 'react';
import * as pharmacyApi from '@/lib/api/pharmacy';

export const usePharmacy = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pharmacyApi.getMedicines();
      setMedicines(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load medicines');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMedicines(); }, [fetchMedicines]);

  const add = useCallback(async (medData) => {
    const created = await pharmacyApi.addMedicine(medData);
    setMedicines((prev) => [...prev, created]);
    return created;
  }, []);

  const updateStock = useCallback(async (id, stock) => {
    const updated = await pharmacyApi.updateMedicineStock(id, stock);
    setMedicines((prev) => prev.map((m) => (m._id === id ? updated : m)));
    return updated;
  }, []);

  return { medicines, loading, error, refetch: fetchMedicines, add, updateStock };
};
