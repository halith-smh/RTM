import { ReactNode } from 'react';
import {
  HoverCard as ShadcnHoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface HoverCardProps {
  trigger: ReactNode;
  title: string;
  items: { label: string; value: string | number }[];
  footer?: string;
}

export function RTMHoverCard({ trigger, title, items, footer }: HoverCardProps) {
  return (
    <ShadcnHoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {trigger}
      </HoverCardTrigger>
      <HoverCardContent className="w-72 p-0" align="start">
        <div className="p-3 border-b border-border">
          <h4 className="font-medium text-sm text-foreground truncate">{title}</h4>
        </div>
        <div className="p-3 space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
        {footer && (
          <div className="px-3 py-2 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground">{footer}</p>
          </div>
        )}
      </HoverCardContent>
    </ShadcnHoverCard>
  );
}
