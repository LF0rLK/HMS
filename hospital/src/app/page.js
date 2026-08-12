'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/common/Button';
import { HeartPulse, Activity, ShieldCheck, Users, ArrowRight } from 'lucide-react';
import { getDashboardRoute } from '@/lib/utils/permissions';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary">
      {/* Top Header */}
      <header className="border-b border-divider bg-bg-primary sticky top-0 z-50 px-6 py-4">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-h3 text-text-primary select-none">
            <HeartPulse className="text-accent" size={24} />
            <span>ONE Healthcare</span>
          </div>

          <nav className="flex items-center gap-4">
            {user ? (
              <Button size="sm" onClick={() => router.push(getDashboardRoute(user.role))}>
                Go to Dashboard
              </Button>
            ) : (
              <Link href="/login">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Hero */}
      <main className="flex-grow flex flex-col items-center justify-center py-20 px-6 max-w-[1280px] mx-auto w-full">
        <div className="flex flex-col items-center text-center max-w-[760px] gap-6">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-caption font-semibold tracking-wide uppercase select-none">
            <Activity size={16} />
            <span>Hospital Management System</span>
          </div>

          <h1 className="text-h1 text-text-primary tracking-tight font-extrabold text-[36px] sm:text-[48px] leading-tight">
            Integrated Clinical Operations & Patient Care Platform
          </h1>

          <p className="text-body-lg text-text-secondary">
            Streamlining patient check-ins, doctor consultations, electronic prescriptions, laboratory diagnostic reports, pharmacy inventory, and automated billing.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            {user ? (
              <Button size="lg" onClick={() => router.push(getDashboardRoute(user.role))} className="flex items-center gap-2">
                <span>Enter Your Portal</span>
                <ArrowRight size={18} />
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button size="lg" className="flex items-center gap-2">
                    <span>Portal Sign In</span>
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="lg">
                    Register Patient Account
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full">
          <div className="p-6 rounded-lg bg-surface border border-border flex flex-col gap-3">
            <ShieldCheck className="text-accent" size={24} />
            <h3 className="text-h4 font-bold text-text-primary">6 Specialized Role Portals</h3>
            <p className="text-body-sm text-text-secondary">
              Tailored workflows for Patients, Doctors, Receptionists, Pharmacists, Lab Technicians, and Hospital Administrators.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-surface border border-border flex flex-col gap-3">
            <Users className="text-accent" size={24} />
            <h3 className="text-h4 font-bold text-text-primary">Patient Lifecycle History</h3>
            <p className="text-body-sm text-text-secondary">
              Centralized record tracking for appointment bookings, diagnostic lab panel reports, and electronic prescriptions.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-surface border border-border flex flex-col gap-3">
            <Activity className="text-accent" size={24} />
            <h3 className="text-h4 font-bold text-text-primary">Real-Time Inventory & Ledger</h3>
            <p className="text-body-sm text-text-secondary">
              Automated pharmacy stock deduction on prescription fulfillment with instant billing invoice generation.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-divider py-6 bg-surface text-center text-caption text-text-secondary select-none">
        <p>&copy; 2026 ONE Healthcare Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
