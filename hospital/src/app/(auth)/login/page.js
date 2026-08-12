'use client';

import React from 'react';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h2 font-bold text-text-primary mb-1">Access Portal</h1>
        <p className="text-body-sm text-text-secondary">Sign in to your hospital role dashboard.</p>
      </div>

      <LoginForm />

      <div className="text-center text-body-sm text-text-secondary border-t border-divider pt-4">
        Need a patient profile?{' '}
        <Link href="/register" className="text-accent hover:underline font-semibold">
          Register account
        </Link>
      </div>
    </div>
  );
}
