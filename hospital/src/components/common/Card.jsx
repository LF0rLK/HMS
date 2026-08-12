export const Card = ({ children, className = '', padding = true }) => (
  <div className={`bg-bg-primary border border-border rounded-lg shadow-sm ${padding ? 'p-6' : ''} ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-5">
    <div>
      <h2 className="text-h3 font-bold text-text-primary">{title}</h2>
      {subtitle && <p className="text-body-sm text-text-secondary mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const StatCard = ({ label, value, icon: Icon, color = 'accent', subLabel }) => (
  <div className="bg-bg-primary border border-border rounded-lg p-5 flex flex-col gap-3 shadow-sm">
    <div className="flex items-center justify-between">
      <span className="text-caption font-bold text-text-secondary uppercase tracking-wider select-none">{label}</span>
      {Icon && <Icon size={20} className={`text-${color}`} />}
    </div>
    <p className={`text-[32px] font-extrabold leading-none text-${color}`}>{value}</p>
    {subLabel && <p className="text-caption text-text-secondary">{subLabel}</p>}
  </div>
);
