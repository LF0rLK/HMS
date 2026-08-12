import { cn } from '@/lib/utils';

export const Button = ({
  children, variant = 'primary', size = 'md', className = '', disabled, type = 'button', onClick,
}) => {
  const base = 'inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 cursor-pointer';

  const variants = {
    primary: 'bg-text-primary text-bg-primary hover:bg-text-secondary shadow-sm rounded-md',
    secondary: 'bg-bg-secondary text-text-primary hover:bg-border rounded-md',
    outline: 'border border-border bg-transparent text-text-primary hover:bg-surface rounded-md',
    danger: 'bg-bias-left text-white hover:opacity-90 shadow-sm rounded-md',
    text: 'text-accent bg-transparent hover:underline',
  };

  const sizes = {
    sm: 'text-[12px] px-3 py-1.5',
    md: 'text-[14px] px-4 py-2',
    lg: 'text-[16px] px-6 py-3',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(base, variants[variant] || variants.primary, variant !== 'text' ? sizes[size] : '', className)}
    >
      {children}
    </button>
  );
};
