'use client';

import React from 'react';
import Link from 'next/link';
import { Table } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/ui/badge';
import { UserPlus } from 'lucide-react';

export default function AdminStaffPage() {
  const staff = [
    { name: 'Reception Desk Agent', email: 'receptionist@hms.com', role: 'receptionist', department: 'Front Desk Intake' },
    { name: 'HMS Pharmacist Agent', email: 'pharmacist@hms.com', role: 'pharmacist', department: 'Central Pharmacy' },
    { name: 'Clinical Lab Technician', email: 'labstaff@hms.com', role: 'lab-staff', department: 'Pathology Diagnostics' },
  ];

  const columns = [
    { label: 'Staff Member', key: 'name' },
    { label: 'Email', key: 'email' },
    {
      label: 'Role',
      key: 'role',
      render: (val) => <Badge variant="neutral">{val}</Badge>,
    },
    { label: 'Department / Duty', key: 'department' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">Hospital Support Staff Directory</h1>
          <p className="text-body-sm text-text-secondary">Administrative, reception, lab, and pharmacy personnel.</p>
        </div>
        <Link href="/admin/users/add">
          <Button className="flex items-center gap-2">
            <UserPlus size={16} />
            <span>Add Staff Account</span>
          </Button>
        </Link>
      </div>

      <Table columns={columns} data={staff} emptyMessage="No staff accounts registered." />
    </div>
  );
}
