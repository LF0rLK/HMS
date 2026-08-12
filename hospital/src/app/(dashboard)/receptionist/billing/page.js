'use client';

import React from 'react';
import Link from 'next/link';
import { useBilling } from '@/lib/hooks/useBilling';
import { useNotification } from '@/context/NotificationContext';
import { Table } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatCurrency, getStatusVariant } from '@/lib/utils/formatter';
import { Receipt } from 'lucide-react';

export default function ReceptionistBillingPage() {
  const { bills, loading, pay } = useBilling();
  const { notify } = useNotification();

  const handlePayCash = async (id) => {
    try {
      await pay(id, 'Cash');
      notify.success('Invoice marked as paid (Cash)!');
    } catch (err) {
      notify.error(err?.response?.data?.message || 'Failed to update payment');
    }
  };

  const columns = [
    { label: 'Bill ID', key: '_id', render: (val, row) => <span className="font-mono font-bold text-text-secondary">#{row._id || row.id}</span> },
    { label: 'Patient Name', key: 'patientId', render: (val, row) => row.patientId?.name || row.patientName || 'John Doe' },
    { label: 'Date', key: 'billingDate', render: (val, row) => formatDate(val || row.createdAt) },
    { label: 'Total Amount', key: 'grandTotal', render: (val) => <span className="font-semibold text-accent">{formatCurrency(val)}</span> },
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
          <h1 className="text-h2 font-bold text-text-primary">Billing Ledger Desk</h1>
          <p className="text-body-sm text-text-secondary">View and process in-person settlements for all patient invoices.</p>
        </div>
        <Link href="/receptionist/billing/generate">
          <Button className="flex items-center gap-2">
            <Receipt size={16} />
            <span>Generate Invoice</span>
          </Button>
        </Link>
      </div>

      {loading ? <PageLoader /> : (
        <Table
          columns={columns}
          data={bills}
          emptyMessage="No billing ledger entries found."
          actions={(row) => (
            row.status === 'Unpaid' && (
              <Button size="sm" variant="secondary" onClick={() => handlePayCash(row._id || row.id)}>
                Mark Paid (Cash)
              </Button>
            )
          )}
        />
      )}
    </div>
  );
}
