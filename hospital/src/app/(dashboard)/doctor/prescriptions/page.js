'use client';

import React from 'react';
import Link from 'next/link';
import { usePrescription } from '@/lib/hooks/usePrescription';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { Badge } from '@/components/ui/badge';
import { formatDate, getStatusVariant } from '@/lib/utils/formatter';
import { Plus } from 'lucide-react';

export default function DoctorPrescriptionsPage() {
  const { prescriptions, loading } = usePrescription();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">Authorized Prescriptions Catalog</h1>
          <p className="text-body-sm text-text-secondary">View past medications records authored for patients.</p>
        </div>
        <Link href="/doctor/prescriptions/create">
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            <span>Write Prescription</span>
          </Button>
        </Link>
      </div>

      {loading ? <PageLoader /> : (
        <div className="flex flex-col gap-4">
          {prescriptions.length === 0 ? (
            <Card className="text-center text-text-secondary py-12">No prescriptions recorded.</Card>
          ) : (
            prescriptions.map((pr) => (
              <Card key={pr._id || pr.id} className="flex flex-col gap-3">
                <div className="flex justify-between items-center select-none">
                  <div>
                    <h3 className="text-h4 font-bold text-text-primary">Patient: {pr.patientId?.name || pr.patientName || 'John Doe'}</h3>
                    <p className="text-caption text-text-secondary">Diagnosis: {pr.diagnosis} &bull; Date: {formatDate(pr.date)}</p>
                  </div>
                  <Badge variant={getStatusVariant(pr.status)}>{pr.status}</Badge>
                </div>
                <div className="border-t border-divider pt-2 mt-2">
                  {pr.medicines?.map((m, idx) => (
                    <div key={idx} className="text-body-sm text-text-secondary">
                      &bull; <strong className="text-text-primary">{m.medicineId?.name || m.name}</strong> - {m.dosage} for {m.duration} ({m.instructions})
                    </div>
                  ))}
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
