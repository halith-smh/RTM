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
    MoreVertical, 
    Mail, 
    Shield, 
    Trash2, 
    CheckCircle2, 
    Clock, 
    XCircle, 
    MinusCircle 
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from '@/lib/utils';;

interface StakeholderListProps {
  stakeholders: Stakeholder[];
  viewMode: 'grid' | 'list';
  onRemove: (id: string) => void;
  onApprove?: (id: string) => void;
  currentUserId?: string; // To allow self-approval simulation
}

const getInvolvementColor = (level: string) => {
    switch (level) {
        case 'owner': return 'bg-purple-100 text-purple-700 border-purple-200';
        case 'approver': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'reviewer': return 'bg-blue-100 text-blue-700 border-blue-200';
        default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
};

const ApprovalStatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case 'approved': 
            return <div className="flex items-center gap-1.5 text-green-600 font-medium text-xs"><CheckCircle2 className="h-4 w-4" /> Approved</div>;
        case 'rejected': 
            return <div className="flex items-center gap-1.5 text-red-600 font-medium text-xs"><XCircle className="h-4 w-4" /> Rejected</div>;
        case 'pending': 
            return <div className="flex items-center gap-1.5 text-amber-600 font-medium text-xs"><Clock className="h-4 w-4" /> Pending</div>;
        default: 
            return <div className="flex items-center gap-1.5 text-slate-400 font-medium text-xs"><MinusCircle className="h-4 w-4" /> Not Required</div>;
    }
};

export const StakeholderList = ({ stakeholders, viewMode, onRemove, onApprove }: StakeholderListProps) => {

  const ActionsMenu = ({ stakeholder }: { stakeholder: Stakeholder }) => (
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                  <MoreVertical className="h-4 w-4" />
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.open(`mailto:${stakeholder.email}`)}>
                  <Mail className="h-4 w-4 mr-2" /> Email Stakeholder
              </DropdownMenuItem>
              {stakeholder.approvalStatus === 'pending' && onApprove && (
                  <DropdownMenuItem onClick={() => onApprove(stakeholder.id)} className="text-green-600 focus:text-green-600 focus:bg-green-50">
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Approve Request
                  </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                  <Shield className="h-4 w-4 mr-2" /> Change Role
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
                  <Shield className="h-6 w-6 text-slate-300" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stakeholders.map((person) => (
                  <div key={person.id} className="group border rounded-lg bg-card p-4 hover:shadow-md transition-all relative">
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
                          <ActionsMenu stakeholder={person} />
                      </div>
                      
                      <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                               <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                   <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-0.5">Dept</span>
                                   <span className="font-medium">{person.department}</span>
                               </div>
                               <div className={cn("p-2 rounded border", getInvolvementColor(person.involvementLevel))}>
                                   <span className="text-[10px] opacity-70 uppercase tracking-wider block mb-0.5">Role</span>
                                   <span className="font-medium capitalize">{person.involvementLevel}</span>
                               </div>
                          </div>
                          
                          <div className="pt-3 border-t flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Status</span>
                              <ApprovalStatusBadge status={person.approvalStatus} />
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      );
  }

  // --- LIST VIEW ---
  return (
      <div className="border rounded-lg overflow-hidden">
          <Table>
              <TableHeader>
                  <TableRow className="bg-slate-50/50">
                      <TableHead>Stakeholder</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Involvement</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {stakeholders.map((person) => (
                      <TableRow key={person.id} className="group">
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
                              <Badge variant="outline" className={cn("capitalize font-normal", getInvolvementColor(person.involvementLevel))}>
                                  {person.involvementLevel}
                              </Badge>
                          </TableCell>
                          <TableCell>
                              <ApprovalStatusBadge status={person.approvalStatus} />
                          </TableCell>
                          <TableCell>
                              <ActionsMenu stakeholder={person} />
                          </TableCell>
                      </TableRow>
                  ))}
              </TableBody>
          </Table>
      </div>
  );
};
