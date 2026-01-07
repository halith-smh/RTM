import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'success' | 'warning' | 'error' | 'info';
  showLabel?: boolean;
  className?: string;
}

const variantStyles = {
  success: 'bg-status-success',
  warning: 'bg-status-warning',
  error: 'bg-status-error',
  info: 'bg-status-info',
};

export function ProgressBar({ 
  value, 
  max = 100, 
  variant = 'info', 
  showLabel = false,
  className 
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="progress-bar flex-1">
        <div 
          className={cn('progress-bar-fill', variantStyles[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-muted-foreground font-medium min-w-[32px] text-right">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}
