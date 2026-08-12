'use client';

import React from 'react';
import Link from 'next/link';
import { useAppointment } from '@/lib/hooks/useAppointment';
import { Table } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatCurrency, getStatusVariant } from '@/lib/utils/formatter';
import { Plus } from 'lucide-react';

export default function PatientAppointmentsPage() {
  const { appointments, loading } = useAppointment();

  const columns = [
    { label: 'Doctor', key: 'doctorId', render: (val, row) => row.doctorId?.name || row.doctorName || 'Dr. Sarah Smith' },
    { label: 'Department', key: 'doctorId', render: (val, row) => row.doctorId?.department || row.doctorDept || 'Cardiology' },
    { label: 'Date', key: 'date', render: (val) => formatDate(val) },
    { label: 'Time Slot', key: 'slot' },
    { label: 'Consultation Fee', key: 'consultationFee', render: (val) => formatCurrency(val || 800) },
    {
      label: 'Status',
      key: 'status',
      render: (val) => <Badge variant={getStatusVariant(val)}>{val}</Badge>,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">My Appointments</h1>
          <p className="text-body-sm text-text-secondary">View and track status of consultation bookings.</p>
        </div>
        <Link href="/patient/appointments/book">
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            <span>Book Consultation</span>
          </Button>
        </Link>
      </div>

      {loading ? <PageLoader /> : (
        <Table
          columns={columns}
          data={appointments}
          emptyMessage="No consultation bookings found. Click Book Consultation to schedule one!"
        />
      )}
    </div>
  );
}
