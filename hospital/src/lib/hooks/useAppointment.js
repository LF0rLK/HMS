'use client';

import { useState, useEffect, useCallback } from 'react';
import * as appointmentApi from '@/lib/api/appointment';

export const useAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentApi.getAppointments();
      setAppointments(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const book = useCallback(async (appointmentData) => {
    const created = await appointmentApi.createAppointment(appointmentData);
    setAppointments((prev) => [...prev, created]);
    return created;
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    const updated = await appointmentApi.updateAppointmentStatus(id, status);
    setAppointments((prev) => prev.map((a) => (a._id === id ? updated : a)));
    return updated;
  }, []);

  return { appointments, loading, error, refetch: fetchAppointments, book, updateStatus };
};
