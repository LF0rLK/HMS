'use client';

import React from 'react';
import { Card } from '@/components/common/Card';
import { Terminal } from 'lucide-react';

export default function AdminLogsPage() {
  const logs = [
    { time: '22:42:01', level: 'INFO', module: 'REST API', message: 'SQLite driver active. Healthcheck OK (200).' },
    { time: '22:40:15', level: 'INFO', module: 'AUTH', message: 'User session rehydrated: doctor@hms.com [JWT valid].' },
    { time: '22:38:22', level: 'INFO', module: 'BILLING', message: 'Generated consultation invoice #b_17224623. Status: Unpaid.' },
    { time: '22:35:10', level: 'INFO', module: 'PHARMACY', message: 'Medicine stock updated for Atorvastatin 10mg (300 units remaining).' },
    { time: '22:30:05', level: 'INFO', module: 'SEEDER', message: 'Pre-populated collections: 2 Doctors, 1 Patient, 5 Medicines.' },
    { time: '22:25:00', level: 'WARN', module: 'CORS', message: 'Ignored unparseable entry in local .npmrc config.' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">System Audit Log Inspection</h1>
        <p className="text-body-sm text-text-secondary">Real-time HTTP execution log trails and system event history.</p>
      </div>

      <Card className="flex flex-col gap-4">
        <h3 className="text-h4 font-bold text-text-primary flex items-center gap-2">
          <Terminal size={18} className="text-accent" />
          <span>Operational Event Console</span>
        </h3>

        <div className="bg-text-primary text-bg-primary font-mono text-body-sm p-4 rounded-md flex flex-col gap-2 overflow-x-auto scrollbar-thin select-none">
          {logs.map((l, idx) => (
            <div key={idx} className="flex gap-4">
              <span className="text-text-secondary font-semibold">[{l.time}]</span>
              <span className={l.level === 'WARN' ? 'text-yellow-400 font-bold' : 'text-accent font-bold'}>{l.level}</span>
              <span className="text-bg-secondary font-bold">[{l.module}]</span>
              <span className="text-bg-primary">{l.message}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
