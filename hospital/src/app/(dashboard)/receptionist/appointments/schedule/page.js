'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppointment } from '@/lib/hooks/useAppointment';
import { usePatient } from '@/lib/hooks/usePatient';
import { useDoctor } from '@/lib/hooks/useDoctor';
import { useNotification } from '@/context/NotificationContext';
import { Card } from '@/components/common/Card';
import { Select, Input, Textarea } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { TIME_SLOTS } from '@/lib/utils/constants';

export default function ScheduleAppointmentPage() {
  const router = useRouter();
  const { book } = useAppointment();
  const { patients } = usePatient();
  const { doctors } = useDoctor();
  const { notify } = useNotification();

  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState(TIME_SLOTS[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await book({ patientId, doctorId, date, slot, notes });
      notify.success('Appointment scheduled successfully!');
      router.push('/receptionist/appointments');
    } catch (err) {
      notify.error(err?.response?.data?.message || 'Failed to schedule appointment');
    } finally {
      setLoading(false);
    }
  };

  const patOptions = patients.map((p) => ({ value: p._id || p.id, label: `${p.name} (${p.phone})` }));
  const docOptions = doctors.map((d) => ({ value: d._id || d.id, label: `${d.name} (${d.department})` }));

  return (
    <div className="flex flex-col gap-6 max-w-[600px]">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">Schedule Patient Consultation</h1>
        <p className="text-body-sm text-text-secondary">Appoint clinician time slot on patient behalf.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Select
            label="Select Patient"
            id="sched-pat"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            options={patOptions.length > 0 ? patOptions : [{ value: 'p1', label: 'John Doe' }]}
            required
            placeholder="-- Choose Patient --"
          />

          <Select
            label="Select Doctor"
            id="sched-doc"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            options={docOptions.length > 0 ? docOptions : [{ value: 'd1', label: 'Dr. Sarah Smith (Cardiology)' }]}
            required
            placeholder="-- Choose Doctor --"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Appointment Date"
              id="sched-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <Select
              label="Time Slot"
              id="sched-slot"
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              options={TIME_SLOTS}
              required
            />
          </div>

          <Textarea
            label="Consultation Notes"
            id="sched-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />

          <Button type="submit" variant="primary" size="lg" className="mt-2" disabled={loading}>
            {loading ? 'Scheduling…' : 'Schedule Appointment'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
