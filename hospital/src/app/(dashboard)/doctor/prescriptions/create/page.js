'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrescription } from '@/lib/hooks/usePrescription';
import { usePatient } from '@/lib/hooks/usePatient';
import { usePharmacy } from '@/lib/hooks/usePharmacy';
import { useNotification } from '@/context/NotificationContext';
import { Card } from '@/components/common/Card';
import { Select, Input, Textarea } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Plus, Trash2 } from 'lucide-react';

export default function CreatePrescriptionPage() {
  const router = useRouter();
  const { create } = usePrescription();
  const { patients } = usePatient();
  const { medicines: stockMeds } = usePharmacy();
  const { notify } = useNotification();

  const [patientId, setPatientId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');

  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('1-0-1');
  const [duration, setDuration] = useState('7 days');
  const [instructions, setInstructions] = useState('After food');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddItem = () => {
    if (!medName) return;
    const med = stockMeds.find((m) => m._id === medName || m.name === medName);
    setItems((prev) => [
      ...prev,
      {
        medicineId: med?._id || 'm1',
        name: med?.name || medName,
        dosage,
        duration,
        instructions,
      },
    ]);
    setMedName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      notify.warning('Please add at least one medicine item');
      return;
    }
    setLoading(true);
    try {
      await create({ patientId, diagnosis, medicines: items, notes });
      notify.success('Prescription authorized successfully!');
      router.push('/doctor/prescriptions');
    } catch (err) {
      notify.error(err?.response?.data?.message || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  const patOptions = patients.map((p) => ({ value: p._id || p.id, label: `${p.name} (DOB: ${p.dateOfBirth || 'N/A'})` }));
  const medOptions = stockMeds.map((m) => ({ value: m._id || m.id, label: `${m.name} (${m.stock} left) - $${m.price}/unit` }));

  return (
    <div className="flex flex-col gap-6 max-w-[700px]">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">Authorize Electronic Prescription</h1>
        <p className="text-body-sm text-text-secondary">Specify patient diagnosis and pharmaceutical medication regimen.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Select
            label="Select Patient"
            id="rx-pat"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            options={patOptions.length > 0 ? patOptions : [{ value: 'p1', label: 'John Doe' }]}
            required
            placeholder="-- Choose Patient --"
          />

          <Input
            label="Primary Diagnosis"
            id="rx-diag"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="e.g. Acute Bronchitis"
            required
          />

          {/* Add Medicine Item Subform */}
          <div className="p-4 bg-surface rounded-md border border-border flex flex-col gap-3">
            <h4 className="text-body-sm font-bold text-text-primary">Add Pharmaceutical Item</h4>
            
            <Select
              label="Medicine Stock Item"
              id="rx-med-select"
              value={medName}
              onChange={(e) => setMedName(e.target.value)}
              options={medOptions.length > 0 ? medOptions : [
                { value: 'Paracetamol 500mg', label: 'Paracetamol 500mg' },
                { value: 'Amoxicillin 250mg', label: 'Amoxicillin 250mg' },
                { value: 'Atorvastatin 10mg', label: 'Atorvastatin 10mg' }
              ]}
              placeholder="-- Select Medicine --"
            />

            <div className="grid grid-cols-3 gap-3">
              <Input label="Dosage" id="rx-dos" value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="1-0-1" />
              <Input label="Duration" id="rx-dur" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="7 days" />
              <Input label="Instructions" id="rx-inst" value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="After food" />
            </div>

            <Button type="button" variant="secondary" size="sm" onClick={handleAddItem} className="w-fit">
              <Plus size={14} className="mr-1" />
              Add Item
            </Button>
          </div>

          {/* Added items list */}
          {items.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-caption font-bold text-text-secondary uppercase select-none">Prescribed Medications Stack</span>
              <div className="flex flex-col gap-2 border border-border rounded-md p-3">
                {items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-surface p-2.5 rounded-md text-body-sm">
                    <div>
                      <strong className="text-text-primary">{it.name}</strong> &bull; {it.dosage} &bull; {it.duration}
                      {it.instructions && <span className="text-[11px] text-text-secondary block">*{it.instructions}</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => setItems(items.filter((_, i) => i !== idx))}
                      className="text-bias-left hover:opacity-80 p-1 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Textarea
            label="Clinical Remarks / Advice"
            id="rx-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Hydrate well and follow up in two weeks."
            rows={2}
          />

          <Button type="submit" variant="primary" size="lg" className="mt-2" disabled={loading}>
            {loading ? 'Submitting…' : 'Authorize Prescription'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
