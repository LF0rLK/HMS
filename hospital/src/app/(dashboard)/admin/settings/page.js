'use client';

import React, { useState } from 'react';
import { useNotification } from '@/context/NotificationContext';
import { Card, CardHeader } from '@/components/common/Card';
import { Input, Select } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

export default function AdminSettingsPage() {
  const { notify } = useNotification();
  const [appName, setAppName] = useState('Hospital Management System');
  const [apiBaseUrl, setApiBaseUrl] = useState('http://localhost:5000/api');
  const [taxRate, setTaxRate] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      notify.success('System preferences saved successfully!');
      setLoading(false);
    }, 400);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[600px]">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">System Preferences & Settings</h1>
        <p className="text-body-sm text-text-secondary">Configure platform parameters and endpoint connections.</p>
      </div>

      <Card>
        <CardHeader title="Global Configuration" subtitle="Configure system parameters" />
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Hospital Application Name"
            id="sys-app-name"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            required
          />

          <Input
            label="REST API Base URL Endpoint"
            id="sys-api-url"
            value={apiBaseUrl}
            onChange={(e) => setApiBaseUrl(e.target.value)}
            required
          />

          <Input
            label="Default Sales Tax Rate (%)"
            id="sys-tax-rate"
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" size="lg" className="mt-2" disabled={loading}>
            {loading ? 'Saving…' : 'Save System Settings'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
