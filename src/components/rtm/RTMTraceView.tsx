import { useMemo, useState } from 'react';
import { RTMTable } from './RTMTable';
import { NavigationNode, Requirement } from '@/types/rtm';
import { requirementsData } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface RTMTraceViewProps {
  data: NavigationNode[];
  onRequirementSelect: (node: NavigationNode) => void;
  visibleColumns?: string[];
  tableView?: 'explorer' | 'trace';
  onTableViewChange?: (view: 'explorer' | 'trace') => void;
}

// Helper to flatten all requirements from hierarchical data
function flattenRequirements(nodes: NavigationNode[]): NavigationNode[] {
  const requirements: NavigationNode[] = [];
  
  function traverse(nodeList: NavigationNode[]) {
    for (const node of nodeList) {
      if (node.type === 'requirement') {
        requirements.push(node);
      } else if (node.children) {
        traverse(node.children);
      }
    }
  }
  
  traverse(nodes);
  return requirements;
}

export function RTMTraceView({ data, onRequirementSelect, visibleColumns, tableView = 'trace', onTableViewChange }: RTMTraceViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Convert NavigationNode requirements to Requirement format for RTMTable
  const flatRequirements = useMemo(() => {
    const flatNodes = flattenRequirements(data);
    
    return flatNodes.map(node => {
      // Find the full requirement data
      const fullReq = requirementsData.find(req => req.id === node.id);
      if (!fullReq) {
        // Fallback if requirement not found in mock data
        return {
          id: node.id,
          reqId: node.id,
          title: node.name,
          type: 'Business' as const,
          priority: 'Medium' as const,
          status: 'Active' as const,
          sourceOwner: 'Unknown',
          lastUpdatedBy: 'System',
          updatedAt: new Date().toISOString().split('T')[0],
          tasks: [],
          testCases: [],
          issues: [],
          signOffs: [],
          ctas: [],
          meetings: []
        };
      }
      
      return fullReq;
    });
  }, [data]);

  // Filter requirements based on search term
  const filteredRequirements = useMemo(() => {
    if (!searchTerm) return flatRequirements;
    
    return flatRequirements.filter(req => 
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.reqId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.sourceOwner.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [flatRequirements, searchTerm]);

  const handleRequirementClick = (req: Requirement, tab?: string) => {
    // Convert back to NavigationNode format for consistency
    const node: NavigationNode = {
      id: req.id,
      name: req.title,
      type: 'requirement',
      status: 'in-scope'
    };
    onRequirementSelect(node);
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Search Bar with View Toggle */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requirements by ID, title, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-96"
            />
          </div>
          
          {onTableViewChange && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-2 border border-muted-foreground/20">
                  {tableView === 'explorer' ? 'Explorer View' : 'Trace View'}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onTableViewChange('trace')}>Trace View</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onTableViewChange('explorer')}>Explorer View</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      {/* Table */}
      <div className="flex-1 overflow-hidden">
        <RTMTable
          requirements={filteredRequirements}
          onRequirementClick={handleRequirementClick}
          visibleColumns={visibleColumns}
        />
      </div>
    </div>
  );
}