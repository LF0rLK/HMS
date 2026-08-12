'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Card } from '@/components/common/Card';
import { Input, Select } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { ROLES } from '@/lib/utils/constants';

export default function AddUserPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { notify } = useNotification();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('receptionist');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({
        name,
        username: username || name.toLowerCase().replace(/\s+/g, '_'),
        email,
        password,
        role,
        gender: 'Male',
        dateOfBirth: '1990-01-01',
        phone: '555-0100',
        address: 'Hospital Staff Quarter',
      });
      notify.success(`User account for ${name} (${role}) created!`);
      router.push('/admin/users');
    } catch (err) {
      notify.error(err?.response?.data?.message || 'Failed to create user account');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = Object.values(ROLES).map((r) => ({ value: r, label: r.toUpperCase() }));

  return (
    <div className="flex flex-col gap-6 max-w-[600px]">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">Add System User Account</h1>
        <p className="text-body-sm text-text-secondary">Provision a new credential profile for staff or medical personnel.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            id="usr-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Dr. Alex Mercer"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Username"
              id="usr-uname"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="alex_mercer"
            />
            <Input
              label="Email Address"
              id="usr-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@hms.com"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Password"
              id="usr-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Select
              label="Assigned Role"
              id="usr-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={roleOptions}
              required
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="mt-2" disabled={loading}>
            {loading ? 'Creating Account…' : 'Create User Account'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
