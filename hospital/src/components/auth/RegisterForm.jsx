'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Input, Select } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { BLOOD_GROUPS, GENDERS } from '@/lib/utils/constants';

export const RegisterForm = () => {
  const { register } = useAuth();
  const { notify } = useNotification();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    gender: 'Male',
    dateOfBirth: '',
    phone: '',
    address: '',
    bloodGroup: 'O+',
    role: 'patient',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      notify.success('Account created successfully!');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <Alert type="error" message={error} onDismiss={() => setError('')} />}

      <Input
        label="Full Name"
        id="reg-name"
        value={form.name}
        onChange={(e) => handleChange('name', e.target.value)}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Username"
          id="reg-username"
          value={form.username}
          onChange={(e) => handleChange('username', e.target.value)}
          required
        />
        <Input
          label="Email Address"
          id="reg-email"
          type="email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Password"
          id="reg-password"
          type="password"
          value={form.password}
          onChange={(e) => handleChange('password', e.target.value)}
          required
        />
        <Input
          label="Phone Number"
          id="reg-phone"
          type="tel"
          value={form.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Select
          label="Gender"
          id="reg-gender"
          value={form.gender}
          onChange={(e) => handleChange('gender', e.target.value)}
          options={GENDERS}
        />
        <Input
          label="Date of Birth"
          id="reg-dob"
          type="date"
          value={form.dateOfBirth}
          onChange={(e) => handleChange('dateOfBirth', e.target.value)}
          required
        />
        <Select
          label="Blood Group"
          id="reg-blood"
          value={form.bloodGroup}
          onChange={(e) => handleChange('bloodGroup', e.target.value)}
          options={BLOOD_GROUPS}
        />
      </div>

      <Input
        label="Address"
        id="reg-address"
        value={form.address}
        onChange={(e) => handleChange('address', e.target.value)}
        required
      />

      <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={loading}>
        {loading ? 'Creating Account…' : 'Register Account'}
      </Button>
    </form>
  );
};
