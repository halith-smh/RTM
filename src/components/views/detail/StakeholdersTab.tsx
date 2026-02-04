import { useState, useEffect } from 'react';
import { 
    Stakeholder, 
    StakeholderSectionData, 
    ActivityFeedItem 
} from '@/types/stakeholder.types';
import { stakeholdersService } from '@/services/stakeholdersService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Plus, LayoutGrid, List as ListIcon, Users, ChevronDown, Search, X } from 'lucide-react';
import { StakeholderFilters } from './stakeholders/StakeholderFilters';
import { StakeholderList } from './stakeholders/StakeholderList';
import { StakeholderModal } from './stakeholders/StakeholderModal';
import { ApprovalWorkflowPanel } from './stakeholders/ApprovalWorkflowPanel';
import { ActivityFeed } from './stakeholders/ActivityFeed';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';

interface StakeholdersTabProps {
  requirementId: string;
}

export const StakeholdersTab = ({ requirementId }: StakeholdersTabProps) => {
  const [data, setData] = useState<StakeholderSectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Filters State
  const [filters, setFilters] = useState({
      search: '',
      role: '',
      department: ''
  });
  const [workitemFilter, setWorkitemFilter] = useState('Tasks');

  const loadData = async () => {
      setLoading(true);
      try {
          const result = await stakeholdersService.fetchStakeholderData(requirementId);
          setData(result);
      } catch (error) {
          toast.error("Failed to load stakeholders");
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    loadData();
  }, [requirementId]);

  const handleAddStakeholder = async (newStakeholder: Omit<Stakeholder, 'id' | 'addedDate'>) => {
      try {
          await stakeholdersService.addStakeholder(requirementId, newStakeholder);
          toast.success(`${newStakeholder.name} added to the team`);
          loadData(); // Reload to get fresh state + activity feed
      } catch (error) {
          toast.error("Failed to add stakeholder");
      }
  };

  const handleRemoveStakeholder = async (id: string) => {
      try {
          await stakeholdersService.removeStakeholder(requirementId, id);
          toast.success("Stakeholder removed");
          loadData();
      } catch (error) {
          toast.error("Failed to remove stakeholder");
      }
  };

  const handleApprove = async (id: string) => {
      try {
          await stakeholdersService.approveRequirement(requirementId, id);
          toast.success("Approval recorded successfully");
          loadData();
      } catch (error) {
          toast.error("Failed to record approval");
      }
  };

  const handleRemindAll = () => {
      toast.success("Reminder emails sent to 2 pending approvers");
  };

  // Get stakeholders based on workitem filter
  const getStakeholdersByWorkitem = (workitemType: string) => {
    const stakeholdersByWorkitem = {
      'Tasks': [
        { id: '1', name: 'John Smith', email: 'john.smith@company.com', role: 'Product Manager', department: 'Product', involvementLevel: 'owner', approvalStatus: 'approved', addedDate: '2024-01-15' },
        { id: '2', name: 'Sarah Johnson', email: 'sarah.johnson@company.com', role: 'Tech Lead', department: 'Backend Team', involvementLevel: 'approver', approvalStatus: 'pending', addedDate: '2024-01-16' },
        { id: '3', name: 'Mike Davis', email: 'mike.davis@company.com', role: 'Senior Developer', department: 'Backend Team', involvementLevel: 'reviewer', approvalStatus: 'not_required', addedDate: '2024-01-17' },
        { id: '4', name: 'Lisa Wilson', email: 'lisa.wilson@company.com', role: 'UX Designer', department: 'Design', involvementLevel: 'reviewer', approvalStatus: 'approved', addedDate: '2024-01-18' },
        { id: '5', name: 'Tom Brown', email: 'tom.brown@company.com', role: 'QA Engineer', department: 'QA Team', involvementLevel: 'reviewer', approvalStatus: 'pending', addedDate: '2024-01-19' },
        { id: '6', name: 'Emma White', email: 'emma.white@company.com', role: 'DevOps Engineer', department: 'Infrastructure', involvementLevel: 'reviewer', approvalStatus: 'not_required', addedDate: '2024-01-20' },
        { id: '7', name: 'Alex Green', email: 'alex.green@company.com', role: 'Frontend Developer', department: 'Frontend Team', involvementLevel: 'reviewer', approvalStatus: 'approved', addedDate: '2024-01-21' },
        { id: '8', name: 'Rachel Blue', email: 'rachel.blue@company.com', role: 'Business Analyst', department: 'Product', involvementLevel: 'reviewer', approvalStatus: 'pending', addedDate: '2024-01-22' },
        { id: '9', name: 'David Gray', email: 'david.gray@company.com', role: 'Security Engineer', department: 'Security', involvementLevel: 'approver', approvalStatus: 'approved', addedDate: '2024-01-23' },
        { id: '10', name: 'Sophie Red', email: 'sophie.red@company.com', role: 'Data Analyst', department: 'Analytics', involvementLevel: 'reviewer', approvalStatus: 'not_required', addedDate: '2024-01-24' }
      ],
      'Test cases': [
        { id: '11', name: 'Tom Brown', email: 'tom.brown@company.com', role: 'QA Engineer', department: 'QA Team', involvementLevel: 'owner', approvalStatus: 'approved', addedDate: '2024-01-15' },
        { id: '12', name: 'Lisa Wilson', email: 'lisa.wilson@company.com', role: 'UX Designer', department: 'Design', involvementLevel: 'reviewer', approvalStatus: 'pending', addedDate: '2024-01-16' },
        { id: '13', name: 'Mike Davis', email: 'mike.davis@company.com', role: 'Senior Developer', department: 'Backend Team', involvementLevel: 'reviewer', approvalStatus: 'approved', addedDate: '2024-01-17' },
        { id: '14', name: 'Sarah Johnson', email: 'sarah.johnson@company.com', role: 'Tech Lead', department: 'Backend Team', involvementLevel: 'approver', approvalStatus: 'pending', addedDate: '2024-01-18' },
        { id: '15', name: 'Alex Green', email: 'alex.green@company.com', role: 'Frontend Developer', department: 'Frontend Team', involvementLevel: 'reviewer', approvalStatus: 'not_required', addedDate: '2024-01-19' },
        { id: '16', name: 'John Smith', email: 'john.smith@company.com', role: 'Product Manager', department: 'Product', involvementLevel: 'approver', approvalStatus: 'approved', addedDate: '2024-01-20' }
      ],
      'Issues': [
        { id: '17', name: 'David Gray', email: 'david.gray@company.com', role: 'Security Engineer', department: 'Security', involvementLevel: 'owner', approvalStatus: 'pending', addedDate: '2024-01-15' },
        { id: '18', name: 'Sarah Johnson', email: 'sarah.johnson@company.com', role: 'Tech Lead', department: 'Backend Team', involvementLevel: 'approver', approvalStatus: 'approved', addedDate: '2024-01-16' },
        { id: '19', name: 'Mike Davis', email: 'mike.davis@company.com', role: 'Senior Developer', department: 'Backend Team', involvementLevel: 'reviewer', approvalStatus: 'pending', addedDate: '2024-01-17' },
        { id: '20', name: 'Emma White', email: 'emma.white@company.com', role: 'DevOps Engineer', department: 'Infrastructure', involvementLevel: 'reviewer', approvalStatus: 'not_required', addedDate: '2024-01-18' },
        { id: '21', name: 'John Smith', email: 'john.smith@company.com', role: 'Product Manager', department: 'Product', involvementLevel: 'approver', approvalStatus: 'approved', addedDate: '2024-01-19' }
      ],
      'Signoffs': [
        { id: '22', name: 'John Smith', email: 'john.smith@company.com', role: 'Product Manager', department: 'Product', involvementLevel: 'owner', approvalStatus: 'approved', addedDate: '2024-01-15' },
        { id: '23', name: 'Sarah Johnson', email: 'sarah.johnson@company.com', role: 'Tech Lead', department: 'Backend Team', involvementLevel: 'approver', approvalStatus: 'pending', addedDate: '2024-01-16' },
        { id: '24', name: 'David Gray', email: 'david.gray@company.com', role: 'Security Engineer', department: 'Security', involvementLevel: 'approver', approvalStatus: 'approved', addedDate: '2024-01-17' },
        { id: '25', name: 'Rachel Blue', email: 'rachel.blue@company.com', role: 'Business Analyst', department: 'Product', involvementLevel: 'reviewer', approvalStatus: 'pending', addedDate: '2024-01-18' }
      ],
      'Meetings': [
        { id: '26', name: 'John Smith', email: 'john.smith@company.com', role: 'Product Manager', department: 'Product', involvementLevel: 'owner', approvalStatus: 'approved', addedDate: '2024-01-15' },
        { id: '27', name: 'Sarah Johnson', email: 'sarah.johnson@company.com', role: 'Tech Lead', department: 'Backend Team', involvementLevel: 'reviewer', approvalStatus: 'approved', addedDate: '2024-01-16' },
        { id: '28', name: 'Lisa Wilson', email: 'lisa.wilson@company.com', role: 'UX Designer', department: 'Design', involvementLevel: 'reviewer', approvalStatus: 'not_required', addedDate: '2024-01-17' },
        { id: '29', name: 'Tom Brown', email: 'tom.brown@company.com', role: 'QA Engineer', department: 'QA Team', involvementLevel: 'reviewer', approvalStatus: 'pending', addedDate: '2024-01-18' },
        { id: '30', name: 'Rachel Blue', email: 'rachel.blue@company.com', role: 'Business Analyst', department: 'Product', involvementLevel: 'reviewer', approvalStatus: 'approved', addedDate: '2024-01-19' },
        { id: '31', name: 'Alex Green', email: 'alex.green@company.com', role: 'Frontend Developer', department: 'Frontend Team', involvementLevel: 'reviewer', approvalStatus: 'not_required', addedDate: '2024-01-20' }
      ]
    };
    return stakeholdersByWorkitem[workitemType as keyof typeof stakeholdersByWorkitem] || [];
  };

  const currentStakeholders = getStakeholdersByWorkitem(workitemFilter);
  
  // Filter Logic
  const filteredStakeholders = currentStakeholders.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                            s.email.toLowerCase().includes(filters.search.toLowerCase());
      const matchesRole = !filters.role || s.role === filters.role;
      
      return matchesSearch && matchesRole;
  });

  if (loading) {
      return (
          <div className="flex h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      );
  }

  if (!data) return null;

  return (
    <div className="w-full h-full px-6 py-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
                Stakeholders 
                <Badge variant="outline" className="ml-1">{currentStakeholders.length}</Badge>
            </h2>
            <p className="text-sm text-muted-foreground">Team members and their responsibilities in this requirement</p>
          </div>
      </div>

      {/* Filter Bar */}
      <div className="mt-2 p-2 bg-gray-50 rounded-lg mx-0 mb-6">
          <div className="flex items-center gap-6">
              {/* Search */}
              <div className="relative w-full md:w-72">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                      placeholder="Search stakeholders..." 
                      className="pl-9 h-7"
                      value={filters.search}
                      onChange={(e) => setFilters({...filters, search: e.target.value})}
                  />
              </div>
              
              {/* Workitem Filter */}
              <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-muted-foreground min-w-fit">Workitems</label>
                  <Select value={workitemFilter} onValueChange={setWorkitemFilter}>
                      <SelectTrigger className="min-w-28 h-7 px-2 py-1 text-sm border-transparent bg-transparent hover:border-border hover:bg-white [&>svg]:hidden focus:border-border focus:bg-white">
                          <SelectValue asChild>
                              <div className="flex items-center gap-1">
                                  <span className="text-sm">{workitemFilter}</span>
                                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                              </div>
                          </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="Tasks">Tasks</SelectItem>
                          <SelectItem value="Test cases">Test cases</SelectItem>
                          <SelectItem value="Issues">Issues</SelectItem>
                          <SelectItem value="Signoffs">Signoffs</SelectItem>
                          <SelectItem value="Meetings">Meetings</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              
              {/* Role Filter */}
              <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-muted-foreground min-w-fit">Role</label>
                  <Select value={filters.role || "all"} onValueChange={(val) => setFilters({...filters, role: val === "all" ? "" : val})}>
                      <SelectTrigger className="min-w-28 h-7 px-2 py-1 text-sm border-transparent bg-transparent hover:border-border hover:bg-white [&>svg]:hidden focus:border-border focus:bg-white">
                          <SelectValue asChild>
                              <div className="flex items-center gap-1">
                                  <span className="text-sm">{filters.role || "All Roles"}</span>
                                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                              </div>
                          </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value="Product Manager">Product Manager</SelectItem>
                          <SelectItem value="Tech Lead">Tech Lead</SelectItem>
                          <SelectItem value="Senior Developer">Senior Developer</SelectItem>
                          <SelectItem value="UX Designer">UX Designer</SelectItem>
                          <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                          <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                          <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                          <SelectItem value="Business Analyst">Business Analyst</SelectItem>
                          <SelectItem value="Security Engineer">Security Engineer</SelectItem>
                          <SelectItem value="Data Analyst">Data Analyst</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              
              {/* Clear Button */}
              {(filters.role || filters.search) && (
                  <Button variant="ghost" size="sm" onClick={() => setFilters({ search: '', role: '', department: '' })} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4 mr-1" /> Clear
                  </Button>
              )}
          </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main List Area */}
          <div className="xl:col-span-4 space-y-4">
              <StakeholderList 
                  stakeholders={filteredStakeholders}
                  viewMode={viewMode}
                  onRemove={handleRemoveStakeholder}
                  onApprove={handleApprove}
                  workitemFilter={workitemFilter}
              />
          </div>
      </div>

      {/* Add Modal */}
      <StakeholderModal 
          open={isAddModalOpen} 
          onOpenChange={setIsAddModalOpen}
          onSubmit={handleAddStakeholder}
      />
    </div>
  );
};
