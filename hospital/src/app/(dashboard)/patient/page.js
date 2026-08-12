'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useAppointment } from '@/lib/hooks/useAppointment';
import { usePrescription } from '@/lib/hooks/usePrescription';
import { useLabTest } from '@/lib/hooks/useLabTest';
import { useBilling } from '@/lib/hooks/useBilling';
import { Card, StatCard } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { Calendar, FileText, FlaskConical, CreditCard, Plus } from 'lucide-react';
import { getStatusVariant, formatDate, formatCurrency } from '@/lib/utils/formatter';
import { Badge } from '@/components/ui/badge';

export default function PatientDashboard() {
  const { user } = useAuth();
  const { appointments, loading: loadingAppts } = useAppointment();
  const { prescriptions, loading: loadingRx } = usePrescription();
  const { labTests, loading: loadingLabs } = useLabTest();
  const { bills, loading: loadingBills } = useBilling();

  const isLoading = loadingAppts || loadingRx || loadingLabs || loadingBills;

  const upcomingAppts = appointments.filter((a) => a.status === 'Approved' || a.status === 'Pending');
  const unpaidBills = bills.filter((b) => b.status === 'Unpaid');

  if (isLoading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bg-primary p-6 rounded-lg border border-border shadow-sm">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">Welcome, {user?.name}</h1>
          <p className="text-body-sm text-text-secondary">Patient Portal Overview & Medical History</p>
        </div>
        <Link href="/patient/appointments/book">
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            <span>Book Appointment</span>
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Appointments" value={appointments.length} icon={Calendar} subLabel={`${upcomingAppts.length} upcoming`} />
        <StatCard label="Prescriptions" value={prescriptions.length} icon={FileText} />
        <StatCard label="Lab Reports" value={labTests.length} icon={FlaskConical} />
        <StatCard label="Unpaid Invoices" value={unpaidBills.length} icon={CreditCard} color={unpaidBills.length > 0 ? 'bias-left' : 'accent'} />
      </div>

      {/* Recent Appointments & Prescriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding={false}>
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h2 className="text-h4 font-bold text-text-primary">Upcoming Appointments</h2>
            <Link href="/patient/appointments" className="text-caption text-accent hover:underline font-semibold">View All</Link>
          </div>
          <div className="divide-y divide-divider">
            {upcomingAppts.length === 0 ? (
              <div className="p-6 text-center text-body-sm text-text-secondary">No upcoming appointments.</div>
            ) : (
              upcomingAppts.slice(0, 3).map((app) => (
                <div key={app._id || app.id} className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-body-sm font-bold text-text-primary">{app.doctorId?.name || app.doctorName}</h4>
                    <p className="text-caption text-text-secondary">{app.slot} &bull; {formatDate(app.date)}</p>
                  </div>
                  <Badge variant={getStatusVariant(app.status)}>{app.status}</Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card padding={false}>
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h2 className="text-h4 font-bold text-text-primary">Active Prescriptions</h2>
            <Link href="/patient/prescriptions" className="text-caption text-accent hover:underline font-semibold">View All</Link>
          </div>
          <div className="divide-y divide-divider">
            {prescriptions.length === 0 ? (
              <div className="p-6 text-center text-body-sm text-text-secondary">No active prescriptions.</div>
            ) : (
              prescriptions.slice(0, 3).map((pr) => (
                <div key={pr._id || pr.id} className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-body-sm font-bold text-text-primary">{pr.diagnosis}</h4>
                    <p className="text-caption text-text-secondary">By {pr.doctorId?.name || pr.doctorName} &bull; {formatDate(pr.date)}</p>
                  </div>
                  <Badge variant={getStatusVariant(pr.status)}>{pr.status}</Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
