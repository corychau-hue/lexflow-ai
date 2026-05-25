import { PracticeArea } from "@/types";

export const practiceAreaLabels: Record<PracticeArea, string> = {
  IMMIGRATION: "Immigration",
  PERSONAL_INJURY: "Personal Injury",
  FAMILY_LAW: "Family Law",
  PROBATE_ESTATE_PLANNING: "Probate / Estate Planning",
  REAL_PROPERTY: "Real Property",
  BUSINESS_TAX: "Business / Tax",
  CIVIL_LITIGATION: "Civil Litigation",
};

export const caseTypeByPractice: Record<PracticeArea, string[]> = {
  IMMIGRATION: ["Adjustment of Status", "Consular Processing", "Naturalization", "Family Petition", "Employment-Based", "Asylum", "Deportation Defense", "Waivers", "U Visa", "VAWA"],
  PERSONAL_INJURY: ["Auto Accident", "Slip and Fall", "Medical Malpractice", "Wrongful Death", "Product Liability", "Dog Bite", "Workplace Injury"],
  FAMILY_LAW: ["Divorce", "Child Custody", "Child Support", "Spousal Support", "Adoption", "Domestic Violence", "Paternity", "Legal Separation"],
  PROBATE_ESTATE_PLANNING: ["Will Preparation", "Trust Administration", "Probate", "Estate Planning", "Living Trust", "Power of Attorney", "Health Care Directive"],
  REAL_PROPERTY: ["Property Dispute", "Landlord-Tenant", "Real Estate Transaction", "Easement", "Title Dispute", "Foreclosure"],
  BUSINESS_TAX: ["Business Formation", "Contract Review", "Business Dispute", "Tax Planning", "Partnership Agreement", "LLC Formation"],
  CIVIL_LITIGATION: ["Breach of Contract", "Fraud", "Defamation", "Civil Rights", "Appeals", "Injunction"],
};

export const checklistTemplates: Record<string, string[]> = {
  "IMMIGRATION_Adjustment of Status": [
    "Passport-style photographs (2)",
    "Copy of passport (biographical page)",
    "Copy of visa",
    "I-94 Arrival/Departure Record",
    "Birth certificate (with English translation if needed)",
    "Marriage certificate (if applying based on marriage)",
    "Divorce decree (for prior marriages)",
    "Petitioner's proof of US citizenship or LPR status (copies of naturalization certificate, green card, or US passport)",
    "Federal tax returns and transcripts (last 3 years)",
    "W-2s or 1099s (last 3 years)",
    "Pay stubs (last 6 months)",
    "Employment letter",
    "Form I-693 Report of Medical Examination (in sealed envelope)",
    "Form I-864 Affidavit of Support",
    "Form G-1145 e-Notification",
    "Filing fee check or money order",
    "Evidence of bona fide marriage (joint lease, joint bank statements, photos, etc.)",
  ],
  "IMMIGRATION_Naturalization": [
    "Passport-style photographs (2)",
    "Copy of permanent resident card (green card)",
    "Copy of all previous green cards",
    "Travel history documentation",
    "Tax returns (last 5 years)",
    "Evidence of Selective Service registration (if applicable)",
    "Marriage certificate and divorce decrees (if applicable)",
    "Certified traffic violation dispositions",
    "Child support records (if applicable)",
    "Proof of English language instruction (if relevant)",
    "Filing fee",
  ],
  "PERSONAL_INJURY_Auto Accident": [
    "Police report (Collision Report)",
    "Insurance declarations page (all parties)",
    "Claim number from insurance company",
    "Photographs of accident scene and vehicle damage",
    "Photographs of injuries",
    "Medical records and billing statements",
    "Ambulance and ER records",
    "Primary care physician records",
    "Specialist consultation records",
    "Physical therapy records",
    "Prescription records",
    "Lost wage verification from employer",
    "Property damage estimate",
    "Vehicle repair invoices",
    "Lien letters from medical providers",
    "Settlement demand draft",
    "Correspondence with insurance adjusters",
  ],
  "PROBATE_ESTATE_PLANNING_Estate Planning": [
    "Property deed(s)",
    "Mortgage statement",
    "Assessor parcel number (APN) for each property",
    "Property tax statements",
    "Family information (names, dates of birth, relationships)",
    "Beneficiary designations (life insurance, retirement accounts)",
    "Instructions for trust distribution",
    "Current power of attorney documents (if any)",
    "Advance health care directive (if any)",
    "List of all assets and estimated values",
    "List of all debts and liabilities",
    "Bank account and investment account statements",
    "Business ownership documents (if applicable)",
    "Previous wills or trusts",
    "Marriage certificate",
    "Divorce decrees (if applicable)",
  ],
  "FAMILY_LAW_Divorce": [
    "Marriage certificate",
    "Birth certificates of children",
    "Tax returns (last 3 years)",
    "Pay stubs (last 6 months)",
    "Bank account statements (last 12 months)",
    "Retirement account statements",
    "Property deeds and mortgage statements",
    "Vehicle titles and registration",
    "Credit card and loan statements",
    "Prenuptial or postnuptial agreement (if applicable)",
    "Children's school and medical records",
    "Evidence of separate property",
    "Business financial statements (if applicable)",
  ],
};

