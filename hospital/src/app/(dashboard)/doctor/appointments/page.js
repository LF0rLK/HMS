'use client';

import React from 'react';
import { useAppointment } from '@/lib/hooks/useAppointment';
import { Table } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { Badge } from '@/components/ui/badge';
import { formatDate, getStatusVariant } from '@/lib/utils/formatter';

export default function DoctorAppointmentsPage() {
  const { appointments, loading, updateStatus } = useAppointment();

  const columns = [
    { label: 'Patient Name', key: 'patientId', render: (val, row) => row.patientId?.name || row.patientName || 'John Doe' },
    { label: 'Visit Date', key: 'date', render: (val) => formatDate(val) },
    { label: 'Time Slot', key: 'slot' },
    { label: 'Notes', key: 'notes', render: (val) => val || 'General consult' },
    {
      label: 'Status',
      key: 'status',
      render: (val) => <Badge variant={getStatusVariant(val)}>{val}</Badge>,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">Clinical Consultations Calendar</h1>
        <p className="text-body-sm text-text-secondary">Approve visits and track patient appointment statuses.</p>
      </div>

      {loading ? <PageLoader /> : (
        <Table
          columns={columns}
          data={appointments}
          emptyMessage="No consultation bookings found in your schedule."
          actions={(row) => (
            <>
              {row.status === 'Pending' && (
                <Button size="sm" variant="secondary" onClick={() => updateStatus(row._id || row.id, 'Approved')}>
                  Approve
                </Button>
              )}
              {row.status === 'Approved' && (
                <Button size="sm" variant="primary" onClick={() => updateStatus(row._id || row.id, 'Completed')}>
                  Mark Complete
                </Button>
              )}
            </>
          )}
        />
      )}
    </div>
  );
}
