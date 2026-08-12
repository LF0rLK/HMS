import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-bias-left/20 text-bias-left',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-accent/5 border-accent/20 text-accent',
};

export const Alert = ({ type = 'info', message, onDismiss }) => {
  const Icon = icons[type] || Info;
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-md border text-body-sm font-medium ${styles[type]}`}>
      <Icon size={16} className="mt-0.5 shrink-0" />
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="opacity-60 hover:opacity-100 cursor-pointer">
          <X size={14} />
        </button>
      )}
    </div>
  );
};