export const mockUsers = [
  { id: "user-1", email: "admin@lexflow.com", name: "Sarah Chen", role: "ADMIN", password: "password123" },
  { id: "user-2", email: "attorney@lexflow.com", name: "James Rodriguez", role: "ATTORNEY", password: "password123" },
  { id: "user-3", email: "paralegal@lexflow.com", name: "Maria Kim", role: "PARALEGAL", password: "password123" },
  { id: "user-4", email: "intake@lexflow.com", name: "David Park", role: "INTAKE_STAFF", password: "password123" },
  { id: "user-5", email: "client@lexflow.com", name: "Tran Nguyen", role: "CLIENT", password: "password123" },
];

export const mockClients = [
  {
    id: "client-1", firstName: "Tran", lastName: "Nguyen", email: "tran.nguyen@email.com", phone: "(555) 123-4567",
    dateOfBirth: new Date("1988-03-15"), language: "VIETNAMESE", eSignatureConsent: true,
    addressStreet: "1234 Main Street", addressCity: "Los Angeles", addressState: "CA", addressZip: "90012",
    immigrationStatus: "LPR", createdAt: new Date("2026-01-10"),
  },
  {
    id: "client-2", firstName: "Maria", lastName: "Garcia", email: "maria.garcia@email.com", phone: "(555) 234-5678",
    dateOfBirth: new Date("1992-07-22"), language: "SPANISH", eSignatureConsent: true,
    addressStreet: "567 Oak Avenue", addressCity: "Santa Ana", addressState: "CA", addressZip: "92701",
    immigrationStatus: "US Citizen", createdAt: new Date("2026-02-15"),
  },
  {
    id: "client-3", firstName: "Wei", lastName: "Zhang", email: "wei.zhang@email.com", phone: "(555) 345-6789",
    dateOfBirth: new Date("1985-11-08"), language: "CHINESE", eSignatureConsent: false,
    addressStreet: "890 Pine Street", addressCity: "San Francisco", addressState: "CA", addressZip: "94102",
    immigrationStatus: "F-1 Visa", createdAt: new Date("2026-03-01"),
  },
  {
    id: "client-4", firstName: "Robert", lastName: "Johnson", email: "robert.johnson@email.com", phone: "(555) 456-7890",
    dateOfBirth: new Date("1975-05-30"), language: "ENGLISH", eSignatureConsent: true,
    addressStreet: "321 Elm Drive", addressCity: "San Diego", addressState: "CA", addressZip: "92101",
    createdAt: new Date("2026-03-20"),
  },
  {
    id: "client-5", firstName: "Linh", lastName: "Pham", email: "linh.pham@email.com", phone: "(555) 567-8901",
    dateOfBirth: new Date("1990-09-12"), language: "VIETNAMESE", eSignatureConsent: true,
    addressStreet: "432 River Road", addressCity: "San Jose", addressState: "CA", addressZip: "95101",
    immigrationStatus: "DACA", createdAt: new Date("2026-04-01"),
  },
];

export const mockCases = [
  { id: "case-1", caseName: "Nguyen Family Immigration AOS", clientId: "client-1", practiceArea: "IMMIGRATION", caseType: "Adjustment of Status", status: "ACTIVE", assignedUserId: "user-2", description: "Marriage-based adjustment of status for Tran Nguyen", createdAt: new Date("2026-01-15") },
  { id: "case-2", caseName: "Garcia Personal Injury Claim", clientId: "client-2", practiceArea: "PERSONAL_INJURY", caseType: "Auto Accident", status: "ACTIVE", assignedUserId: "user-2", description: "Auto accident on I-5, rear-end collision", createdAt: new Date("2026-02-20") },
  { id: "case-3", caseName: "Zhang F-1 Visa Extension", clientId: "client-3", practiceArea: "IMMIGRATION", caseType: "Employment-Based", status: "PENDING", assignedUserId: "user-2", description: "F-1 Optional Practical Training extension", createdAt: new Date("2026-03-10") },
  { id: "case-4", caseName: "Johnson Estate Planning", clientId: "client-4", practiceArea: "PROBATE_ESTATE_PLANNING", caseType: "Estate Planning", status: "ACTIVE", assignedUserId: "user-2", description: "Comprehensive estate planning including trust", createdAt: new Date("2026-04-05") },
  { id: "case-5", caseName: "Pham DACA Renewal", clientId: "client-5", practiceArea: "IMMIGRATION", caseType: "Deportation Defense", status: "ACTIVE", assignedUserId: "user-2", description: "DACA renewal with supporting documents", createdAt: new Date("2026-04-15") },
];

