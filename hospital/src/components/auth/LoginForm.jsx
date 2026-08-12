'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';

export const LoginForm = () => {
  const { login } = useAuth();
  const { notify } = useNotification();
  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('patient@hms.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (r) => {
    setRole(r);
    setEmail(`${r.replace('-', '')}@hms.com`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password, role });
      notify.success(`Logged in as ${role}`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {error && <Alert type="error" message={error} onDismiss={() => setError('')} />}

      {/* Role Picker Quick Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-caption font-bold text-text-secondary uppercase tracking-wider select-none">
          Quick Role Selector
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'patient', label: 'Patient' },
            { value: 'doctor', label: 'Doctor' },
            { value: 'receptionist', label: 'Recep' },
            { value: 'pharmacist', label: 'Pharm' },
            { value: 'lab-staff', label: 'Lab' },
            { value: 'admin', label: 'Admin' },
          ].map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => handleRoleSelect(r.value)}
              className={`px-2 py-1.5 rounded-md border text-caption font-semibold transition-all cursor-pointer ${
                role === r.value
                  ? 'bg-text-primary text-bg-primary border-text-primary shadow-sm'
                  : 'bg-surface text-text-secondary border-border hover:bg-bg-secondary hover:text-text-primary'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email Address"
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={loading}>
          {loading ? 'Authenticating…' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
};
