'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
    // pendingRequests tracks concurrent API calls — spinner shows while > 0
    const [pendingRequests, setPendingRequests] = useState(0);
    const [routeLoading, setRouteLoading] = useState(false);

    const startRequest = useCallback(() => setPendingRequests((n) => n + 1), []);
    const finishRequest = useCallback(() => setPendingRequests((n) => Math.max(0, n - 1)), []);

    const isLoading = pendingRequests > 0 || routeLoading;

    return (
        <LoadingContext.Provider value={{ isLoading, pendingRequests, routeLoading, startRequest, finishRequest, setRouteLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const ctx = useContext(LoadingContext);
    if (!ctx) throw new Error('useLoading must be used inside <LoadingProvider>');
    return ctx;
};
