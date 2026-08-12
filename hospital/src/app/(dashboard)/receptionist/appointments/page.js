'use client';

import React from 'react';
import Link from 'next/link';
import { useAppointment } from '@/lib/hooks/useAppointment';
import { Table } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { Badge } from '@/components/ui/badge';
import { formatDate, getStatusVariant } from '@/lib/utils/formatter';
import { CalendarPlus } from 'lucide-react';

export default function ReceptionistAppointmentsPage() {
  const { appointments, loading, updateStatus } = useAppointment();

  const columns = [
    { label: 'Patient Name', key: 'patientId', render: (val, row) => row.patientId?.name || row.patientName || 'John Doe' },
    { label: 'Doctor', key: 'doctorId', render: (val, row) => row.doctorId?.name || row.doctorName || 'Dr. Sarah Smith' },
    { label: 'Date', key: 'date', render: (val) => formatDate(val) },
    { label: 'Time Slot', key: 'slot' },
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
          <h1 className="text-h2 font-bold text-text-primary">Appointment Bookings Desk</h1>
          <p className="text-body-sm text-text-secondary">View all hospital consultation bookings.</p>
        </div>
        <Link href="/receptionist/appointments/schedule">
          <Button className="flex items-center gap-2">
            <CalendarPlus size={16} />
            <span>Schedule Visit</span>
          </Button>
        </Link>
      </div>

      {loading ? <PageLoader /> : (
        <Table
          columns={columns}
          data={appointments}
          emptyMessage="No consultation bookings found."
          actions={(row) => (
            <>
              {row.status === 'Pending' && (
                <Button size="sm" variant="secondary" onClick={() => updateStatus(row._id || row.id, 'Approved')}>
                  Approve
                </Button>
              )}
              {row.status === 'Approved' && (
                <Button size="sm" variant="primary" onClick={() => updateStatus(row._id || row.id, 'Completed')}>
                  Complete
                </Button>
              )}
            </>
          )}
        />
      )}
    </div>
  );
}
