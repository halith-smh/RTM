import { ApprovalWorkflow } from '@/types/stakeholder.types';
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ApprovalWorkflowPanelProps {
  workflow: ApprovalWorkflow;
  onRequestAll: () => void;
}

export const ApprovalWorkflowPanel = ({ workflow, onRequestAll }: ApprovalWorkflowPanelProps) => {
  const percentage = workflow.totalApprovers > 0 
      ? Math.round((workflow.approvedCount / workflow.totalApprovers) * 100) 
      : 0;
  
  const isComplete = workflow.approvedCount === workflow.totalApprovers && workflow.totalApprovers > 0;
  
  return (
    <div className="bg-gradient-to-br from-slate-50 to-white border rounded-lg p-5 space-y-5">
         <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                 <h3 className="font-semibold text-sm">Approval Workflow</h3>
                 {isComplete ? (
                     <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide flex items-center gap-1">
                         <CheckCircle2 className="h-3 w-3" /> Approved
                     </span>
                 ) : (
                     <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide flex items-center gap-1">
                         <Clock className="h-3 w-3" /> In Progress
                     </span>
                 )}
             </div>
             <span className="text-xs text-muted-foreground font-medium">
                 Last updated: {new Date(workflow.lastActivityDate).toLocaleDateString()}
             </span>
         </div>

         {/* Progress Bar */}
         <div className="space-y-2">
             <div className="flex justify-between text-xs font-medium">
                 <span>{workflow.approvedCount} of {workflow.totalApprovers} Approvals Received</span>
                 <span>{percentage}%</span>
             </div>
             <Progress value={percentage} className="h-2" />
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-3 gap-2">
             <div className="bg-green-50/50 border border-green-100 rounded p-2 text-center">
                 <div className="flex items-center justify-center gap-1.5 text-green-600 mb-0.5">
                     <CheckCircle2 className="h-4 w-4" />
                     <span className="font-bold text-lg">{workflow.approvedCount}</span>
                 </div>
                 <span className="text-[10px] text-green-700/70 font-medium uppercase">Approved</span>
             </div>
             
             <div className="bg-red-50/50 border border-red-100 rounded p-2 text-center">
                 <div className="flex items-center justify-center gap-1.5 text-red-600 mb-0.5">
                     <XCircle className="h-4 w-4" />
                     <span className="font-bold text-lg">{workflow.rejectedCount}</span>
                 </div>
                 <span className="text-[10px] text-red-700/70 font-medium uppercase">Rejected</span>
             </div>

             <div className="bg-amber-50/50 border border-amber-100 rounded p-2 text-center">
                 <div className="flex items-center justify-center gap-1.5 text-amber-600 mb-0.5">
                     <AlertCircle className="h-4 w-4" />
                     <span className="font-bold text-lg">{workflow.pendingCount}</span>
                 </div>
                 <span className="text-[10px] text-amber-700/70 font-medium uppercase">Pending</span>
             </div>
         </div>

         {/* Action */}
         {!isComplete && (
             <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={onRequestAll}
            >
                 Remind Pending Approvers
             </Button>
         )}
    </div>
  );
};
