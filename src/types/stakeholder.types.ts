export type InvolvementLevel = 'owner' | 'approver' | 'reviewer' | 'informed';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'not-required';
export type ActivityType = 'added' | 'removed' | 'role-changed' | 'approved' | 'rejected' | 'commented';

export interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
}

export interface Stakeholder {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar: string; // URL to avatar image
  role: string;
  department: string;
  involvementLevel: InvolvementLevel;
  requiresApproval: boolean;
  approvalStatus: ApprovalStatus;
  approvalDate?: string; // ISO Date string
  approvalComments?: string;
  notificationPreferences: NotificationPreferences;
  addedDate: string; // ISO Date string
  addedBy: string;
}

export interface ApprovalWorkflow {
  totalApprovers: number;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
  lastActivityDate: string; // ISO Date string
}

export interface ActivityFeedItem {
  id: string;
  type: ActivityType;
  stakeholderId: string;
  stakeholderName: string;
  timestamp: string; // ISO Date string
  performedBy: string;
  details: string;
}

export interface StakeholderSectionData {
  requirementId: string;
  stakeholders: Stakeholder[];
  approvalWorkflow?: ApprovalWorkflow;
  activityFeed: ActivityFeedItem[];
}
