'use client';

import React, { useState } from 'react';
import { usePatient } from '@/lib/hooks/usePatient';
import { Table } from '@/components/common/Table';
import { PageLoader } from '@/components/common/Loader';
import { Input } from '@/components/common/Input';
import { formatDate } from '@/lib/utils/formatter';
import { Search } from 'lucide-react';

export default function DoctorPatientsPage() {
  const { patients, loading } = usePatient();
  const [query, setQuery] = useState('');

  const filtered = patients.filter(
    (p) =>
      p.name?.toLowerCase().includes(query.toLowerCase()) ||
      p.phone?.includes(query) ||
      p.bloodGroup?.includes(query)
  );

  const columns = [
    { label: 'Patient Name', key: 'name' },
    { label: 'Gender', key: 'gender' },
    { label: 'Date of Birth', key: 'dateOfBirth', render: (val) => formatDate(val) },
    { label: 'Phone', key: 'phone' },
    { label: 'Blood Group', key: 'bloodGroup', render: (val) => <span className="font-bold text-accent">{val || 'O+'}</span> },
    { label: 'Address', key: 'address' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">Patient Records Directory</h1>
        <p className="text-body-sm text-text-secondary">Access registered patient health demographic cards.</p>
      </div>

      <div className="flex gap-3 bg-bg-primary p-3 rounded-md border border-border shadow-sm max-w-[480px]">
        <Search className="text-text-secondary self-center ml-2" size={18} />
        <input
          type="text"
          placeholder="Search patient name, phone, or blood type…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent text-body-sm text-text-primary focus:outline-none"
        />
      </div>

      {loading ? <PageLoader /> : (
        <Table columns={columns} data={filtered} emptyMessage="No matching patient records found." />
      )}
    </div>
  );
}
