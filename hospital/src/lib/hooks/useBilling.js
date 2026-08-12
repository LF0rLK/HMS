'use client';

import { useState, useEffect, useCallback } from 'react';
import * as billingApi from '@/lib/api/billing';

export const useBilling = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await billingApi.getBills();
      setBills(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load bills');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBills(); }, [fetchBills]);

  const create = useCallback(async (billData) => {
    const created = await billingApi.createBill(billData);
    setBills((prev) => [created, ...prev]);
    return created;
  }, []);

  const pay = useCallback(async (id, paymentMethod) => {
    const updated = await billingApi.payBill(id, paymentMethod);
    setBills((prev) => prev.map((b) => (b._id === id ? updated : b)));
    return updated;
  }, []);

  return { bills, loading, error, refetch: fetchBills, create, pay };
};
