import { KnowledgeBase, Attachment } from '@/types/knowledgeBase.types';

const STORAGE_KEY = 'rtm_kb_data';

// Initial Seed Data matching the user requirement
const INITIAL_KB_DATA: KnowledgeBase = {
  id: 'kb-13061',
  requirementId: '13061',
  content: {
    description: "The Outlook calendar integration should block time slots when events are created from our application. Currently, events are created but the calendar doesn't show as busy.",
    acceptanceCriteria: [
      { id: 'ac-1', text: "Events created from app appear in Outlook calendar within 5 seconds", status: "met" },
      { id: 'ac-2', text: "Calendar shows time as 'Busy' for created events", status: "pending" },
      { id: 'ac-3', text: "Updates to event time in app reflect in Outlook", status: "pending" }
    ],
    technicalSpecs: {
      apiEndpoints: "POST /api/calendar/events\nGET /api/calendar/sync-status",
      dataModels: "Event { id, title, startTime, endTime, isBlocking, outlookId }",
      integrationPoints: "Microsoft Graph API for Outlook integration"
    },
    dependencies: [
      { requirementId: 'REQ-015', requirementTitle: 'User Authentication Module', type: 'blocked-by' }
    ],
    testCases: [
      { id: 'TC-001', description: 'Create event and verify Outlook sync', status: 'passed', priority: 'high' }
    ],
    implementationNotes: "Consider using the Graph API batch endpoint for performance if creating multiple events.",
    risks: [
      { id: 'r-1', description: 'API Rate limits from Microsoft Graph', impact: 'medium', probability: 'medium', mitigation: 'Implement exponential backoff retry logic' }
    ]
  },
  attachments: [
    {
      id: 'att-1',
      filename: 'Architecture_Diagram_v1.png',
      size: 1024 * 500, // 500KB
      uploadDate: new Date().toISOString(),
      uploadedBy: 'System Admin',
      fileUrl: '#',
      mimeType: 'image/png'
    }
  ],
  metadata: {
    lastUpdated: new Date().toISOString(),
    updatedBy: 'John Smith',
    version: 1.2,
    changeLog: [
      { date: new Date().toISOString(), user: 'John Smith', description: 'Updated acceptance criteria' }
    ]
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const knowledgeBaseService = {
  fetchKB: async (requirementId: string): Promise<KnowledgeBase> => {
    await delay(600); // Simulate network latency
    
    // In a real app, we'd key by requirementId. For this demo, we'll return the same mock if ID matches, or a generic one.
    const stored = localStorage.getItem(`${STORAGE_KEY}_${requirementId}`);
    
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Seed and return if not found
    if (requirementId === '13061') {
      localStorage.setItem(`${STORAGE_KEY}_${requirementId}`, JSON.stringify(INITIAL_KB_DATA));
      return INITIAL_KB_DATA;
    }

    // Return empty/default structure for other IDs
    const emptyDocs: KnowledgeBase = {
        ...INITIAL_KB_DATA, 
        id: `kb-${requirementId}`, 
        requirementId,
        content: { ...INITIAL_KB_DATA.content, description: '', acceptanceCriteria: [] }
    };
    return emptyDocs;
  },

  updateKB: async (requirementId: string, updates: Partial<KnowledgeBase>): Promise<KnowledgeBase> => {
    await delay(300); // Faster save
    const current = await knowledgeBaseService.fetchKB(requirementId);
    
    const updated = {
      ...current,
      ...updates,
      metadata: {
        ...current.metadata,
        lastUpdated: new Date().toISOString(),
        version: current.metadata.version + 0.1
      }
    };
    
    localStorage.setItem(`${STORAGE_KEY}_${requirementId}`, JSON.stringify(updated));
    return updated;
  },

  uploadAttachment: async (requirementId: string, file: File): Promise<Attachment> => {
    await delay(1000); // Upload simulation
    
    const newAttachment: Attachment = {
      id: `att-${Date.now()}`,
      filename: file.name,
      size: file.size,
      uploadDate: new Date().toISOString(),
      uploadedBy: 'Current User',
      fileUrl: '#', // Mock URL
      mimeType: file.type
    };

    const current = await knowledgeBaseService.fetchKB(requirementId);
    const updated = {
      ...current,
      attachments: [...current.attachments, newAttachment]
    };

    localStorage.setItem(`${STORAGE_KEY}_${requirementId}`, JSON.stringify(updated));
    return newAttachment;
  },
  
  deleteAttachment: async (requirementId: string, attachmentId: string): Promise<void> => {
      await delay(500);
      const current = await knowledgeBaseService.fetchKB(requirementId);
      const updated = {
          ...current,
          attachments: current.attachments.filter(a => a.id !== attachmentId)
      };
      localStorage.setItem(`${STORAGE_KEY}_${requirementId}`, JSON.stringify(updated));
  }
};
