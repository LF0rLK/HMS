'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLabTest } from '@/lib/hooks/useLabTest';
import { usePatient } from '@/lib/hooks/usePatient';
import { useNotification } from '@/context/NotificationContext';
import { Card } from '@/components/common/Card';
import { Select } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { LAB_PANELS } from '@/lib/utils/constants';

export default function RequestLabTestPage() {
  const router = useRouter();
  const { request } = useLabTest();
  const { patients } = usePatient();
  const { notify } = useNotification();

  const [patientId, setPatientId] = useState('');
  const [testName, setTestName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!testName) return;
    setLoading(true);
    try {
      await request({ patientId, testName });
      notify.success('Diagnostic laboratory test requested!');
      router.push('/doctor/lab-tests');
    } catch (err) {
      notify.error(err?.response?.data?.message || 'Failed to request lab test');
    } finally {
      setLoading(false);
    }
  };

  const patOptions = patients.map((p) => ({ value: p._id || p.id, label: `${p.name} (Blood Group: ${p.bloodGroup || 'O+'})` }));

  return (
    <div className="flex flex-col gap-6 max-w-[600px]">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">Order Diagnostic Lab Screening</h1>
        <p className="text-body-sm text-text-secondary">Submit lab investigation work orders for patients.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Select
            label="Patient Profile"
            id="lab-pat"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            options={patOptions.length > 0 ? patOptions : [{ value: 'p1', label: 'John Doe' }]}
            required
            placeholder="-- Choose Patient --"
          />

          <Select
            label="Investigation Test Panel Profile"
            id="lab-test-name"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            options={LAB_PANELS}
            required
            placeholder="-- Select Diagnostic Panel --"
          />

          <Button type="submit" variant="primary" size="lg" className="mt-2" disabled={loading || !testName}>
            {loading ? 'Submitting Request…' : 'Submit Laboratory Request'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
