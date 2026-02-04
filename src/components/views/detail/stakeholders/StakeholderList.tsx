import { useState, useEffect } from 'react';
import { Stakeholder } from '@/types/stakeholder.types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    MoreVertical, 
    Mail, 
    Shield, 
    Trash2, 
    CheckCircle2, 
    Clock, 
    XCircle, 
    MinusCircle,
    Users,
    CheckSquare,
    Square,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface StakeholderListProps {
  stakeholders: Stakeholder[];
  viewMode: 'grid' | 'list';
  onRemove: (id: string) => void;
  onApprove?: (id: string) => void;
  currentUserId?: string;
  workitemFilter: string;
}

const ITEMS_PER_PAGE = 12; // For grid view
const LIST_ITEMS_PER_PAGE = 20; // For list view



// Mock workitem data based on filter type
const getStakeholderWorkitems = (stakeholder: Stakeholder, type: string) => {
    const workitemsByType = {
        'Tasks': {
            'Product Manager': [
                { id: 1, title: 'Review API requirements', completed: true },
                { id: 2, title: 'Approve calendar integration scope', completed: false },
                { id: 3, title: 'Define acceptance criteria', completed: true },
                { id: 4, title: 'Coordinate with Outlook team', completed: false }
            ],
            'Tech Lead': [
                { id: 1, title: 'Architecture review', completed: true },
                { id: 2, title: 'Technical feasibility assessment', completed: true },
                { id: 3, title: 'Code review and approval', completed: false },
                { id: 4, title: 'Performance impact analysis', completed: false }
            ],
            'Senior Developer': [
                { id: 1, title: 'Implement calendar API integration', completed: false },
                { id: 2, title: 'Write unit tests', completed: false },
                { id: 3, title: 'Update documentation', completed: false },
                { id: 4, title: 'Handle error scenarios', completed: false }
            ]
        },
        'Test cases': {
            'Product Manager': [
                { id: 1, title: 'Define test scenarios', completed: true },
                { id: 2, title: 'Review test coverage', completed: false }
            ],
            'Tech Lead': [
                { id: 1, title: 'Review integration tests', completed: true },
                { id: 2, title: 'Approve test strategy', completed: false }
            ],
            'Senior Developer': [
                { id: 1, title: 'Write unit test cases', completed: false },
                { id: 2, title: 'Create integration tests', completed: false },
                { id: 3, title: 'Execute test scenarios', completed: false }
            ]
        },
        'Issues': {
            'Product Manager': [
                { id: 1, title: 'Calendar sync conflicts', completed: false },
                { id: 2, title: 'Performance concerns', completed: true }
            ],
            'Tech Lead': [
                { id: 1, title: 'API rate limiting', completed: false },
                { id: 2, title: 'Security review needed', completed: false }
            ],
            'Senior Developer': [
                { id: 1, title: 'Authentication issues', completed: true },
                { id: 2, title: 'Data mapping problems', completed: false }
            ]
        },
        'Signoffs': {
            'Product Manager': [
                { id: 1, title: 'Requirements signoff', completed: true },
                { id: 2, title: 'Final approval', completed: false }
            ],
            'Tech Lead': [
                { id: 1, title: 'Technical design signoff', completed: false },
                { id: 2, title: 'Security review signoff', completed: false }
            ],
            'Senior Developer': [
                { id: 1, title: 'Code review signoff', completed: false },
                { id: 2, title: 'Testing signoff', completed: false }
            ]
        },
        'Meetings': {
            'Product Manager': [
                { id: 1, title: 'Kickoff meeting', completed: true },
                { id: 2, title: 'Weekly standup', completed: true },
                { id: 3, title: 'Review meeting', completed: false }
            ],
            'Tech Lead': [
                { id: 1, title: 'Architecture discussion', completed: true },
                { id: 2, title: 'Technical review', completed: false }
            ],
            'Senior Developer': [
                { id: 1, title: 'Daily standup', completed: true },
                { id: 2, title: 'Code review session', completed: false }
            ]
        }
    };
    
    const typeData = workitemsByType[type as keyof typeof workitemsByType];
    return typeData?.[stakeholder.role as keyof typeof typeData] || [
        { id: 1, title: `Review ${type.toLowerCase()}`, completed: false },
        { id: 2, title: `Provide feedback on ${type.toLowerCase()}`, completed: false }
    ];
};

