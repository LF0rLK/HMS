'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useAppointment } from '@/lib/hooks/useAppointment';
import { useLabTest } from '@/lib/hooks/useLabTest';
import { usePrescription } from '@/lib/hooks/usePrescription';
import { Card, StatCard } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { Calendar, Users, FileText, FlaskConical, Plus } from 'lucide-react';
import { formatDate, getStatusVariant } from '@/lib/utils/formatter';
import { Badge } from '@/components/ui/badge';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { appointments, loading: loadingAppts, updateStatus } = useAppointment();
  const { labTests, loading: loadingLabs } = useLabTest();
  const { prescriptions, loading: loadingRx } = usePrescription();

  const isLoading = loadingAppts || loadingLabs || loadingRx;
  const pendingAppts = appointments.filter((a) => a.status === 'Pending');

  if (isLoading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-8">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bg-primary p-6 rounded-lg border border-border shadow-sm">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">Welcome, {user?.name}</h1>
          <p className="text-body-sm text-text-secondary">Doctor Clinical Portal & Practice Management</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/doctor/prescriptions/create">
            <Button variant="outline" className="flex items-center gap-2">
              <Plus size={16} />
              <span>Write Prescription</span>
            </Button>
          </Link>
          <Link href="/doctor/lab-tests/request">
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Order Lab Test</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Appointments" value={appointments.length} icon={Calendar} subLabel={`${pendingAppts.length} pending review`} />
        <StatCard label="Prescriptions" value={prescriptions.length} icon={FileText} />
        <StatCard label="Lab Panels" value={labTests.length} icon={FlaskConical} />
        <StatCard label="Active Patients" value={new Set(appointments.map((a) => a.patientId?._id || a.patientId)).size || 1} icon={Users} />
      </div>

      {/* Pending Appointments */}
      <Card padding={false}>
        <div className="p-5 border-b border-border flex justify-between items-center">
          <h2 className="text-h4 font-bold text-text-primary">Today & Pending Consultation Requests</h2>
          <Link href="/doctor/appointments" className="text-caption text-accent hover:underline font-semibold">View Calendar</Link>
        </div>
        <div className="divide-y divide-divider">
          {appointments.length === 0 ? (
            <div className="p-6 text-center text-body-sm text-text-secondary">No appointments in your queue.</div>
          ) : (
            appointments.slice(0, 5).map((app) => (
              <div key={app._id || app.id} className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-body-sm font-bold text-text-primary">{app.patientId?.name || app.patientName || 'John Doe'}</h4>
                  <p className="text-caption text-text-secondary">{app.slot} &bull; {formatDate(app.date)} &bull; {app.notes || 'Routine checkup'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={getStatusVariant(app.status)}>{app.status}</Badge>
                  {app.status === 'Pending' && (
                    <Button size="sm" variant="secondary" onClick={() => updateStatus(app._id || app.id, 'Approved')}>Approve</Button>
                  )}
                  {app.status === 'Approved' && (
                    <Button size="sm" variant="primary" onClick={() => updateStatus(app._id || app.id, 'Completed')}>Complete</Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
