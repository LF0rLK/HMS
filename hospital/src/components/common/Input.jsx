export const Input = ({
  label, id, type = 'text', value, onChange, placeholder, required, disabled, error, className = '',
}) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label htmlFor={id} className="text-caption font-bold text-text-secondary uppercase tracking-wide select-none">
        {label}{required && <span className="text-bias-left ml-0.5">*</span>}
      </label>
    )}
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`w-full px-3 py-2 text-body-md border rounded-md bg-surface text-text-primary transition-colors outline-none
        ${error ? 'border-bias-left focus:border-bias-left' : 'border-border focus:border-accent'}
        ${disabled ? 'opacity-60 cursor-not-allowed bg-bg-secondary' : ''}
        ${className}`}
    />
    {error && <span className="text-[11px] text-bias-left font-medium">{error}</span>}
  </div>
);

export const Select = ({
  label, id, value, onChange, options = [], required, disabled, error, className = '', placeholder,
}) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label htmlFor={id} className="text-caption font-bold text-text-secondary uppercase tracking-wide select-none">
        {label}{required && <span className="text-bias-left ml-0.5">*</span>}
      </label>
    )}
    <select
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`w-full px-3 py-2 text-body-md border border-border rounded-md bg-surface text-text-primary transition-colors outline-none focus:border-accent
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        ${className}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) =>
        typeof opt === 'string'
          ? <option key={opt} value={opt}>{opt}</option>
          : <option key={opt.value} value={opt.value}>{opt.label}</option>
      )}
    </select>
    {error && <span className="text-[11px] text-bias-left font-medium">{error}</span>}
  </div>
);

export const Textarea = ({
  label, id, value, onChange, placeholder, required, rows = 3, error, className = '',
}) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label htmlFor={id} className="text-caption font-bold text-text-secondary uppercase tracking-wide select-none">
        {label}{required && <span className="text-bias-left ml-0.5">*</span>}
      </label>
    )}
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows}
      className={`w-full px-3 py-2 text-body-md border border-border rounded-md bg-surface text-text-primary transition-colors outline-none focus:border-accent resize-none ${className}`}
    />
    {error && <span className="text-[11px] text-bias-left font-medium">{error}</span>}
  </div>
);
