'use client';

import { useEffect } from 'react';
import api from '@/lib/api/axios';
import { useLoading } from '@/context/LoadingContext';

/**
 * Registers axios request/response interceptors that increment/decrement
 * the pending-request counter in LoadingContext.
 * Mount this once inside the root layout (inside LoadingProvider).
 */
export const AxiosLoader = () => {
  const { startRequest, finishRequest } = useLoading();

  useEffect(() => {
    const reqId = api.interceptors.request.use((config) => {
      startRequest();
      return config;
    }, (error) => {
      finishRequest();
      return Promise.reject(error);
    });

    const resId = api.interceptors.response.use(
      (response) => {
        finishRequest();
        return response;
      },
      (error) => {
        finishRequest();
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqId);
      api.interceptors.response.eject(resId);
    };
  }, [startRequest, finishRequest]);

  return null;
};
