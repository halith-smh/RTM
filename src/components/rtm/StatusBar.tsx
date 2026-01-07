import { ReactNode, useState } from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export interface StatusSegment {
  label: string;
  count: number;
  color: 'blue' | 'green' | 'red' | 'gray';
  items?: { id: string; title: string; status: string }[];
}

interface StatusBarProps {
  segments: StatusSegment[];
  total: number;
  title: string;
  emptyText?: string;
}

const colorClasses: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-[#1976D2]', text: 'text-white' },
  green: { bg: 'bg-[#4CAF50]', text: 'text-white' },
  red: { bg: 'bg-[#F44336]', text: 'text-white' },
  gray: { bg: 'bg-[#9E9E9E]', text: 'text-white' },
};

export function StatusBar({ segments, total, title, emptyText = '-' }: StatusBarProps) {
  const [activeTab, setActiveTab] = useState<string>(segments[0]?.label || '');

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-6 text-xs text-muted-foreground">
        {emptyText}
      </div>
    );
  }

  // Filter segments with count > 0
  const activeSegments = segments.filter(s => s.count > 0);

  return (
    <HoverCard openDelay={200} closeDelay={150}>
      <HoverCardTrigger asChild>
        <div className="flex items-center h-6 w-full max-w-[180px] cursor-pointer rounded overflow-hidden">
          {activeSegments.map((segment, idx) => {
            const widthPercent = (segment.count / total) * 100;
            const colors = colorClasses[segment.color];
            
            return (
              <div
                key={segment.label}
                className={cn(
                  'h-full flex items-center justify-center text-xs font-medium transition-all',
                  colors.bg,
                  colors.text,
                  idx === 0 && 'rounded-l',
                  idx === activeSegments.length - 1 && 'rounded-r'
                )}
                style={{ width: `${widthPercent}%`, minWidth: segment.count > 0 ? '24px' : 0 }}
              >
                {segment.count}
              </div>
            );
          })}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0" align="start">
        <div className="p-3 border-b border-border">
          <h4 className="font-medium text-sm text-foreground">{title}</h4>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
            {segments.map((segment) => {
              const colors = colorClasses[segment.color];
              const isActive = activeTab === segment.label;
              
              return (
                <TabsTrigger
                  key={segment.label}
                  value={segment.label}
                  className={cn(
                    'flex-1 rounded-none border-b-2 border-transparent py-2 px-3 text-xs font-medium transition-all',
                    'data-[state=active]:border-primary data-[state=active]:bg-primary/5',
                    'hover:bg-muted/50'
                  )}
                >
                  <span className="truncate">{segment.label}</span>
                  <span className={cn(
                    'ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-semibold',
                    isActive ? `${colors.bg} ${colors.text}` : 'bg-muted text-muted-foreground'
                  )}>
                    {segment.count}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
          {segments.map((segment) => (
            <TabsContent key={segment.label} value={segment.label} className="p-0 m-0">
              <div className="max-h-48 overflow-y-auto">
                {segment.items && segment.items.length > 0 ? (
                  <div className="divide-y divide-border">
                    {segment.items.map((item) => (
                      <div key={item.id} className="px-3 py-2 hover:bg-muted/30 transition-colors">
                        <p className="text-sm text-foreground truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.status}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                    No items in this category
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        <div className="px-3 py-2 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">Click to view full traceability</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
