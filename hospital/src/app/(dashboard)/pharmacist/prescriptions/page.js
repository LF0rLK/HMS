'use client';

import React from 'react';
import { usePrescription } from '@/lib/hooks/usePrescription';
import { useNotification } from '@/context/NotificationContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { Badge } from '@/components/ui/badge';
import { formatDate, getStatusVariant } from '@/lib/utils/formatter';

export default function PharmacistPrescriptionsPage() {
  const { prescriptions, loading, dispense } = usePrescription();
  const { notify } = useNotification();

  const handleDispense = async (id) => {
    try {
      await dispense(id);
      notify.success('Prescription dispensed & pharmacy invoice generated!');
    } catch (err) {
      notify.error(err?.response?.data?.message || 'Failed to dispense prescription');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">Authorized Prescriptions Queue</h1>
        <p className="text-body-sm text-text-secondary">Dispense pharmaceuticals and automatically adjust inventory stock.</p>
      </div>

      {loading ? <PageLoader /> : (
        <div className="flex flex-col gap-4">
          {prescriptions.length === 0 ? (
            <Card className="text-center text-text-secondary py-12">No prescriptions in queue.</Card>
          ) : (
            prescriptions.map((pr) => (
              <Card key={pr._id || pr.id} className="flex flex-col gap-4">
                <div className="flex justify-between items-center select-none">
                  <div>
                    <h3 className="text-h4 font-bold text-text-primary">Patient: {pr.patientId?.name || pr.patientName || 'John Doe'}</h3>
                    <p className="text-caption text-text-secondary">
                      Prescribed by Dr. {pr.doctorId?.name || pr.doctorName || 'Smith'} &bull; Diagnosis: {pr.diagnosis} &bull; {formatDate(pr.date)}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(pr.status)}>{pr.status}</Badge>
                </div>

                <div className="border-t border-divider pt-3">
                  <h4 className="text-caption font-bold text-text-secondary uppercase select-none mb-2">Prescribed Items</h4>
                  <div className="flex flex-col gap-1.5 mb-4">
                    {pr.medicines?.map((m, idx) => (
                      <div key={idx} className="text-body-sm text-text-secondary flex justify-between max-w-[420px]">
                        <span>&bull; {m.medicineId?.name || m.name}</span>
                        <span className="font-semibold text-text-primary">{m.dosage} &bull; {m.duration}</span>
                      </div>
                    ))}
                  </div>

                  {pr.status === 'Prescribed' && (
                    <Button size="sm" variant="primary" onClick={() => handleDispense(pr._id || pr.id)}>
                      Dispense & Settle Medicine Invoice
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
