export type DependencyType = 'blocks' | 'blocked-by' | 'related';
export type TestCaseStatus = 'passed' | 'failed' | 'pending' | 'not-run';
export type Priority = 'high' | 'medium' | 'low';
export type RiskImpact = 'high' | 'medium' | 'low';
export type RiskProbability = 'high' | 'medium' | 'low';

// Simplified AC to string to match user preference for a single rich text block
export interface TechnicalSpecs {
  apiEndpoints: string;
  dataModels: string;
  integrationPoints: string;
}

export interface Dependency {
  requirementId: string;
  requirementTitle: string;
  type: DependencyType;
}

export interface TestCase {
  id: string;
  description: string;
  status: TestCaseStatus;
  priority: Priority;
}

export interface Risk {
  id: string;
  description: string;
  impact: RiskImpact;
  probability: RiskProbability;
  mitigation: string;
}

export interface KnowledgeBaseContent {
  description: string;
  acceptanceCriteria: string;
  technicalSpecs: TechnicalSpecs;
  dependencies: Dependency[];
  testCases: TestCase[];
  implementationNotes: string;
  risks: Risk[];
}

export interface Attachment {
  id: string;
  filename: string;
  size: number;
  uploadDate: string; // Using string for serialization compatibility
  uploadedBy: string;
  fileUrl: string;
  mimeType: string;
}

export interface ChangeLogEntry {
  date: string;
  user: string;
  description: string;
}

export interface KnowledgeBaseMetadata {
  lastUpdated: string;
  updatedBy: string;
  version: number;
  changeLog: ChangeLogEntry[];
}

export interface KnowledgeBase {
  id: string;
  requirementId: string;
  content: KnowledgeBaseContent;
  attachments: Attachment[];
  metadata: KnowledgeBaseMetadata;
}
