'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader } from '@/components/common/Card';
import { User, Phone, Mail, MapPin, Calendar, Droplets } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatter';

export default function PatientProfilePage() {
  const { user, profile } = useAuth();

  return (
    <div className="flex flex-col gap-6 max-w-[720px]">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">Patient Demographics Profile</h1>
        <p className="text-body-sm text-text-secondary">Your registered personal medical information.</p>
      </div>

      <Card>
        <CardHeader title={user?.name} subtitle={`Patient ID: ${user?.id || user?._id}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-divider">
          <div className="flex items-center gap-3">
            <Mail className="text-text-secondary" size={18} />
            <div>
              <span className="text-caption font-bold text-text-secondary uppercase">Email Address</span>
              <p className="text-body-sm font-semibold text-text-primary">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="text-text-secondary" size={18} />
            <div>
              <span className="text-caption font-bold text-text-secondary uppercase">Phone Number</span>
              <p className="text-body-sm font-semibold text-text-primary">{profile?.phone || '555-0199'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <User className="text-text-secondary" size={18} />
            <div>
              <span className="text-caption font-bold text-text-secondary uppercase">Gender</span>
              <p className="text-body-sm font-semibold text-text-primary">{profile?.gender || 'Male'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="text-text-secondary" size={18} />
            <div>
              <span className="text-caption font-bold text-text-secondary uppercase">Date of Birth</span>
              <p className="text-body-sm font-semibold text-text-primary">{formatDate(profile?.dateOfBirth || '1985-05-15')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Droplets className="text-accent" size={18} />
            <div>
              <span className="text-caption font-bold text-text-secondary uppercase">Blood Group</span>
              <p className="text-body-sm font-bold text-accent">{profile?.bloodGroup || 'O+'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="text-text-secondary" size={18} />
            <div>
              <span className="text-caption font-bold text-text-secondary uppercase">Address</span>
              <p className="text-body-sm font-semibold text-text-primary">{profile?.address || '742 Evergreen Terrace, Springfield'}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
