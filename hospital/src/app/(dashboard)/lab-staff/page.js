'use client';

import React from 'react';
import Link from 'next/link';
import { useLabTest } from '@/lib/hooks/useLabTest';
import { Card, StatCard } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { FlaskConical, Clock, CheckCircle2 } from 'lucide-react';
import { Table } from '@/components/common/Table';
import { Badge } from '@/components/ui/badge';
import { formatDate, getStatusVariant } from '@/lib/utils/formatter';

export default function LabStaffDashboard() {
  const { labTests, loading } = useLabTest();

  const pendingTests = labTests.filter((t) => t.status === 'Requested');
  const completedTests = labTests.filter((t) => t.status === 'Completed');

  const columns = [
    { label: 'Patient Name', key: 'patientId', render: (val, row) => row.patientId?.name || row.patientName || 'John Doe' },
    { label: 'Test Profile', key: 'testName' },
    { label: 'Request Date', key: 'requestDate', render: (val) => formatDate(val) },
    {
      label: 'Status',
      key: 'status',
      render: (val) => <Badge variant={getStatusVariant(val)}>{val}</Badge>,
    },
  ];

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-8">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bg-primary p-6 rounded-lg border border-border shadow-sm">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">Clinical Pathology Lab Portal</h1>
          <p className="text-body-sm text-text-secondary">Process specimen work orders and log diagnostic findings.</p>
        </div>
        <Link href="/lab-staff/tests/pending">
          <Button className="flex items-center gap-2">
            <Clock size={16} />
            <span>Process Pending Tests</span>
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Lab Work Orders" value={labTests.length} icon={FlaskConical} />
        <StatCard label="Pending Analysis" value={pendingTests.length} icon={Clock} color={pendingTests.length > 0 ? 'bias-left' : 'accent'} />
        <StatCard label="Completed Diagnostic Panel" value={completedTests.length} icon={CheckCircle2} color="green-600" />
      </div>

      {/* Test Queue */}
      <Card padding={false}>
        <div className="p-5 border-b border-border flex justify-between items-center">
          <h2 className="text-h4 font-bold text-text-primary">Diagnostic Specimen Queue</h2>
          <Link href="/lab-staff/tests" className="text-caption text-accent hover:underline font-semibold">View All Tests</Link>
        </div>
        <Table columns={columns} data={labTests} emptyMessage="No laboratory panel tests recorded." />
      </Card>
    </div>
  );
}
