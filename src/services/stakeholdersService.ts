import { Stakeholder, StakeholderSectionData, ActivityFeedItem } from '@/types/stakeholder.types';

const STORAGE_KEY = 'rtm_stakeholders_data';

const INITIAL_STAKEHOLDERS: Stakeholder[] = [
  {
    id: 'sh-1',
    userId: 'u-1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    avatar: '',
    role: 'Product Manager',
    department: 'Product',
    involvementLevel: 'owner',
    requiresApproval: false,
    approvalStatus: 'not-required',
    notificationPreferences: { email: true, inApp: true },
    addedDate: new Date('2023-11-15').toISOString(),
    addedBy: 'System'
  },
  {
    id: 'sh-2',
    userId: 'u-2',
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    avatar: '',
    role: 'Tech Lead',
    department: 'Backend Team',
    involvementLevel: 'approver',
    requiresApproval: true,
    approvalStatus: 'pending',
    notificationPreferences: { email: true, inApp: true },
    addedDate: new Date('2023-11-16').toISOString(),
    addedBy: 'John Smith'
  },
  {
    id: 'sh-3',
    userId: 'u-3',
    name: 'Mike Davis',
    email: 'mike.d@company.com',
    avatar: '',
    role: 'Senior Developer',
    department: 'Backend Team',
    involvementLevel: 'reviewer',
    requiresApproval: false,
    approvalStatus: 'not-required',
    notificationPreferences: { email: false, inApp: true },
    addedDate: new Date('2023-11-20').toISOString(),
    addedBy: 'Sarah Johnson'
  }
];

const INITIAL_ACTIVITY_FEED: ActivityFeedItem[] = [
  {
    id: 'act-1',
    type: 'added',
    stakeholderId: 'sh-2',
    stakeholderName: 'Sarah Johnson',
    timestamp: new Date('2023-11-16').toISOString(),
    performedBy: 'John Smith',
    details: 'Added as Tech Lead'
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const stakeholdersService = {
  fetchStakeholderData: async (requirementId: string): Promise<StakeholderSectionData> => {
    await delay(500);
    const stored = localStorage.getItem(`${STORAGE_KEY}_${requirementId}`);
    
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Seed data
    const seedData: StakeholderSectionData = {
      requirementId,
      stakeholders: INITIAL_STAKEHOLDERS,
      activityFeed: INITIAL_ACTIVITY_FEED,
      approvalWorkflow: {
        totalApprovers: 1,
        approvedCount: 0,
        rejectedCount: 0,
        pendingCount: 1,
        lastActivityDate: new Date().toISOString()
      }
    };
    
    localStorage.setItem(`${STORAGE_KEY}_${requirementId}`, JSON.stringify(seedData));
    return seedData;
  },

  addStakeholder: async (requirementId: string, stakeholder: Omit<Stakeholder, 'id' | 'addedDate'>): Promise<Stakeholder> => {
    await delay(300);
    const data = await stakeholdersService.fetchStakeholderData(requirementId);
    
    const newStakeholder: Stakeholder = {
      ...stakeholder,
      id: `sh-${Date.now()}`,
      addedDate: new Date().toISOString()
    };
    
    const updatedData = {
      ...data,
      stakeholders: [...data.stakeholders, newStakeholder],
      activityFeed: [
        {
          id: `act-${Date.now()}`,
          type: 'added' as const,
          stakeholderId: newStakeholder.id,
          stakeholderName: newStakeholder.name,
          timestamp: new Date().toISOString(),
          performedBy: 'Current User',
          details: `Added as ${newStakeholder.role}`
        },
        ...data.activityFeed
      ]
    };
    
    localStorage.setItem(`${STORAGE_KEY}_${requirementId}`, JSON.stringify(updatedData));
    return newStakeholder;
  },

  removeStakeholder: async (requirementId: string, stakeholderId: string): Promise<void> => {
      await delay(300);
      const data = await stakeholdersService.fetchStakeholderData(requirementId);
      const updatedData = {
          ...data,
          stakeholders: data.stakeholders.filter(s => s.id !== stakeholderId)
      };
      localStorage.setItem(`${STORAGE_KEY}_${requirementId}`, JSON.stringify(updatedData));
  },

  approveRequirement: async (requirementId: string, stakeholderId: string): Promise<void> => {
      await delay(400);
      const data = await stakeholdersService.fetchStakeholderData(requirementId);
      const updatedStakeholders = data.stakeholders.map(s => 
          s.id === stakeholderId 
            ? { ...s, approvalStatus: 'approved' as const, approvalDate: new Date().toISOString() } 
            : s
      );
      
      const updatedData = {
          ...data,
          stakeholders: updatedStakeholders,
          approvalWorkflow: {
              ...data.approvalWorkflow!,
              approvedCount: (data.approvalWorkflow?.approvedCount || 0) + 1,
              pendingCount: (data.approvalWorkflow?.pendingCount || 1) - 1
          }
      };
      localStorage.setItem(`${STORAGE_KEY}_${requirementId}`, JSON.stringify(updatedData));
  }
};