const WorkitemPopover = ({ stakeholder, workitemType }: { stakeholder: Stakeholder; workitemType: string }) => {
    const [activeTab, setActiveTab] = useState<string>(workitemType);
    const [isOpen, setIsOpen] = useState(false);
    
    const workitems = getStakeholderWorkitems(stakeholder, workitemType);
    const completedItems = workitems.filter(t => t.completed).length;
    
    const segments = [
        {
            label: 'Tasks',
            count: workitemType === 'Tasks' ? workitems.length : 0,
            color: 'blue' as const,
            items: workitemType === 'Tasks' ? workitems.map(item => ({ id: item.id.toString(), title: item.title, status: item.completed ? 'Completed' : 'In Progress' })) : []
        },
        {
            label: 'Test cases',
            count: workitemType === 'Test cases' ? workitems.length : 0,
            color: 'green' as const,
            items: workitemType === 'Test cases' ? workitems.map(item => ({ id: item.id.toString(), title: item.title, status: item.completed ? 'Passed' : 'Pending' })) : []
        },
        {
            label: 'Issues',
            count: workitemType === 'Issues' ? workitems.length : 0,
            color: 'red' as const,
            items: workitemType === 'Issues' ? workitems.map(item => ({ id: item.id.toString(), title: item.title, status: item.completed ? 'Resolved' : 'Open' })) : []
        },
        {
            label: 'Signoffs',
            count: workitemType === 'Signoffs' ? workitems.length : 0,
            color: 'purple' as const,
            items: workitemType === 'Signoffs' ? workitems.map(item => ({ id: item.id.toString(), title: item.title, status: item.completed ? 'Approved' : 'Pending' })) : []
        },
        {
            label: 'Meetings',
            count: workitemType === 'Meetings' ? workitems.length : 0,
            color: 'orange' as const,
            items: workitemType === 'Meetings' ? workitems.map(item => ({ id: item.id.toString(), title: item.title, status: item.completed ? 'Attended' : 'Scheduled' })) : []
        }
    ];
    
    const colorClasses: Record<string, { bg: string; text: string; border: string; activeBg: string }> = {
        blue: { bg: 'bg-[#5899da]', text: 'text-white', border: 'data-[state=active]:border-[#5899da]', activeBg: 'data-[state=active]:bg-[#5899da]/10' },
        green: { bg: 'bg-[#945ecf]', text: 'text-white', border: 'data-[state=active]:border-[#945ecf]', activeBg: 'data-[state=active]:bg-[#945ecf]/10' },
        red: { bg: 'bg-[#E74C3C]', text: 'text-white', border: 'data-[state=active]:border-[#E74C3C]', activeBg: 'data-[state=active]:bg-[#E74C3C]/10' },
        purple: { bg: 'bg-[#808080]', text: 'text-white', border: 'data-[state=active]:border-[#808080]', activeBg: 'data-[state=active]:bg-[#808080]/10' },
        orange: { bg: 'bg-orange-500', text: 'text-white', border: 'data-[state=active]:border-orange-500', activeBg: 'data-[state=active]:bg-orange-50' },
    };
    
    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button 
                    className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1 rounded transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(true);
                    }}
                >
                    <span className="text-xs font-medium">{completedItems}/{workitems.length}</span>
                    <div className="w-16 bg-muted rounded-full h-1">
                        <div 
                            className="bg-primary h-1 rounded-full transition-all" 
                            style={{ width: `${(completedItems / workitems.length) * 100}%` }}
                        />
                    </div>
                </button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[550px] p-0 shadow-2xl border-2 bg-popover"
                collisionPadding={16}
                side="left"
                align="center"
            >
                <div className="p-4 border-b border-border bg-muted/10">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-3 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs font-bold bg-slate-100">
                                        {stakeholder.name.split(' ').map(n=>n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <h4 className="font-semibold text-sm text-foreground truncate">{stakeholder.name}</h4>
                            </div>
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{workitemType}</span>
                        </div>
                    </div>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0 overflow-x-auto flex-nowrap no-scrollbar">
                        {segments.map((segment) => {
                            const colors = colorClasses[segment.color];
                            const isActive = activeTab === segment.label;

                            return (
                                <TabsTrigger
                                    key={segment.label}
                                    value={segment.label}
                                    className={cn(
                                        'flex-1 min-w-fit rounded-none border-b-2 border-transparent py-2 px-3 text-xs font-medium transition-all whitespace-nowrap',
                                        colors.border,
                                        colors.activeBg,
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
                        <TabsContent
                            key={segment.label}
                            value={segment.label}
                            className="p-0 m-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 mt-0"
                        >
                            <div className="h-[200px] overflow-y-auto">
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
            </PopoverContent>
        </Popover>
    );
};

const PaginationControls = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    totalItems,
    itemsPerPage,
    viewMode 
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
    viewMode: 'grid' | 'list';
}) => {
    if (totalPages <= 1) return null;
    
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    return (
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
                Showing {startItem}-{endItem} of {totalItems} stakeholders
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                            <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(pageNum)}
                                className="h-8 w-8 p-0"
                            >
                                {pageNum}
                            </Button>
                        );
                    })}
                </div>
                
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export const StakeholderList = ({ stakeholders, viewMode, onRemove, onApprove, workitemFilter }: StakeholderListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = viewMode === 'grid' ? ITEMS_PER_PAGE : LIST_ITEMS_PER_PAGE;
  const totalPages = Math.ceil(stakeholders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStakeholders = stakeholders.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when stakeholders change (e.g., filtering)
  useEffect(() => {
    setCurrentPage(1);
  }, [stakeholders.length]);

  const ActionsMenu = ({ stakeholder }: { stakeholder: Stakeholder }) => (
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                  <MoreVertical className="h-4 w-4" />
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                  window.open(`mailto:${stakeholder.email}`);
                  toast.success(`Opening email to ${stakeholder.name}`);
              }}>
                  <Mail className="h-4 w-4 mr-2" /> Email Stakeholder
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => onRemove(stakeholder.id)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Remove Team Member
              </DropdownMenuItem>
          </DropdownMenuContent>
      </DropdownMenu>
  );

  if (stakeholders.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-slate-50 border-dashed text-center">
              <div className="bg-white p-3 rounded-full mb-3 shadow-sm">
                  <Users className="h-6 w-6 text-slate-300" />
              </div>
              <h3 className="text-sm font-medium text-foreground">No stakeholders assigned</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  Add team members to track ownership, reviews, and approvals for this requirement.
              </p>
          </div>
      );
  }

  // --- GRID VIEW ---
  if (viewMode === 'grid') {
      return (
          <TooltipProvider>
              <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {paginatedStakeholders.map((person) => {
                          const workitems = getStakeholderWorkitems(person, workitemFilter);
                          const completedItems = workitems.filter(t => t.completed).length;
                          
                          return (
                              <Tooltip key={person.id}>
                                  <TooltipTrigger asChild>
                                      <div className="group border rounded-lg bg-card p-4 hover:shadow-md hover:border-primary/20 transition-all relative cursor-pointer">
                                          <div className="flex justify-between items-start mb-3">
                                              <div className="flex items-center gap-3">
                                                  <Avatar className="h-10 w-10 border bg-white">
                                                      <AvatarFallback className={cn("text-xs font-bold", `bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600`)}>
                                                          {person.name.split(' ').map(n=>n[0]).join('')}
                                                      </AvatarFallback>
                                                  </Avatar>
                                                  <div>
                                                      <h4 className="text-sm font-semibold leading-none mb-1">{person.name}</h4>
                                                      <p className="text-xs text-muted-foreground">{person.role}</p>
                                                  </div>
                                              </div>
                                          </div>
                                          
                                          <div className="space-y-3">
                                              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-0.5">Dept</span>
                                                  <span className="font-medium">{person.department}</span>
                                              </div>
                                              
                                              <div className="pt-3 border-t space-y-2">
                                                  <div className="flex items-center justify-between">
                                                      <span className="text-xs text-muted-foreground">{workitemFilter}</span>
                                                      <WorkitemPopover stakeholder={person} workitemType={workitemFilter} />
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </TooltipTrigger>
                              </Tooltip>
                          );
                      })}
                  </div>
                  
                  <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      totalItems={stakeholders.length}
                      itemsPerPage={itemsPerPage}
                      viewMode={viewMode}
                  />
              </div>
          </TooltipProvider>
      );
  }

  // --- LIST VIEW ---
  return (
      <TooltipProvider>
          <div className="space-y-6">
              <div className="border rounded-lg overflow-hidden">
                  <Table>
                      <TableHeader>
                          <TableRow className="bg-slate-50/50">
                              <TableHead>Stakeholder</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>{workitemFilter}</TableHead>
                              <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {paginatedStakeholders.map((person) => {
                              const workitems = getStakeholderWorkitems(person, workitemFilter);
                              const completedItems = workitems.filter(t => t.completed).length;
                              
                              return (
                                  <TableRow key={person.id} className="group cursor-pointer hover:bg-muted/50">
                                      <TableCell>
                                          <div className="flex items-center gap-3">
                                              <Avatar className="h-8 w-8 border bg-white">
                                                  <AvatarFallback className="text-[10px] font-bold bg-slate-100">
                                                      {person.name.split(' ').map(n=>n[0]).join('')}
                                                  </AvatarFallback>
                                              </Avatar>
                                              <div>
                                                  <div className="font-medium text-sm">{person.name}</div>
                                                  <div className="text-[11px] text-muted-foreground">{person.email}</div>
                                              </div>
                                          </div>
                                      </TableCell>
                                      <TableCell>
                                          <div className="text-xs">
                                              <div className="font-medium">{person.role}</div>
                                              <div className="text-muted-foreground">{person.department}</div>
                                          </div>
                                      </TableCell>
                                      <TableCell>
                                          <WorkitemPopover stakeholder={person} workitemType={workitemFilter} />
                                      </TableCell>
                                      <TableCell></TableCell>
                                  </TableRow>
                              );
                          })}
                      </TableBody>
                  </Table>
              </div>
              
              <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={stakeholders.length}
                  itemsPerPage={itemsPerPage}
                  viewMode={viewMode}
              />
          </div>
      </TooltipProvider>
  );
};