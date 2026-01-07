import { cn } from '@/lib/utils';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusBadgeProps {
  label: string;
  type: StatusType;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  success: 'status-success',
  warning: 'status-warning',
  error: 'status-error',
  info: 'status-info',
  neutral: 'status-neutral',
};

export function StatusBadge({ label, type, className }: StatusBadgeProps) {
  return (
    <span className={cn('status-badge', statusStyles[type], className)}>
      {label}
    </span>
  );
}
