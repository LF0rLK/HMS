'use client';

import React, { useState } from 'react';
import { usePrescription } from '@/lib/hooks/usePrescription';
import { useNotification } from '@/context/NotificationContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { Badge } from '@/components/ui/badge';
import { getStatusVariant } from '@/lib/utils/formatter';

export default function DispensePage() {
  const { prescriptions, loading, dispense } = usePrescription();
  const { notify } = useNotification();
  const [loadingId, setLoadingId] = useState(null);

  const pending = prescriptions.filter((p) => p.status === 'Prescribed');

  const handleFulfill = async (id) => {
    setLoadingId(id);
    try {
      await dispense(id);
      notify.success('Prescription items dispensed and inventory updated!');
    } catch (err) {
      notify.error(err?.response?.data?.message || 'Dispensing failed');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">Fulfillment & Medication Dispense</h1>
        <p className="text-body-sm text-text-secondary">Process unfulfilled prescription items.</p>
      </div>

      {loading ? <PageLoader /> : (
        <div className="flex flex-col gap-4 max-w-[750px]">
          {pending.length === 0 ? (
            <Card className="text-center text-text-secondary py-12">
              No pending prescriptions to dispense. All orders fulfilled!
            </Card>
          ) : (
            pending.map((pr) => (
              <Card key={pr._id || pr.id} className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-h4 font-bold text-text-primary">Patient: {pr.patientId?.name || pr.patientName || 'John Doe'}</h3>
                    <p className="text-caption text-text-secondary">Diagnosis: {pr.diagnosis}</p>
                  </div>
                  <Badge variant={getStatusVariant(pr.status)}>{pr.status}</Badge>
                </div>

                <div className="border-t border-divider pt-3 flex flex-col gap-2">
                  <span className="text-caption font-bold text-text-secondary uppercase select-none">Medications</span>
                  {pr.medicines?.map((m, idx) => (
                    <div key={idx} className="flex justify-between text-body-sm bg-surface p-2 rounded-md">
                      <span>{m.medicineId?.name || m.name}</span>
                      <span className="font-semibold text-text-primary">{m.dosage} &bull; {m.duration}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant="primary"
                  size="md"
                  className="w-full mt-2"
                  onClick={() => handleFulfill(pr._id || pr.id)}
                  disabled={loadingId === (pr._id || pr.id)}
                >
                  {loadingId === (pr._id || pr.id) ? 'Dispensing…' : 'Complete Medication Fulfillment'}
                </Button>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