export const mockTasks = [
  { id: "task-1", title: "Review I-485 application form", status: "IN_PROGRESS", priority: "High", dueDate: new Date("2026-06-01"), caseId: "case-1", assigneeId: "user-2", createdAt: new Date("2026-05-15") },
  { id: "task-2", title: "Collect medical records from hospital", status: "PENDING", priority: "High", dueDate: new Date("2026-05-28"), caseId: "case-2", assigneeId: "user-3", createdAt: new Date("2026-05-18") },
  { id: "task-3", title: "Draft I-130 petition", status: "PENDING", priority: "Medium", dueDate: new Date("2026-06-10"), caseId: "case-1", assigneeId: "user-2", createdAt: new Date("2026-05-20") },
  { id: "task-4", title: "Prepare settlement demand letter", status: "PENDING", priority: "Medium", dueDate: new Date("2026-06-15"), caseId: "case-2", assigneeId: "user-2", createdAt: new Date("2026-05-20") },
  { id: "task-5", title: "Review trust documents", status: "IN_PROGRESS", priority: "Medium", dueDate: new Date("2026-06-05"), caseId: "case-4", assigneeId: "user-2", createdAt: new Date("2026-05-22") },
  { id: "task-6", title: "File DACA renewal application", status: "PENDING", priority: "High", dueDate: new Date("2026-05-25"), caseId: "case-5", assigneeId: "user-3", createdAt: new Date("2026-05-22") },
];

export const mockDeadlines = [
  { id: "dl-1", title: "I-485 Filing Deadline", dueDate: new Date("2026-06-15"), caseId: "case-1" },
  { id: "dl-2", title: "Statute of Limitations", dueDate: new Date("2027-01-15"), caseId: "case-2" },
  { id: "dl-3", title: "DACA Renewal Expiration", dueDate: new Date("2026-05-25"), caseId: "case-5" },
  { id: "dl-4", title: "RFE Response Due", dueDate: new Date("2026-06-01"), caseId: "case-3" },
  { id: "dl-5", title: "Medical Records Request", dueDate: new Date("2026-05-28"), caseId: "case-2" },
];

export const mockLeads = [
  { id: "lead-1", firstName: "Ana", lastName: "Martinez", email: "ana.m@email.com", phone: "(555) 111-2222", practiceArea: "IMMIGRATION", status: "CONSULTATION_SCHEDULED", referralSource: "Former Client", estimatedValue: 5000, createdAt: new Date("2026-05-10") },
  { id: "lead-2", firstName: "Michael", lastName: "Brown", email: "mbrown@email.com", phone: "(555) 222-3333", practiceArea: "PERSONAL_INJURY", status: "NEW", referralSource: "Website", estimatedValue: 15000, createdAt: new Date("2026-05-15") },
  { id: "lead-3", firstName: "Sarah", lastName: "Wilson", email: "swilson@email.com", phone: "(555) 333-4444", practiceArea: "FAMILY_LAW", status: "RETAINER_SENT", referralSource: "Google Ads", estimatedValue: 8000, createdAt: new Date("2026-05-18") },
  { id: "lead-4", firstName: "James", lastName: "Lee", email: "jlee@email.com", phone: "(555) 444-5555", practiceArea: "PROBATE_ESTATE_PLANNING", status: "FOLLOW_UP_NEEDED", referralSource: "Referral", estimatedValue: 3000, createdAt: new Date("2026-05-20") },
];

export const mockDocuments = [
  { id: "doc-1", fileName: "nguyen_passport.pdf", originalName: "nguyen_passport.pdf", fileType: "application/pdf", fileSize: 245000, documentType: "PASSPORT", clientId: "client-1", caseId: "case-1", isProcessed: false, createdAt: new Date("2026-05-20") },
  { id: "doc-2", fileName: "marriage_certificate.pdf", originalName: "marriage_certificate.pdf", fileType: "application/pdf", fileSize: 180000, documentType: "MARRIAGE_CERTIFICATE", clientId: "client-1", caseId: "case-1", isProcessed: false, createdAt: new Date("2026-05-21") },
  { id: "doc-3", fileName: "police_report.pdf", originalName: "police_report.pdf", fileType: "application/pdf", fileSize: 320000, documentType: "POLICE_REPORT", clientId: "client-2", caseId: "case-2", isProcessed: false, createdAt: new Date("2026-05-22") },
  { id: "doc-4", fileName: "medical_bills.pdf", originalName: "medical_bills.pdf", fileType: "application/pdf", fileSize: 560000, documentType: "MEDICAL_BILL", clientId: "client-2", caseId: "case-2", isProcessed: false, createdAt: new Date("2026-05-23") },
];
