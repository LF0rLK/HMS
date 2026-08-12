'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Table } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Search } from 'lucide-react';

export default function AdminUsersPage() {
  const [query, setQuery] = useState('');

  // Standard user list
  const users = [
    { id: '1', name: 'HMS Admin Manager', email: 'admin@hms.com', role: 'admin', detail: 'System Root Administrator' },
    { id: '2', name: 'Dr. Sarah Smith', email: 'doctor@hms.com', role: 'doctor', detail: 'Cardiology Department' },
    { id: '3', name: 'Dr. Robert Jones', email: 'jones@hms.com', role: 'doctor', detail: 'Pediatrics Department' },
    { id: '4', name: 'Reception Desk Agent', email: 'receptionist@hms.com', role: 'receptionist', detail: 'Front Desk Patient Intake' },
    { id: '5', name: 'HMS Pharmacist Agent', email: 'pharmacist@hms.com', role: 'pharmacist', detail: 'Pharmacy Inventory' },
    { id: '6', name: 'Clinical Lab Technician', email: 'labstaff@hms.com', role: 'lab-staff', detail: 'Pathology Specimen Lab' },
    { id: '7', name: 'John Doe', email: 'patient@hms.com', role: 'patient', detail: 'Patient Portal Account' },
  ];

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      u.role.toLowerCase().includes(query.toLowerCase())
  );

  const columns = [
    { label: 'Full Name', key: 'name' },
    { label: 'Email Address', key: 'email' },
    {
      label: 'Role',
      key: 'role',
      render: (val) => <Badge variant={val === 'admin' ? 'left' : val === 'doctor' ? 'right' : 'neutral'}>{val}</Badge>,
    },
    { label: 'Scope Detail', key: 'detail', render: (val) => <span className="text-text-secondary italic">{val}</span> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">User Privileges Directory</h1>
          <p className="text-body-sm text-text-secondary">Manage user accounts and system access roles.</p>
        </div>
        <Link href="/admin/users/add">
          <Button className="flex items-center gap-2">
            <UserPlus size={16} />
            <span>Add User</span>
          </Button>
        </Link>
      </div>

      <div className="flex gap-3 bg-bg-primary p-3 rounded-md border border-border shadow-sm max-w-[450px]">
        <Search className="text-text-secondary self-center ml-2" size={18} />
        <input
          type="text"
          placeholder="Filter name, email, or role…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent text-body-sm text-text-primary focus:outline-none"
        />
      </div>

      <Table columns={columns} data={filtered} emptyMessage="No user accounts match criteria." />
    </div>
  );
}
