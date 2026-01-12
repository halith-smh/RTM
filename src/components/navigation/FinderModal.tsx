import { useState, useMemo, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog"
import { NavigationNode } from '@/types/rtm';
import { cn } from '@/lib/utils';
import { ChevronRight, Folder, FileText, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface FinderModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: NavigationNode[];
  onSelect: (node: NavigationNode) => void;
  onContextChange?: (context: NavigationNode | null, isFromSidebar?: boolean) => void;
  currentContext?: NavigationNode | null;
  selectedNode?: NavigationNode | null;
}

export function FinderModal({
  isOpen,
  onOpenChange,
  data,
  onSelect,
  onContextChange,
  currentContext,
  selectedNode
}: FinderModalProps) {
  // Initialize columns based on current context
  const [activeLevel1, setActiveLevel1] = useState<NavigationNode | null>(() => {
    if (currentContext) {
      if (currentContext.type === 'scope') return currentContext;
      if (currentContext.type === 'process') {
         // Find the parent scope of this process
         return data.find(scope => scope.children?.some(proc => proc.id === currentContext.id)) || data[0];
      }
    }
    return data[0] || null;
  });

  const [activeLevel2, setActiveLevel2] = useState<NavigationNode | null>(() => {
    if (currentContext && currentContext.type === 'process') return currentContext;
    return null;
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (currentContext) {
        if (currentContext.type === 'scope') {
          setActiveLevel1(currentContext);
          setActiveLevel2(null);
        } else if (currentContext.type === 'process') {
          const parent = data.find(scope => scope.children?.some(proc => proc.id === currentContext.id));
          if (parent) setActiveLevel1(parent);
          setActiveLevel2(currentContext);
        }
      }
    }
  }, [isOpen, currentContext, data]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(n => n.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [data, searchTerm]);

  const level2Items = useMemo(() => activeLevel1?.children || [], [activeLevel1]);
  const level3Items = useMemo(() => activeLevel2?.children || [], [activeLevel2]);

  const handleLevel1Click = (node: NavigationNode) => {
    setActiveLevel1(node);
    setActiveLevel2(null);
    onContextChange?.(node);
  };

  const handleLevel2Click = (node: NavigationNode) => {
    setActiveLevel2(node);
    onContextChange?.(node);
  };

  const handleLeafClick = (node: NavigationNode) => {
    onSelect(node);
    // Don't close immediately if the user wants to keep viewing (optional, but let's follow standard behavior)
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] h-[80vh] p-0 overflow-hidden bg-background ring-1 ring-slate-200 shadow-2xl flex flex-col rounded-xl border-none">
        <TooltipProvider>
          <DialogHeader className="p-0 border-b border-slate-100 shrink-0">
            <div className="flex items-center justify-between h-16 px-6">
              <div className="flex items-center gap-4">
                 <DialogTitle className="text-sm font-bold tracking-tight text-slate-800 text-left">
                   Explore Hierarchy
                 </DialogTitle>
                 <div className="h-4 w-px bg-slate-200 mx-2" />
                 <div className="flex items-center bg-slate-100/50 rounded-lg px-3 py-1.5 gap-2 border border-slate-200/50 min-w-[300px]">
                    <Search className="h-3.5 w-3.5 text-slate-400" />
                    <Input
                      placeholder="Jump to any process, scope or requirement..."
                      className="border-none bg-transparent h-5 p-0 text-[13px] focus-visible:ring-0 placeholder:text-slate-400 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-1 overflow-hidden">
            {/* Column 1: Scopes */}
            <div className="w-1/4 border-r border-slate-100 bg-slate-50/30">
              <div className="px-4 py-3 border-b border-slate-100/50 bg-white/50 flex items-center justify-between">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Data Scopes</span>
              </div>
              <ScrollArea className="h-[calc(100%-40px)]">
                <div className="p-1.5 space-y-0.5">
                  {filteredData.map((node) => (
                    <button
                      key={node.id}
                      onClick={() => handleLevel1Click(node)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 h-10 rounded-md text-[13px] transition-all group border border-transparent relative",
                        activeLevel1?.id === node.id
                          ? "bg-slate-200/50 text-slate-900 font-semibold shadow-sm"
                          : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-800"
                      )}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Folder className={cn("h-4 w-4 shrink-0", activeLevel1?.id === node.id ? "text-slate-600" : "text-slate-300")} />
                        <span className="truncate">{node.name}</span>
                      </div>
                      {activeLevel1?.id === node.id && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-slate-400 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Column 2: Processes/Scops */}
            <div className="w-1/4 border-r border-slate-100 bg-white">
              <ScrollArea className="h-full">
                <div className="p-1.5 space-y-0.5">
                  {level2Items.length > 0 ? level2Items.map((node) => (
                    <button
                      key={node.id}
                      onClick={() => handleLevel2Click(node)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 h-10 rounded-md text-[13px] transition-all group border border-transparent relative",
                        activeLevel2?.id === node.id
                          ? "bg-primary/5 text-primary font-semibold shadow-sm"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Folder className={cn("h-4 w-4 shrink-0", activeLevel2?.id === node.id ? "text-primary/70" : "text-slate-300")} />
                        <span className="truncate">{node.name}</span>
                      </div>
                      {activeLevel2?.id === node.id && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full" />
                      )}
                    </button>
                  )) : (
                    <div className="py-20 text-center opacity-40 text-[11px] font-bold tracking-widest text-slate-400 uppercase">Select Scope</div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Column 3: Leaves/Requirements */}
            <div className="flex-1 bg-white">
              <ScrollArea className="h-full">
                <div className="p-1.5 space-y-0.5">
                  {level3Items.length > 0 ? level3Items.map((node) => {
                     const isRequirement = node.type === 'requirement' || !(node.children && node.children.length > 0);
                     const isInScope = node.status === 'in-scope';
                     const isActive = selectedNode?.id === node.id;

                     return (
                      <button
                          key={node.id}
                          onClick={() => isRequirement ? handleLeafClick(node) : handleLevel2Click(node)}
                          className={cn(
                            "w-full flex items-center justify-between gap-4 px-4 h-11 rounded-md transition-all text-left group border relative",
                            isActive
                              ? "bg-primary/5 border-primary/20 shadow-sm"
                              : "hover:bg-slate-50 border-transparent hover:border-slate-100"
                          )}
                      >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                             {isRequirement ? (
                               <FileText className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-primary" : "text-slate-400 group-hover:text-primary")} />
                             ) : (
                               <Folder className="h-4 w-4 text-slate-400 shrink-0" />
                             )}
                             <span className={cn(
                               "text-[13px] font-medium truncate",
                               isActive ? "text-primary font-semibold" : "text-slate-700 group-hover:text-slate-900 text-left"
                             )}>
                               {node.name}
                             </span>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                               {isRequirement && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className={cn(
                                        "h-2 w-2 rounded-full ring-2 ring-offset-1 ring-offset-background transition-all",
                                        isInScope
                                          ? "bg-emerald-500 ring-emerald-500/20"
                                          : "bg-slate-300 ring-slate-300/20"
                                      )} />
                                    </TooltipTrigger>
                                    <TooltipContent side="left">
                                      <span className="text-[10px] font-bold uppercase tracking-wider">
                                        {isInScope ? 'In Scope' : 'Out of Scope'}
                                      </span>
                                    </TooltipContent>
                                  </Tooltip>
                               )}
                               {isActive && (
                                 <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full" />
                               )}
                               <ChevronRight className={cn("h-3.5 w-3.5 transition-all text-slate-300", isActive ? "text-primary translate-x-0.5" : "group-hover:text-primary group-hover:translate-x-0.5")} />
                          </div>
                      </button>
                     )
                  }) : (
                    <div className="py-20 text-center flex flex-col items-center gap-3">
                        <Search className="h-8 w-8 text-slate-200" />
                        <span className="text-slate-400 text-[11px] font-bold tracking-widest uppercase">Select a process group</span>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="h-10 border-t border-slate-100 bg-slate-50/50 flex items-center px-4 shrink-0">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
               Multi-mode discovery enabled • Column mode active • Press Esc to close
             </span>
          </div>
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
}
