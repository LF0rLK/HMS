'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Card } from '@/components/common/Card';
import { Input, Select } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { BLOOD_GROUPS, GENDERS } from '@/lib/utils/constants';

export default function RegisterPatientPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { notify } = useNotification();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Male',
    dateOfBirth: '',
    address: '',
    bloodGroup: 'O+',
    role: 'patient',
    username: '',
    password: 'password123',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, val) => {
    setForm((prev) => ({
      ...prev,
      [field]: val,
      username: field === 'name' ? val.toLowerCase().replace(/\s+/g, '_') : prev.username,
      email: field === 'name' && !prev.email ? `${val.toLowerCase().replace(/\s+/g, '')}@patient.com` : prev.email,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      notify.success(`Patient profile for ${form.name} created!`);
      router.push('/receptionist/patients');
    } catch (err) {
      notify.error(err?.response?.data?.message || 'Failed to register patient profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[650px]">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">Register New Patient Profile</h1>
        <p className="text-body-sm text-text-secondary">Enter demographics record to instantiate Patient account.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input
              label="Full Name"
              id="p-name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Jane Miller"
              required
            />
          </div>

          <Input
            label="Email Address"
            id="p-email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="jane@domain.com"
            required
          />

          <Input
            label="Phone Number"
            id="p-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="555-0144"
            required
          />

          <Select
            label="Gender"
            id="p-gender"
            value={form.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            options={GENDERS}
          />

          <Input
            label="Date of Birth"
            id="p-dob"
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            required
          />

          <Select
            label="Blood Group"
            id="p-blood"
            value={form.bloodGroup}
            onChange={(e) => handleChange('bloodGroup', e.target.value)}
            options={BLOOD_GROUPS}
          />

          <Input
            label="Residential Address"
            id="p-address"
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Street address details…"
            required
          />

          <Button type="submit" variant="primary" size="lg" className="col-span-2 mt-2" disabled={loading}>
            {loading ? 'Registering…' : 'Save Patient Profile'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
