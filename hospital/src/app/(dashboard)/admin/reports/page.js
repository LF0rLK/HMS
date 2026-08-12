'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { TrendingUp, Terminal, BarChart2 } from 'lucide-react';

export default function AdminReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">Hospital Management Reports</h1>
        <p className="text-body-sm text-text-secondary">Analytics dashboards, ledger statements, and operational logs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col gap-3">
          <TrendingUp className="text-accent" size={28} />
          <h3 className="text-h3 font-bold text-text-primary">System Performance Analytics</h3>
          <p className="text-body-sm text-text-secondary">
            Comprehensive charts and metrics on patient throughput, department utilization, and revenue distribution.
          </p>
          <Link href="/admin/reports/analytics" className="mt-2">
            <Button variant="primary">View Analytics Dashboard &rarr;</Button>
          </Link>
        </Card>

        <Card className="flex flex-col gap-3">
          <Terminal className="text-accent" size={28} />
          <h3 className="text-h3 font-bold text-text-primary">Audit Log Inspection</h3>
          <p className="text-body-sm text-text-secondary">
            Real-time HTTP request trace logs, system events, and security access audit trails.
          </p>
          <Link href="/admin/reports/logs" className="mt-2">
            <Button variant="outline">Inspect System Audit Logs &rarr;</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
