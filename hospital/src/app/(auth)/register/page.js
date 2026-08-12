'use client';

import React from 'react';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h2 font-bold text-text-primary mb-1">Create Patient Profile</h1>
        <p className="text-body-sm text-text-secondary">Register to manage appointments, prescriptions, and lab tests.</p>
      </div>

      <RegisterForm />

      <div className="text-center text-body-sm text-text-secondary border-t border-divider pt-4">
        Already registered?{' '}
        <Link href="/login" className="text-accent hover:underline font-semibold">
          Sign in
        </Link>
      </div>
    </div>
  );
}
