'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { capitalize } from '@/lib/utils/formatter';

export const Breadcrumb = () => {
  const pathname = usePathname();
  if (!pathname || pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center gap-1.5 text-caption text-text-secondary mb-6 select-none">
      <Link href="/" className="hover:text-text-primary transition-colors">
        Home
      </Link>
      {segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;

        return (
          <React.Fragment key={href}>
            <ChevronRight size={12} className="text-text-secondary/60" />
            {isLast ? (
              <span className="font-semibold text-text-primary">{capitalize(segment.replace('-', ' '))}</span>
            ) : (
              <Link href={href} className="hover:text-text-primary transition-colors">
                {capitalize(segment.replace('-', ' '))}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
