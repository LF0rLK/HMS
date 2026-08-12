'use client';

import { useState, useEffect, useCallback } from 'react';
import * as labTestApi from '@/lib/api/labTest';

export const useLabTest = () => {
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLabTests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await labTestApi.getLabTests();
      setLabTests(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load lab tests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLabTests(); }, [fetchLabTests]);

  const request = useCallback(async (testData) => {
    const created = await labTestApi.createLabTest(testData);
    setLabTests((prev) => [created, ...prev]);
    return created;
  }, []);

  const complete = useCallback(async (id, results) => {
    const updated = await labTestApi.completeLabTest(id, results);
    setLabTests((prev) => prev.map((t) => (t._id === id ? updated : t)));
    return updated;
  }, []);

  return { labTests, loading, error, refetch: fetchLabTests, request, complete };
};
