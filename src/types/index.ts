import type {
  UserRole,
  PracticeArea,
  CaseStatus,
  DocumentType,
  TaskStatus,
  LeadStatus,
  Language,
  AIOutputStatus,
} from "@/generated/prisma/enums";

export type {
  UserRole,
  PracticeArea,
  CaseStatus,
  DocumentType,
  TaskStatus,
  LeadStatus,
  Language,
  AIOutputStatus,
};

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  dateOfBirth?: Date | null;
  language: Language;
  eSignatureConsent: boolean;
  createdAt: Date;
  cases?: Case[];
  documents?: Document[];
}

export interface Case {
  id: string;
  caseName: string;
  practiceArea: PracticeArea;
  caseType: string;
  status: CaseStatus;
  description?: string | null;
  filingDate?: Date | null;
  importance?: string | null;
  clientId: string;
  client?: Client;
  assignedUserId?: string | null;
  assignedUser?: User | null;
  createdAt: Date;
  tasks?: Task[];
  deadlines?: Deadline[];
  documents?: Document[];
}

export interface Document {
  id: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  documentType: DocumentType;
  description?: string | null;
  isProcessed: boolean;
  clientId: string;
  caseId?: string | null;
  extractedFields?: ExtractedField[];
  createdAt: Date;
}

export interface ExtractedField {
  id: string;
  fieldName: string;
  fieldValue: string;
  confidence: number;
  isApproved: boolean;
  isRejected: boolean;
  editedValue?: string | null;
  sourceRef?: string | null;
  notes?: string | null;
  documentId: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueDate?: Date | null;
  priority?: string | null;
  caseId?: string | null;
  assigneeId?: string | null;
  assignee?: User | null;
  createdAt: Date;
}

export interface Deadline {
  id: string;
  title: string;
  description?: string | null;
  dueDate: Date;
  reminder: boolean;
  completed: boolean;
  caseId: string;
}

export interface Note {
  id: string;
  content: string;
  type?: string | null;
  isPinned: boolean;
  caseId?: string | null;
  authorId?: string | null;
  author?: User | null;
  createdAt: Date;
}

export interface AIOutput {
  id: string;
  promptType: string;
  inputText: string;
  outputText: string;
  status: AIOutputStatus;
  tone?: string | null;
  practiceArea?: string | null;
  targetLang?: string | null;
  sourceLang?: string | null;
  caseId?: string | null;
  authorId?: string | null;
  createdAt: Date;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  practiceArea?: PracticeArea | null;
  status: LeadStatus;
  referralSource?: string | null;
  estimatedValue?: number | null;
  consultationNotes?: string | null;
  conflictCheckDone: boolean;
  clientId?: string | null;
  createdAt: Date;
}

export interface DashboardStats {
  activeCases: number;
  pendingIntakes: number;
  pendingDocuments: number;
  upcomingDeadlines: number;
  aiTasksPending: number;
  casesByPracticeArea: { practiceArea: string; count: number }[];
  recentActivity: ActivityItem[];
  urgentReminders: number;
}

export interface ActivityItem {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: string;
  createdAt: Date;
  userName?: string;
}

export interface ChecklistTemplate {
  practiceArea: PracticeArea;
  caseType: string;
  items: string[];
}

export interface AIAction {
  id: string;
  label: string;
  promptType: string;
  icon: string;
}
