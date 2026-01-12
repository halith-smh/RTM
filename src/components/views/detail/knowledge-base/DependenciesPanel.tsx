import { useState } from 'react';
import { Search, Link as LinkIcon, ExternalLink, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dependency } from '@/types/knowledgeBase.types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DependenciesPanelProps {
  dependencies: Dependency[];
  onChange: (dependencies: Dependency[]) => void;
  readOnly?: boolean;
}

export const DependenciesPanel = ({ dependencies, onChange, readOnly = false }: DependenciesPanelProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'blocks' | 'blocked-by' | 'related'>('related');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'blocks': return 'bg-red-100 text-red-700 border-red-200';
      case 'blocked-by': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getLabel = (type: string) => {
      switch (type) {
          case 'blocks': return 'Blocks';
          case 'blocked-by': return 'Blocked By';
          default: return 'Related To';
      }
  };

  const handleAdd = () => {
    if (!searchTerm.trim()) return;
    
    // Simulate finding a requirement
    const newDep: Dependency = {
      requirementId: `REQ-${Math.floor(Math.random() * 1000)}`,
      requirementTitle: searchTerm, // In real app, this would be the actual title found
      type: selectedType
    };

    onChange([...dependencies, newDep]);
    setSearchTerm('');
  };

  const handleRemove = (index: number) => {
    const newDeps = [...dependencies];
    newDeps.splice(index, 1);
    onChange(newDeps);
  };

  return (
    <div className="space-y-4">
      {!readOnly && (
        <div className="flex gap-2">
           <div className="md:w-32 shrink-0">
               <Select value={selectedType} onValueChange={(v: any) => setSelectedType(v)}>
                   <SelectTrigger>
                       <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                       <SelectItem value="related">Related</SelectItem>
                       <SelectItem value="blocks">Blocks</SelectItem>
                       <SelectItem value="blocked-by">Blocked By</SelectItem>
                   </SelectContent>
               </Select>
           </div>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requirements to link..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <Button onClick={handleAdd} disabled={!searchTerm.trim()}>Link</Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {dependencies.length === 0 ? (
           <p className="text-sm text-muted-foreground col-span-2 py-2 italic text-center border border-dashed rounded-md bg-slate-50">
               No dependencies linked.
           </p>
        ) : (
             dependencies.map((dep, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-slate-50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 ${getTypeColor(dep.type)}`}>
                        {getLabel(dep.type)}
                    </Badge>
                    <span className="text-xs font-mono font-medium text-slate-500">{dep.requirementId}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <LinkIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-sm truncate font-medium text-foreground">{dep.requirementTitle}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
                        <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                    {!readOnly && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-muted-foreground hover:text-red-500"
                            onClick={() => handleRemove(index)}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    )}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};
