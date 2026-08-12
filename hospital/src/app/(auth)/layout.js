'use client';

import React from 'react';
import Link from 'next/link';
import { HeartPulse } from 'lucide-react';
import { NotificationProvider } from '@/context/NotificationContext';

export default function AuthLayout({ children }) {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center p-6 select-none">
        <div className="max-w-[480px] w-full bg-bg-primary rounded-lg border border-border shadow-lg p-8 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-h3 text-text-primary">
              <HeartPulse className="text-accent" size={28} />
              <span>ONE Healthcare</span>
            </Link>
            <p className="text-caption text-text-secondary uppercase tracking-widest font-semibold">Hospital Management System</p>
          </div>
          {children}
        </div>
      </div>
    </NotificationProvider>
  );
}
