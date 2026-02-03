import { useState } from 'react';
import { LayoutDashboard, FileText, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NavigationItem = 'dashboard' | 'requirements' | 'rtm';

interface MainNavigationProps {
  activeItem: NavigationItem;
  onItemChange: (item: NavigationItem) => void;
}

export function MainNavigation({ activeItem, onItemChange }: MainNavigationProps) {
  const navigationItems = [
    {
      id: 'dashboard' as NavigationItem,
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'requirements' as NavigationItem,
      label: 'Requirements',
      icon: FileText
    },
    {
      id: 'rtm' as NavigationItem,
      label: 'RTM',
      icon: GitBranch
    }
  ];

  return (
    <div className="h-12 bg-background border-b border-border flex items-center px-4">
      <nav className="flex items-center gap-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onItemChange(item.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}