'use client';

import React from 'react';
import Link from 'next/link';
import { useDoctor } from '@/lib/hooks/useDoctor';
import { Table } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { formatCurrency } from '@/lib/utils/formatter';
import { UserPlus } from 'lucide-react';

export default function AdminDoctorsPage() {
  const { doctors, loading } = useDoctor();

  const columns = [
    { label: 'Doctor Name', key: 'name' },
    { label: 'Department', key: 'department' },
    { label: 'Specialization', key: 'specialization' },
    { label: 'Phone', key: 'phone' },
    { label: 'Email', key: 'email' },
    { label: 'Consultation Fee', key: 'consultationFee', render: (val) => formatCurrency(val || 800) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">Medical Staff Roster</h1>
          <p className="text-body-sm text-text-secondary">View clinicians, departments, and consultation rates.</p>
        </div>
        <Link href="/admin/doctors/add">
          <Button className="flex items-center gap-2">
            <UserPlus size={16} />
            <span>Add Doctor Profile</span>
          </Button>
        </Link>
      </div>

      {loading ? <PageLoader /> : (
        <Table columns={columns} data={doctors} emptyMessage="No doctor profiles registered." />
      )}
    </div>
  );
}
