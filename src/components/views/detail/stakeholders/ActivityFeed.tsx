import { ActivityFeedItem } from '@/types/stakeholder.types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserPlus, UserMinus, ShieldCheck, CheckCheck, XCircle, MessageSquare } from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityFeedItem[];
}

const getActivityIcon = (type: string) => {
    switch (type) {
        case 'added': return <UserPlus className="h-3 w-3 text-blue-500" />;
        case 'removed': return <UserMinus className="h-3 w-3 text-red-500" />;
        case 'role-changed': return <ShieldCheck className="h-3 w-3 text-purple-500" />;
        case 'approved': return <CheckCheck className="h-3 w-3 text-green-500" />;
        case 'rejected': return <XCircle className="h-3 w-3 text-red-600" />;
        case 'commented': return <MessageSquare className="h-3 w-3 text-slate-500" />;
        default: return <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />;
    }
};

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  return (
    <div className="border rounded-lg bg-card flex flex-col h-full">
        <div className="p-4 border-b">
            <h3 className="font-semibold text-sm">Recent Activity</h3>
        </div>
        
        <ScrollArea className="flex-1 p-0">
             <div className="divide-y">
                 {activities.length === 0 ? (
                     <div className="p-4 text-center text-sm text-muted-foreground">No recent activity.</div>
                 ) : (
                     activities.map((item) => (
                         <div key={item.id} className="p-4 flex gap-3 hover:bg-slate-50/50 transition-colors">
                             <Avatar className="h-8 w-8 border">
                                 <AvatarFallback className="text-[10px] bg-slate-100 text-slate-600 font-bold">
                                     {item.performedBy.split(' ').map(n=>n[0]).join('')}
                                 </AvatarFallback>
                             </Avatar>
                             <div className="flex-1 space-y-1">
                                 <div className="flex items-center justify-between">
                                     <span className="text-xs font-semibold text-foreground">{item.performedBy}</span>
                                     <span className="text-[10px] text-muted-foreground">{new Date(item.timestamp).toLocaleDateString()}</span>
                                 </div>
                                 <div className="flex items-center gap-1.5">
                                      {getActivityIcon(item.type)}
                                      <p className="text-xs text-slate-700 leading-snug">
                                          {item.details} 
                                          {item.stakeholderName && <span className="font-medium text-foreground ml-1">({item.stakeholderName})</span>}
                                      </p>
                                 </div>
                             </div>
                         </div>
                     ))
                 )}
             </div>
        </ScrollArea>
        
        <div className="p-3 bg-slate-50/50 border-t text-center">
            <button className="text-xs text-primary hover:underline font-medium">View All History</button>
        </div>
    </div>
  );
};
