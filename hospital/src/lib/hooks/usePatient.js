'use client';

import { useState, useEffect, useCallback } from 'react';
import * as patientApi from '@/lib/api/patient';

export const usePatient = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await patientApi.getPatients();
      setPatients(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  const updatePatient = useCallback(async (id, data) => {
    const updated = await patientApi.updatePatient(id, data);
    setPatients((prev) => prev.map((p) => (p._id === id ? updated : p)));
    return updated;
  }, []);

  return { patients, loading, error, refetch: fetchPatients, updatePatient };
};
