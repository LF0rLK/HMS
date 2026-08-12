'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePatient } from '@/lib/hooks/usePatient';
import { useAppointment } from '@/lib/hooks/useAppointment';
import { useBilling } from '@/lib/hooks/useBilling';
import { Card, StatCard } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { Users, Calendar, CreditCard, UserPlus, CalendarPlus, Search, Receipt } from 'lucide-react';

export default function ReceptionistDashboard() {
  const { user } = useAuth();
  const { patients, loading: loadingPatients } = usePatient();
  const { appointments, loading: loadingAppts } = useAppointment();
  const { bills, loading: loadingBills } = useBilling();

  const isLoading = loadingPatients || loadingAppts || loadingBills;
  const unpaidBills = bills.filter((b) => b.status === 'Unpaid');

  if (isLoading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-8">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bg-primary p-6 rounded-lg border border-border shadow-sm">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">Front Desk Reception Portal</h1>
          <p className="text-body-sm text-text-secondary">Patient intake, scheduling, and billing management.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/receptionist/patients/register">
            <Button size="sm" className="flex items-center gap-1.5">
              <UserPlus size={14} />
              <span>Register Patient</span>
            </Button>
          </Link>
          <Link href="/receptionist/appointments/schedule">
            <Button size="sm" variant="outline" className="flex items-center gap-1.5">
              <CalendarPlus size={14} />
              <span>Schedule Visit</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Registered Patients" value={patients.length} icon={Users} />
        <StatCard label="Total Appointments" value={appointments.length} icon={Calendar} />
        <StatCard label="Total Invoices" value={bills.length} icon={CreditCard} />
        <StatCard label="Unpaid Invoices" value={unpaidBills.length} icon={CreditCard} color={unpaidBills.length > 0 ? 'bias-left' : 'accent'} />
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col gap-3">
          <UserPlus className="text-accent" size={24} />
          <h3 className="text-h4 font-bold text-text-primary">Patient Registration</h3>
          <p className="text-body-sm text-text-secondary">Create new patient record cards with medical demographic details.</p>
          <Link href="/receptionist/patients/register" className="mt-2">
            <Button size="sm" variant="secondary">Register Profile &rarr;</Button>
          </Link>
        </Card>

        <Card className="flex flex-col gap-3">
          <Search className="text-accent" size={24} />
          <h3 className="text-h4 font-bold text-text-primary">Search Patient Records</h3>
          <p className="text-body-sm text-text-secondary">Locate patient demographic profiles by name, phone, or blood group.</p>
          <Link href="/receptionist/patients/search" className="mt-2">
            <Button size="sm" variant="secondary">Search Directory &rarr;</Button>
          </Link>
        </Card>

        <Card className="flex flex-col gap-3">
          <Receipt className="text-accent" size={24} />
          <h3 className="text-h4 font-bold text-text-primary">Generate Invoice</h3>
          <p className="text-body-sm text-text-secondary">Create customized clinical invoices and process in-person settlements.</p>
          <Link href="/receptionist/billing/generate" className="mt-2">
            <Button size="sm" variant="secondary">Generate Invoice &rarr;</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
