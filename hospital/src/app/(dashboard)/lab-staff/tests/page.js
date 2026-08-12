'use client';

import React from 'react';
import Link from 'next/link';
import { useLabTest } from '@/lib/hooks/useLabTest';
import { Table } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { Badge } from '@/components/ui/badge';
import { formatDate, getStatusVariant } from '@/lib/utils/formatter';
import { Clock } from 'lucide-react';

export default function LabStaffTestsPage() {
  const { labTests, loading } = useLabTest();

  const columns = [
    { label: 'Patient Name', key: 'patientId', render: (val, row) => row.patientId?.name || row.patientName || 'John Doe' },
    { label: 'Test Profile', key: 'testName' },
    { label: 'Ordered By', key: 'doctorId', render: (val, row) => row.doctorId?.name || row.doctorName || 'Dr. Sarah Smith' },
    { label: 'Request Date', key: 'requestDate', render: (val) => formatDate(val) },
    {
      label: 'Status',
      key: 'status',
      render: (val) => <Badge variant={getStatusVariant(val)}>{val}</Badge>,
    },
    {
      label: 'Findings Result',
      key: 'results',
      render: (val) => <span className="font-mono font-semibold text-accent">{val || 'Awaiting Clinical Upload'}</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">Laboratory Test Registry</h1>
          <p className="text-body-sm text-text-secondary">View all diagnostic specimen work orders.</p>
        </div>
        <Link href="/lab-staff/tests/pending">
          <Button className="flex items-center gap-2">
            <Clock size={16} />
            <span>Process Pending</span>
          </Button>
        </Link>
      </div>

      {loading ? <PageLoader /> : (
        <Table columns={columns} data={labTests} emptyMessage="No laboratory panel tests on record." />
      )}
    </div>
  );
}
