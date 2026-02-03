import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterBar } from '@/components/rtm/FilterBar';
import { FocusDrillSidebar } from '@/components/navigation/FocusDrillSidebar';
import { RTMTreeTable } from '@/components/rtm/RTMTreeTable';
import { RTMTable } from '@/components/rtm/RTMTable';
import { NavigationNode } from '@/types/rtm';
import { navigationData, requirementsData } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, ChevronDown, RefreshCw, Filter, Upload, Download, Maximize, Layout, Plus, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface RequirementsContentProps {
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export function RequirementsContent({ sidebarCollapsed = false, onToggleSidebar }: RequirementsContentProps) {
  const navigate = useNavigate();
  const [data, setData] = useState<NavigationNode[]>(navigationData[0]?.children || []);
  const [selectedNode, setSelectedNode] = useState<NavigationNode | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentContext, setCurrentContext] = useState<NavigationNode | null>(null);
  const [externalPath, setExternalPath] = useState<NavigationNode[] | null>(null);
  const [showNewRequirement, setShowNewRequirement] = useState(false);
  const [tableView, setTableView] = useState<'explorer' | 'trace'>('explorer');
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "Req ID", "Req Title", "Type", "Source Owner", "Priority", "Status",
    "Task", "Test Cases", "Issues", "Sign-offs", "CTA", "Meetings"
  ]);

  const handleSelect = (node: NavigationNode) => {
    setSelectedNode(node);
    setSelectedId(node.id);
  };

  const handleContextChange = (context: NavigationNode | null) => {
    setCurrentContext(context);
  };

  const handleAddFolder = (folderData: any) => {
    console.log('Adding folder:', folderData);
  };

  const handleAddRequirement = (reqData: any) => {
    console.log('Adding requirement:', reqData);
  };

  const handleNavigateToNewRequirement = () => {
    setShowNewRequirement(true);
  };

  const handleDataUpdate = (newData: NavigationNode[]) => {
    setData(newData);
  };

  const handleRequirementSelect = (node: NavigationNode) => {
    // Navigate to requirement detail page
    navigate(`/requirement/${node.id}`);
  };

  const handleViewChange = (view: string) => {
    console.log('View changed:', view);
  };

  const handleColumnToggle = (column: string) => {
    setVisibleColumns(prev => 
      prev.includes(column) 
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Filter Bar */}
      <FilterBar 
        onViewChange={handleViewChange}
        visibleColumns={visibleColumns}
        onColumnToggle={handleColumnToggle}
        tableView={tableView}
        onTableViewChange={setTableView}
      />
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        {!sidebarCollapsed && (
          <div className="w-64 flex-shrink-0 relative">
            <FocusDrillSidebar
              data={data}
              onSelect={handleSelect}
              onOpenFinder={() => {}}
              selectedId={selectedId}
              onContextChange={handleContextChange}
              externalPath={externalPath}
              onAddFolder={handleAddFolder}
              onAddRequirement={handleAddRequirement}
              onDataUpdate={handleDataUpdate}
              onNavigateToNewRequirement={handleNavigateToNewRequirement}
              isCollapsed={sidebarCollapsed}
            />
            
            {/* Collapse Toggle Button - Rectangular tab at top */}
            {onToggleSidebar && (
              <div className="absolute top-3 -right-2 z-50">
                <Button
                  variant="outline"
                  className="h-8 w-4 p-0 bg-background border border-l-0 rounded-l-none rounded-r-md shadow-sm hover:bg-muted flex items-center justify-center"
                  onClick={onToggleSidebar}
                  title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                </Button>
              </div>
            )}
          </div>
        )}
        
        {/* Collapsed state toggle button */}
        {sidebarCollapsed && onToggleSidebar && (
          <div className="absolute top-4 left-0 z-50">
            <Button
              variant="outline"
              className="h-8 w-4 p-0 bg-background border border-r-0 rounded-r-none rounded-l-md shadow-sm hover:bg-muted flex items-center justify-center"
              onClick={onToggleSidebar}
              title="Expand sidebar"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        )}
        
        {/* Main Content */}
        <div className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          sidebarCollapsed && "pl-6"
        )}>
          {/* Toolbar */}
          <div className="flex-shrink-0 bg-background border-b border-border px-4 py-2">
            <div className="flex items-center justify-between">
              {/* Left: Views */}
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 gap-2 border border-muted-foreground/20 hover:border-muted-foreground/40">
                      <Eye className="h-4 w-4" />
                      Admin View
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem>Admin View</DropdownMenuItem>
                    <DropdownMenuItem>Tester View</DropdownMenuItem>
                    <DropdownMenuItem>Business View</DropdownMenuItem>
                    <DropdownMenuItem>Filtered View</DropdownMenuItem>
                    <DropdownMenuItem>Sorted View</DropdownMenuItem>
                    <div className="border-t border-border mt-1 pt-1">
                      <div className="flex items-center gap-1">
                        <DropdownMenuItem className="text-primary flex-1">
                          <Plus className="h-3 w-3 mr-2" />
                          Add View
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-primary flex-1">
                          <Save className="h-3 w-3 mr-2" />
                          Save As
                        </DropdownMenuItem>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Center: Item Count */}
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground">Showing 2 of 245 Items</span>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 border border-muted-foreground/20" title="Refresh">
                  <RefreshCw className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="icon" className="h-8 w-8 border border-muted-foreground/20" title="Filter">
                  <Filter className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="icon" className="h-8 w-8 border border-muted-foreground/20" title="Import">
                  <Upload className="h-4 w-4" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 border border-muted-foreground/20" title="Export">
                      <Download className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Export to Excel</DropdownMenuItem>
                    <DropdownMenuItem>Export to CSV</DropdownMenuItem>
                    <DropdownMenuItem>Export to PDF</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="icon" className="h-8 w-8 border border-muted-foreground/20" title="Fullscreen">
                  <Maximize className="h-4 w-4" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 border border-muted-foreground/20" title="Columns">
                      <Layout className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {[
                      "Req ID", "Req Title", "Type", "Source Owner", "Priority", "Status",
                      "Task", "Test Cases", "Issues", "Sign-offs", "CTA", "Meetings"
                    ].map((col) => (
                      <div key={col} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted/50 rounded cursor-pointer">
                        <Checkbox checked={visibleColumns.includes(col)} id={`col-${col}`} />
                        <label htmlFor={`col-${col}`} className="text-xs flex-1 cursor-pointer">{col}</label>
                      </div>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          
          {/* Data Views */}
          <div className="flex-1 overflow-hidden">
            {tableView === 'explorer' ? (
              currentContext ? (
                <RTMTreeTable 
                  data={currentContext.children || []} 
                  tableView={tableView}
                  onTableViewChange={setTableView}
                  onRequirementSelect={handleRequirementSelect}
                />
              ) : (
                <RTMTreeTable 
                  data={data} 
                  tableView={tableView}
                  onTableViewChange={setTableView}
                  onRequirementSelect={handleRequirementSelect}
                />
              )
            ) : (
              <RTMTable 
                requirements={requirementsData} 
                onRequirementClick={(req) => navigate(`/requirement/${req.reqId}`)}
                visibleColumns={visibleColumns}
                tableView={tableView}
                onTableViewChange={setTableView}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}