'use client';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { NotificationProvider } from '@/context/NotificationContext';

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <NotificationProvider>
        {/* md+: flex row with left sidebar. Mobile: single column, bottom nav via Sidebar */}
        <div className="flex min-h-screen bg-bg-secondary font-sans text-text-primary">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            {/* pb-20 on mobile reserves space above the fixed bottom nav */}
            <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-[1280px] w-full mx-auto">
              <Breadcrumb />
              {children}
            </main>
          </div>
        </div>
      </NotificationProvider>
    </ProtectedRoute>
  );
}
