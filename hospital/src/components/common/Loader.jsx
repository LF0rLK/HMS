'use client';

import { useLoading } from '@/context/LoadingContext';

// ─── Spinner ring ─────────────────────────────────────────────────────────────
export const Loader = ({ size = 'md', text = '' }) => {
  const ring = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-[3px]',
  };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        className={`${ring[size] || ring.md} border-border border-t-accent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {text && <p className="text-body-sm text-text-secondary">{text}</p>}
    </div>
  );
};

// ─── Inline page loader (data fetching inside a page) ────────────────────────
export const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[400px]">
    <Loader size="lg" text="Loading data…" />
  </div>
);

// ─── Top progress bar (thin accent line at top of viewport) ──────────────────
// Shown automatically for every API request via LoadingContext.
export const TopProgressBar = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* Track */}
      <div className="absolute inset-0 bg-border opacity-40" />
      {/* Animated fill */}
      <div
        className="absolute top-0 left-0 h-full bg-accent"
        style={{
          animation: 'hms-progress 1.4s ease-in-out infinite',
          transformOrigin: 'left center',
        }}
      />
      <style>{`
        @keyframes hms-progress {
          0%   { transform: scaleX(0);    opacity: 1; }
          60%  { transform: scaleX(0.85); opacity: 1; }
          100% { transform: scaleX(1);    opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// ─── Fullscreen overlay (route transitions / auth guard) ─────────────────────
export const FullscreenLoader = ({ text = 'Loading…' }) => (
  <div
    role="status"
    aria-label={text}
    className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-bg-primary"
  >
    <div className="flex flex-col items-center gap-4">
      {/* Outer ring */}
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-[3px] border-border" />
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-accent animate-spin" />
      </div>
      <p className="text-body-sm text-text-secondary font-medium">{text}</p>
    </div>
  </div>
);
