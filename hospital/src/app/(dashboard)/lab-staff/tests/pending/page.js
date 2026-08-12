'use client';

import React, { useState } from 'react';
import { useLabTest } from '@/lib/hooks/useLabTest';
import { useNotification } from '@/context/NotificationContext';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/ui/badge';
import { formatDate, getStatusVariant } from '@/lib/utils/formatter';

export default function PendingLabTestsPage() {
  const { labTests, loading, complete } = useLabTest();
  const { notify } = useNotification();

  const [activeTest, setActiveTest] = useState(null);
  const [resultsText, setResultsText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const pending = labTests.filter((t) => t.status === 'Requested');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeTest || !resultsText) return;
    setSubmitting(true);
    try {
      await complete(activeTest._id || activeTest.id, resultsText);
      notify.success('Diagnostic results uploaded successfully!');
      setActiveTest(null);
      setResultsText('');
    } catch (err) {
      notify.error(err?.response?.data?.message || 'Failed to complete lab test');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">Pending Specimen Work Orders</h1>
        <p className="text-body-sm text-text-secondary">Submit lab diagnostic findings for active test panels.</p>
      </div>

      {loading ? <PageLoader /> : (
        <div className="flex flex-col gap-4 max-w-[750px]">
          {pending.length === 0 ? (
            <Card className="text-center text-text-secondary py-12">
              No pending laboratory tests to process. Specimen queue clean!
            </Card>
          ) : (
            pending.map((t) => (
              <Card key={t._id || t.id} className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-h4 font-bold text-text-primary">{t.testName}</h3>
                    <p className="text-caption text-text-secondary">
                      Patient: {t.patientId?.name || t.patientName || 'John Doe'} &bull; Requested on {formatDate(t.requestDate)}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(t.status)}>{t.status}</Badge>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => { setActiveTest(t); setResultsText(''); }}
                >
                  Analyze Specimen & Upload Findings
                </Button>
              </Card>
            ))
          )}
        </div>
      )}

      <Modal isOpen={!!activeTest} onClose={() => setActiveTest(null)} title="Submit Diagnostic Findings">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Diagnostic Observations / Findings"
            id="lab-results-input"
            value={resultsText}
            onChange={(e) => setResultsText(e.target.value)}
            placeholder="e.g. Hemoglobin 14.5 g/dL, Normal Fasting Glucose 95 mg/dL"
            required
          />
          <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Upload Lab Panel Results'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
