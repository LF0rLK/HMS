'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppointment } from '@/lib/hooks/useAppointment';
import { useDoctor } from '@/lib/hooks/useDoctor';
import { useNotification } from '@/context/NotificationContext';
import { Card, CardHeader } from '@/components/common/Card';
import { Select, Input, Textarea } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { TIME_SLOTS } from '@/lib/utils/constants';

export default function BookAppointmentPage() {
  const router = useRouter();
  const { book } = useAppointment();
  const { doctors } = useDoctor();
  const { notify } = useNotification();

  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState(TIME_SLOTS[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await book({ doctorId, date, slot, notes });
      notify.success('Appointment booked successfully!');
      router.push('/patient/appointments');
    } catch (err) {
      notify.error(err?.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const docOptions = doctors.map((d) => ({
    value: d._id || d.id,
    label: `${d.name} (${d.department} - $${d.consultationFee})`,
  }));

  return (
    <div className="flex flex-col gap-6 max-w-[600px]">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">Book Doctor Consultation</h1>
        <p className="text-body-sm text-text-secondary">Schedule an appointment with a hospital specialist.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Select
            label="Select Medical Professional"
            id="doc-select"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            options={docOptions.length > 0 ? docOptions : [{ value: 'd1', label: 'Dr. Sarah Smith (Cardiology - $800)' }]}
            required
            placeholder="-- Choose Doctor --"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Preferred Date"
              id="appt-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <Select
              label="Preferred Time Slot"
              id="appt-slot"
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              options={TIME_SLOTS}
              required
            />
          </div>

          <Textarea
            label="Symptoms / Reason for Visit"
            id="appt-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe your medical concern or symptoms..."
            rows={3}
          />

          <Button type="submit" variant="primary" size="lg" className="mt-2" disabled={loading}>
            {loading ? 'Submitting Request…' : 'Submit Consultation Request'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
