'use client';

import React from 'react';
import { useLabTest } from '@/lib/hooks/useLabTest';
import { Table } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { Badge } from '@/components/ui/badge';
import { formatDate, getStatusVariant } from '@/lib/utils/formatter';
import { downloadLabReportPdf } from '@/lib/utils/pdfGenerator';
import { Download } from 'lucide-react';

export default function PatientLabReportsPage() {
  const { labTests, loading } = useLabTest();

  const columns = [
    { label: 'Investigation Test', key: 'testName' },
    { label: 'Ordered By', key: 'doctorId', render: (val, row) => row.doctorId?.name || row.doctorName || 'Dr. Sarah Smith' },
    { label: 'Request Date', key: 'requestDate', render: (val) => formatDate(val) },
    { label: 'Completed Date', key: 'completedDate', render: (val) => formatDate(val) },
    {
      label: 'Status',
      key: 'status',
      render: (val) => <Badge variant={getStatusVariant(val)}>{val}</Badge>,
    },
    {
      label: 'Findings Result',
      key: 'results',
      render: (val) => <span className="font-mono font-semibold text-accent">{val || 'Pending Analysis'}</span>,
    },
    {
      label: '',
      key: '_id',
      render: (_, row) => (
        <Button size="sm" variant="outline" onClick={() => downloadLabReportPdf(row)}>
          <Download size={12} className="mr-1" />
          PDF
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">Lab Diagnostic Reports</h1>
        <p className="text-body-sm text-text-secondary">Access findings from ordered laboratory diagnostic screenings.</p>
      </div>

      {loading ? <PageLoader /> : (
        <Table columns={columns} data={labTests} emptyMessage="No laboratory diagnostic tests requested." />
      )}
    </div>
  );
}
