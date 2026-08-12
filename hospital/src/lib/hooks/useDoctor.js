'use client';

import { useState, useEffect, useCallback } from 'react';
import * as doctorApi from '@/lib/api/doctor';

export const useDoctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDoctors = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await doctorApi.getDoctors();
            setDoctors(data);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to load doctors');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

    const getDoctorById = useCallback(async (id) => {
        return await doctorApi.getDoctorById(id);
    }, []);

    const getDoctorsByDepartment = useCallback(async (dept) => {
        return await doctorApi.getDoctorsByDepartment(dept);
    }, []);

    return { doctors, loading, error, refetch: fetchDoctors, getDoctorById, getDoctorsByDepartment };
};
