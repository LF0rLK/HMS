'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePatient } from '@/lib/hooks/usePatient';
import { useDoctor } from '@/lib/hooks/useDoctor';
import { useAppointment } from '@/lib/hooks/useAppointment';
import { useBilling } from '@/lib/hooks/useBilling';
import { Card, StatCard } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { Users, Stethoscope, Calendar, CreditCard, UserPlus, TrendingUp, Terminal } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatter';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { patients, loading: loadingPatients } = usePatient();
  const { doctors, loading: loadingDoctors } = useDoctor();
  const { appointments, loading: loadingAppts } = useAppointment();
  const { bills, loading: loadingBills } = useBilling();

  const isLoading = loadingPatients || loadingDoctors || loadingAppts || loadingBills;

  const totalRevenue = bills
    .filter((b) => b.status === 'Paid')
    .reduce((sum, b) => sum + (b.grandTotal || 0), 0);

  if (isLoading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-8">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bg-primary p-6 rounded-lg border border-border shadow-sm">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">System Administrator Console</h1>
          <p className="text-body-sm text-text-secondary">Hospital infrastructure, user privileges, and financial auditing.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/users/add">
            <Button size="sm" className="flex items-center gap-1.5">
              <UserPlus size={14} />
              <span>Add User</span>
            </Button>
          </Link>
          <Link href="/admin/doctors/add">
            <Button size="sm" variant="outline" className="flex items-center gap-1.5">
              <Stethoscope size={14} />
              <span>Add Doctor</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Registered Patients" value={patients.length} icon={Users} />
        <StatCard label="Doctor Staff" value={doctors.length} icon={Stethoscope} />
        <StatCard label="Total Appointments" value={appointments.length} icon={Calendar} />
        <StatCard label="Paid Ledger Revenue" value={formatCurrency(totalRevenue)} icon={CreditCard} color="green-600" />
      </div>

      {/* Admin Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col gap-3">
          <Users className="text-accent" size={24} />
          <h3 className="text-h4 font-bold text-text-primary">User Directory Management</h3>
          <p className="text-body-sm text-text-secondary">Manage user accounts and role authorization privileges across all departments.</p>
          <Link href="/admin/users" className="mt-2">
            <Button size="sm" variant="secondary">User Directory &rarr;</Button>
          </Link>
        </Card>

        <Card className="flex flex-col gap-3">
          <TrendingUp className="text-accent" size={24} />
          <h3 className="text-h4 font-bold text-text-primary">System Analytics Reports</h3>
          <p className="text-body-sm text-text-secondary">View hospital performance metrics, patient demographics, and department throughput.</p>
          <Link href="/admin/reports/analytics" className="mt-2">
            <Button size="sm" variant="secondary">View Analytics &rarr;</Button>
          </Link>
        </Card>

        <Card className="flex flex-col gap-3">
          <Terminal className="text-accent" size={24} />
          <h3 className="text-h4 font-bold text-text-primary">Audit Log Inspection</h3>
          <p className="text-body-sm text-text-secondary">Inspect server request activity logs and system execution trails.</p>
          <Link href="/admin/reports/logs" className="mt-2">
            <Button size="sm" variant="secondary">Audit Logs &rarr;</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
