'use client';

import { useState, useEffect, useCallback } from 'react';
import * as prescriptionApi from '@/lib/api/prescription';

export const usePrescription = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrescriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await prescriptionApi.getPrescriptions();
      setPrescriptions(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPrescriptions(); }, [fetchPrescriptions]);

  const create = useCallback(async (prescData) => {
    const created = await prescriptionApi.createPrescription(prescData);
    setPrescriptions((prev) => [created, ...prev]);
    return created;
  }, []);

  const dispense = useCallback(async (id) => {
    const result = await prescriptionApi.dispensePrescription(id);
    await fetchPrescriptions();
    return result;
  }, [fetchPrescriptions]);

  return { prescriptions, loading, error, refetch: fetchPrescriptions, create, dispense };
};
