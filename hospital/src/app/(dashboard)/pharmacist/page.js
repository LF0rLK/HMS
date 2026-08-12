'use client';

import React from 'react';
import Link from 'next/link';
import { usePharmacy } from '@/lib/hooks/usePharmacy';
import { usePrescription } from '@/lib/hooks/usePrescription';
import { Card, StatCard } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { Package, FileText, Pill, PackagePlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getStatusVariant } from '@/lib/utils/formatter';

export default function PharmacistDashboard() {
  const { medicines, loading: loadingMeds } = usePharmacy();
  const { prescriptions, loading: loadingRx } = usePrescription();

  const isLoading = loadingMeds || loadingRx;
  const pendingRx = prescriptions.filter((p) => p.status === 'Prescribed');
  const lowStock = medicines.filter((m) => m.stock < 50);

  if (isLoading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-8">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bg-primary p-6 rounded-lg border border-border shadow-sm">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">Pharmacy Dispensary Portal</h1>
          <p className="text-body-sm text-text-secondary">Medicine stock tracking and prescription fulfillment.</p>
        </div>
        <Link href="/pharmacist/inventory/add">
          <Button className="flex items-center gap-2">
            <PackagePlus size={16} />
            <span>Add Stock Medicine</span>
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Medicine Stock" value={medicines.length} icon={Package} />
        <StatCard label="Pending Prescriptions" value={pendingRx.length} icon={FileText} color={pendingRx.length > 0 ? 'bias-left' : 'accent'} />
        <StatCard label="Low Stock Alerts" value={lowStock.length} icon={Pill} color={lowStock.length > 0 ? 'bias-left' : 'accent'} />
        <StatCard label="Total Dispensed" value={prescriptions.filter((p) => p.status === 'Dispensed').length} icon={Pill} />
      </div>

      {/* Prescription Queue */}
      <Card padding={false}>
        <div className="p-5 border-b border-border flex justify-between items-center">
          <h2 className="text-h4 font-bold text-text-primary">Fulfillment Queue</h2>
          <Link href="/pharmacist/prescriptions" className="text-caption text-accent hover:underline font-semibold">View All Prescriptions</Link>
        </div>
        <div className="divide-y divide-divider">
          {prescriptions.length === 0 ? (
            <div className="p-6 text-center text-body-sm text-text-secondary">No prescriptions in queue.</div>
          ) : (
            prescriptions.slice(0, 5).map((pr) => (
              <div key={pr._id || pr.id} className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-body-sm font-bold text-text-primary">{pr.patientId?.name || pr.patientName || 'John Doe'}</h4>
                  <p className="text-caption text-text-secondary">Diagnosis: {pr.diagnosis} &bull; Dr. {pr.doctorId?.name || pr.doctorName || 'Smith'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={getStatusVariant(pr.status)}>{pr.status}</Badge>
                  {pr.status === 'Prescribed' && (
                    <Link href="/pharmacist/dispense">
                      <Button size="sm" variant="primary">Dispense &rarr;</Button>
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
