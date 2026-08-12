'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Card } from '@/components/common/Card';
import { Input, Select } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { DEPARTMENTS } from '@/lib/utils/constants';

export default function AddDoctorPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { notify } = useNotification();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Cardiology');
  const [specialization, setSpecialization] = useState('Interventional Cardiology');
  const [phone, setPhone] = useState('123-456-7890');
  const [consultationFee, setConsultationFee] = useState(800);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({
        name,
        username: name.toLowerCase().replace(/\s+/g, '_'),
        email: email || `${name.toLowerCase().replace(/\s+/g, '')}@hms.com`,
        password: 'password123',
        role: 'doctor',
        department,
        specialization,
        phone,
        consultationFee: Number(consultationFee) || 500,
      });
      notify.success(`Doctor profile for ${name} created!`);
      router.push('/admin/doctors');
    } catch (err) {
      notify.error(err?.response?.data?.message || 'Failed to add doctor profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[600px]">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">Add Doctor Profile</h1>
        <p className="text-body-sm text-text-secondary">Register a new medical specialist to a hospital department.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input
              label="Doctor Full Name"
              id="doc-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Sarah Smith"
              required
            />
          </div>

          <Input
            label="Email Address"
            id="doc-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="doctor@hms.com"
            required
          />

          <Input
            label="Phone Number"
            id="doc-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <Select
            label="Department"
            id="doc-dept"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            options={DEPARTMENTS}
            required
          />

          <Input
            label="Specialization"
            id="doc-spec"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            placeholder="Interventional Cardiology"
            required
          />

          <div className="col-span-2">
            <Input
              label="Consultation Fee ($)"
              id="doc-fee"
              type="number"
              value={consultationFee}
              onChange={(e) => setConsultationFee(e.target.value)}
              required
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="col-span-2 mt-2" disabled={loading}>
            {loading ? 'Creating Profile…' : 'Register Doctor Profile'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
