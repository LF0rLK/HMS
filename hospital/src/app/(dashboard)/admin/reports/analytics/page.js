'use client';

import React from 'react';
import { usePatient } from '@/lib/hooks/usePatient';
import { useDoctor } from '@/lib/hooks/useDoctor';
import { useAppointment } from '@/lib/hooks/useAppointment';
import { useBilling } from '@/lib/hooks/useBilling';
import { Card, StatCard } from '@/components/common/Card';
import { PageLoader } from '@/components/common/Loader';
import { formatCurrency } from '@/lib/utils/formatter';
import { Users, Stethoscope, Calendar, CreditCard, Activity } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { patients, loading: loadingPatients } = usePatient();
  const { doctors, loading: loadingDoctors } = useDoctor();
  const { appointments, loading: loadingAppts } = useAppointment();
  const { bills, loading: loadingBills } = useBilling();

  const isLoading = loadingPatients || loadingDoctors || loadingAppts || loadingBills;

  const totalPaid = bills.filter((b) => b.status === 'Paid').reduce((sum, b) => sum + (b.grandTotal || 0), 0);
  const totalUnpaid = bills.filter((b) => b.status === 'Unpaid').reduce((sum, b) => sum + (b.grandTotal || 0), 0);

  if (isLoading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">System Operations Analytics</h1>
        <p className="text-body-sm text-text-secondary">Hospital throughput, departmental loads, and ledger performance.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Registered Patients" value={patients.length} icon={Users} />
        <StatCard label="Active Clinicians" value={doctors.length} icon={Stethoscope} />
        <StatCard label="Total Consultations" value={appointments.length} icon={Calendar} />
        <StatCard label="Settled Revenue" value={formatCurrency(totalPaid)} icon={CreditCard} color="green-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col gap-4">
          <h3 className="text-h4 font-bold text-text-primary flex items-center gap-2">
            <CreditCard size={18} className="text-accent" />
            <span>Financial Ledger Breakdown</span>
          </h3>
          <div className="flex flex-col gap-3 text-body-sm">
            <div className="flex justify-between items-center p-3 bg-surface rounded-md">
              <span className="text-text-secondary">Total Settled Invoices (Paid)</span>
              <span className="font-bold text-green-600">{formatCurrency(totalPaid)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-surface rounded-md">
              <span className="text-text-secondary">Outstanding Receivables (Unpaid)</span>
              <span className="font-bold text-bias-left">{formatCurrency(totalUnpaid)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-surface rounded-md">
              <span className="text-text-secondary">Grand Ledger Gross Total</span>
              <span className="font-bold text-text-primary">{formatCurrency(totalPaid + totalUnpaid)}</span>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col gap-4">
          <h3 className="text-h4 font-bold text-text-primary flex items-center gap-2">
            <Activity size={18} className="text-accent" />
            <span>Department Utilization Metrics</span>
          </h3>
          <div className="flex flex-col gap-3 text-body-sm">
            <div className="flex justify-between items-center p-3 bg-surface rounded-md">
              <span className="text-text-secondary">Cardiology Department Load</span>
              <span className="font-bold text-accent">45% Capacity</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-surface rounded-md">
              <span className="text-text-secondary">Pediatrics Department Load</span>
              <span className="font-bold text-accent">30% Capacity</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-surface rounded-md">
              <span className="text-text-secondary">General Medicine Load</span>
              <span className="font-bold text-accent">25% Capacity</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
