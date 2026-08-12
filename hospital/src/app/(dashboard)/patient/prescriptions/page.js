'use client';

import React from 'react';
import { usePrescription } from '@/lib/hooks/usePrescription';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { Badge } from '@/components/ui/badge';
import { formatDate, getStatusVariant } from '@/lib/utils/formatter';
import { downloadPrescriptionPdf } from '@/lib/utils/pdfGenerator';
import { Download } from 'lucide-react';

export default function PatientPrescriptionsPage() {
  const { prescriptions, loading } = usePrescription();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">My Prescriptions</h1>
        <p className="text-body-sm text-text-secondary">View electronic prescriptions authored by your doctors.</p>
      </div>

      {loading ? <PageLoader /> : (
        <div className="flex flex-col gap-4">
          {prescriptions.length === 0 ? (
            <Card className="text-center text-text-secondary py-12">No prescriptions on record.</Card>
          ) : (
            prescriptions.map((pr) => (
              <Card key={pr._id || pr.id} className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-h4 font-bold text-text-primary">Diagnosis: {pr.diagnosis}</h3>
                    <p className="text-caption text-text-secondary">
                      Prescribed by {pr.doctorId?.name || pr.doctorName || 'Dr. Sarah Smith'} on {formatDate(pr.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusVariant(pr.status)}>{pr.status}</Badge>
                    <Button size="sm" variant="outline" onClick={() => downloadPrescriptionPdf(pr)}>
                      <Download size={13} className="mr-1.5" />
                      PDF
                    </Button>
                  </div>
                </div>

                <div className="border-t border-divider pt-3">
                  <h4 className="text-caption font-bold text-text-secondary uppercase select-none mb-2">Prescribed Items</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pr.medicines?.map((m, idx) => (
                      <div key={idx} className="p-3 bg-surface rounded-md border border-border">
                        <p className="text-body-sm font-semibold text-text-primary">{m.medicineId?.name || m.name}</p>
                        <div className="flex gap-4 text-caption text-text-secondary mt-1">
                          <span>Dosage: <strong className="text-text-primary">{m.dosage}</strong></span>
                          <span>Duration: <strong className="text-text-primary">{m.duration}</strong></span>
                        </div>
                        {m.instructions && (
                          <p className="text-[11px] text-text-secondary italic mt-1 font-medium">*{m.instructions}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
