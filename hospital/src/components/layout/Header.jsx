'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { LogOut, User, Bell, HeartPulse } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const Header = () => {
  const { user, logout } = useAuth();
  const { notify } = useNotification();

  return (
    <header className="h-14 md:h-16 bg-bg-primary border-b border-border px-4 md:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Logo — visible on mobile only (desktop uses sidebar brand) */}
      <div className="flex items-center gap-2 md:hidden">
        <HeartPulse className="text-accent" size={22} />
        <span className="font-bold text-[15px] text-text-primary">ONE HMS</span>
      </div>

      {/* Desktop subtitle */}
      <div className="hidden md:flex items-center gap-2">
        <span className="text-caption font-bold text-text-secondary uppercase tracking-wider">
          Hospital Management System
        </span>
      </div>

      {user && (
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notification bell */}
          <button
            onClick={() => notify.info('System operational: All modules connected.')}
            className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-surface transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell size={18} />
          </button>

          {/* User chip */}
          <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-3 border-l border-divider">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-body-sm uppercase shrink-0">
              {user.name ? user.name.charAt(0) : <User size={14} />}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-body-sm font-semibold text-text-primary leading-tight">{user.name}</span>
              <span className="text-caption text-text-secondary capitalize leading-tight">{user.role}</span>
            </div>
          </div>

          {/* Logout */}
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="flex items-center gap-1.5 text-text-secondary hover:text-bias-left"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      )}
    </header>
  );
};
