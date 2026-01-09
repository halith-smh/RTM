import { KnowledgeBaseMetadata } from '@/types/knowledgeBase.types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ChangeLogPanelProps {
  metadata: KnowledgeBaseMetadata;
}

export const ChangeLogPanel = ({ metadata }: ChangeLogPanelProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Version History</h3>
      <ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-muted/10">
        <div className="space-y-4">
          {metadata.changeLog.map((entry, index) => (
            <div key={index} className="flex gap-3 text-sm relative pb-4 border-l border-border pl-4 last:border-0 last:pb-0">
               {/* Timeline Dot */}
               <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-primary ring-4 ring-background" />

               <div className="flex-1 space-y-1">
                 <div className="flex items-center justify-between">
                   <span className="font-medium text-foreground">{entry.user}</span>
                   <span className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleString()}</span>
                 </div>
                 <p className="text-muted-foreground">{entry.description}</p>
               </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export const MetadataPanel = ({ metadata }: { metadata: KnowledgeBaseMetadata }) => {
    return (
        <div className="rounded-lg border bg-card p-4 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
                 <h3 className="font-semibold text-sm">Metadata</h3>
                 <span className="text-xs font-mono bg-secondary px-2 py-1 rounded">v{metadata.version.toFixed(1)}</span>
            </div>
            
            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-medium">{new Date(metadata.lastUpdated).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Updated By</span>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-[9px] bg-primary text-primary-foreground">
                                {metadata.updatedBy.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <span>{metadata.updatedBy}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
