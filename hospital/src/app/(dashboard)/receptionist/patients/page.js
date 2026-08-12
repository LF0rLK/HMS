'use client';

import React from 'react';
import Link from 'next/link';
import { usePatient } from '@/lib/hooks/usePatient';
import { Table } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { formatDate } from '@/lib/utils/formatter';
import { UserPlus, Search } from 'lucide-react';

export default function ReceptionistPatientsPage() {
  const { patients, loading } = usePatient();

  const columns = [
    { label: 'Name', key: 'name' },
    { label: 'Gender', key: 'gender' },
    { label: 'Date of Birth', key: 'dateOfBirth', render: (val) => formatDate(val) },
    { label: 'Phone Number', key: 'phone' },
    { label: 'Blood Group', key: 'bloodGroup', render: (val) => <span className="font-bold text-accent">{val || 'O+'}</span> },
    { label: 'Address', key: 'address' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">Patient Directory</h1>
          <p className="text-body-sm text-text-secondary">Full database of registered hospital patients.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/receptionist/patients/search">
            <Button variant="outline" className="flex items-center gap-2">
              <Search size={16} />
              <span>Search</span>
            </Button>
          </Link>
          <Link href="/receptionist/patients/register">
            <Button className="flex items-center gap-2">
              <UserPlus size={16} />
              <span>Register Patient</span>
            </Button>
          </Link>
        </div>
      </div>

      {loading ? <PageLoader /> : (
        <Table columns={columns} data={patients} emptyMessage="No registered patients in system." />
      )}
    </div>
  );
}
