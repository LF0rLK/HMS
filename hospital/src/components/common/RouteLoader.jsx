'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoading } from '@/context/LoadingContext';

/**
 * Watches pathname/searchParams changes and sets routeLoading in LoadingContext.
 * Mount this once inside the root layout (inside LoadingProvider).
 */
export const RouteLoader = () => {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const { setRouteLoading } = useLoading();
  const previousPath = useRef(null);

  useEffect(() => {
    const current = `${pathname}?${searchParams.toString()}`;

    if (previousPath.current !== null && previousPath.current !== current) {
      // Navigation just completed — clear the flag
      setRouteLoading(false);
    }

    previousPath.current = current;
  }, [pathname, searchParams, setRouteLoading]);

  return null;
};
