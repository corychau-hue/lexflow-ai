import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  UserRole,
  PracticeArea,
  CaseStatus,
  DocumentType,
  TaskStatus,
  LeadStatus,
  Language,
  AIOutputStatus,
} from "../src/generated/prisma/enums";

function createPrismaClient() {
  const pool = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data in reverse dependency order
  await prisma.auditLog.deleteMany();
  await prisma.message.deleteMany();
  await prisma.eSignRequest.deleteMany();
  await prisma.extractedField.deleteMany();
  await prisma.caseChecklistItem.deleteMany();
  await prisma.aIOutput.deleteMany();
  await prisma.reviewItem.deleteMany();
  await prisma.intake.deleteMany();
  await prisma.note.deleteMany();
  await prisma.deadline.deleteMany();
  await prisma.task.deleteMany();
  await prisma.document.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.case.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  // ── Users ──────────────────────────────────────────────────────────────
  // Password hashes for "password123" (bcrypt)
  const pwHash = "$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQkf7RnI4e4HkYBk5RqVnYb3e3XxG";

  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: "user-admin",
        email: "admin@lexflow.com",
        name: "Sarah Chen",
        passwordHash: pwHash,
        role: UserRole.ADMIN,
        phone: "(213) 555-0100",
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        id: "user-attorney",
        email: "attorney@lexflow.com",
        name: "James Rodriguez",
        passwordHash: pwHash,
        role: UserRole.ATTORNEY,
        phone: "(213) 555-0101",
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        id: "user-paralegal",
        email: "paralegal@lexflow.com",
        name: "Maria Kim",
        passwordHash: pwHash,
        role: UserRole.PARALEGAL,
        phone: "(213) 555-0102",
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        id: "user-intake",
        email: "intake@lexflow.com",
        name: "David Park",
        passwordHash: pwHash,
        role: UserRole.INTAKE_STAFF,
        phone: "(213) 555-0103",
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        id: "user-client",
        email: "client@lexflow.com",
        name: "Tran Nguyen",
        passwordHash: pwHash,
        role: UserRole.CLIENT,
        phone: "(213) 555-0104",
        isActive: true,
      },
    }),
  ]);
  console.log(`  ✓ ${users.length} users created`);

  // ── Clients ────────────────────────────────────────────────────────────
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        id: "client-1",
        firstName: "Tran",
        lastName: "Nguyen",
        email: "tran.nguyen@email.com",
        phone: "(213) 555-1001",
        dateOfBirth: new Date("1988-03-15"),
        ssn: "***-**-5678",
        gender: "Male",
        countryOfBirth: "Vietnam",
        countryOfCitizenship: "Vietnam",
        addressStreet: "1234 Main Street",
        addressCity: "Los Angeles",
        addressState: "CA",
        addressZip: "90012",
        language: Language.VIETNAMESE,
        immigrationStatus: "Lawful Permanent Resident",
        consentEmail: true,
        eSignatureConsent: true,
      },
    }),
    prisma.client.create({
      data: {
        id: "client-2",
        firstName: "Maria",
        lastName: "Garcia",
        email: "maria.garcia@email.com",
        phone: "(213) 555-1002",
        dateOfBirth: new Date("1992-07-22"),
        ssn: "***-**-1234",
        gender: "Female",
        countryOfBirth: "Mexico",
        countryOfCitizenship: "Mexico",
        addressStreet: "5678 Olympic Blvd",
        addressCity: "Los Angeles",
        addressState: "CA",
        addressZip: "90019",
        language: Language.SPANISH,
        immigrationStatus: "Conditional Permanent Resident",
        consentEmail: true,
        consentSms: true,
        eSignatureConsent: true,
      },
    }),
    prisma.client.create({
      data: {
        id: "client-3",
        firstName: "Wei",
        lastName: "Zhang",
        email: "wei.zhang@email.com",
        phone: "(213) 555-1003",
        dateOfBirth: new Date("1985-11-08"),
        ssn: "***-**-9012",
        gender: "Male",
        countryOfBirth: "China",
        countryOfCitizenship: "China",
        addressStreet: "4321 Wilshire Blvd",
        addressCity: "Los Angeles",
        addressState: "CA",
        addressZip: "90010",
        language: Language.CHINESE,
        immigrationStatus: "F-1 Student Visa",
        consentEmail: true,
        eSignatureConsent: false,
      },
    }),
    prisma.client.create({
      data: {
        id: "client-4",
        firstName: "James",
        lastName: "Wilson",
        email: "james.wilson@email.com",
        phone: "(213) 555-1004",
        dateOfBirth: new Date("1978-04-30"),
        ssn: "***-**-3456",
        gender: "Male",
        countryOfBirth: "United States",
        countryOfCitizenship: "United States",
        addressStreet: "7890 Sunset Blvd",
        addressCity: "Los Angeles",
        addressState: "CA",
        addressZip: "90046",
        language: Language.ENGLISH,
        consentEmail: true,
        eSignatureConsent: true,
      },
    }),
    prisma.client.create({
      data: {
        id: "client-5",
        firstName: "Ana",
        lastName: "Martinez",
        email: "ana.martinez@email.com",
        phone: "(213) 555-1005",
        dateOfBirth: new Date("1995-09-14"),
        ssn: "***-**-7890",
        gender: "Female",
        countryOfBirth: "El Salvador",
        countryOfCitizenship: "El Salvador",
        addressStreet: "2468 Pico Blvd",
        addressCity: "Los Angeles",
        addressState: "CA",
        addressZip: "90035",
        language: Language.SPANISH,
        immigrationStatus: "Temporary Protected Status",
        consentEmail: true,
        consentSms: true,
        eSignatureConsent: true,
      },
    }),
  ]);
  console.log(`  ✓ ${clients.length} clients created`);

  // ── Cases ──────────────────────────────────────────────────────────────
  const cases = await Promise.all([
    prisma.case.create({
      data: {
        id: "case-1",
        caseName: "Nguyen Family Immigration",
        practiceArea: PracticeArea.IMMIGRATION,
        caseType: "I-485 Adjustment of Status",
        status: CaseStatus.ACTIVE,
        description: "Family-based adjustment of status application for Tran Nguyen based on marriage to US citizen.",
        filingDate: new Date("2025-11-01"),
        importance: "high",
        clientId: "client-1",
        assignedUserId: "user-attorney",
        createdById: "user-attorney",
      },
    }),
    prisma.case.create({
      data: {
        id: "case-2",
        caseName: "Garcia Removal Defense",
        practiceArea: PracticeArea.IMMIGRATION,
        caseType: "Removal Proceedings",
        status: CaseStatus.ACTIVE,
        description: "Representation in removal proceedings for Maria Garcia. Currently in pretrial phase.",
        filingDate: new Date("2025-09-15"),
        importance: "high",
        clientId: "client-2",
        assignedUserId: "user-attorney",
        createdById: "user-attorney",
      },
    }),
    prisma.case.create({
      data: {
        id: "case-3",
        caseName: "Zhang OPT Extension",
        practiceArea: PracticeArea.IMMIGRATION,
        caseType: "I-765 Employment Authorization",
        status: CaseStatus.ACTIVE,
        description: "STEM OPT extension application for Wei Zhang. Currently on F-1 visa.",
        filingDate: new Date("2026-01-10"),
        importance: "medium",
        clientId: "client-3",
        assignedUserId: "user-paralegal",
        createdById: "user-attorney",
      },
    }),
    prisma.case.create({
      data: {
        id: "case-4",
        caseName: "Wilson Estate Planning",
        practiceArea: PracticeArea.PROBATE_ESTATE_PLANNING,
        caseType: "Living Trust",
        status: CaseStatus.ACTIVE,
        description: "Comprehensive estate planning including living trust, will, and healthcare directives.",
        filingDate: new Date("2026-02-20"),
        importance: "medium",
        clientId: "client-4",
        assignedUserId: "user-attorney",
        createdById: "user-attorney",
      },
    }),
    prisma.case.create({
      data: {
        id: "case-5",
        caseName: "Martinez TPS Renewal",
        practiceArea: PracticeArea.IMMIGRATION,
        caseType: "TPS Re-registration",
        status: CaseStatus.ACTIVE,
        description: "Temporary Protected Status re-registration for Ana Martinez from El Salvador.",
        filingDate: new Date("2026-03-01"),
        importance: "high",
        clientId: "client-5",
        assignedUserId: "user-paralegal",
        createdById: "user-intake",
      },
    }),
    prisma.case.create({
      data: {
        id: "case-6",
        caseName: "Nguyen Personal Injury",
        practiceArea: PracticeArea.PERSONAL_INJURY,
        caseType: "Auto Accident",
        status: CaseStatus.ACTIVE,
        description: "Tran Nguyen was involved in a rear-end collision on I-5 on December 15, 2025. Seeking damages for medical expenses and lost wages.",
        filingDate: new Date("2026-01-05"),
        importance: "medium",
        clientId: "client-1",
        assignedUserId: "user-attorney",
        createdById: "user-attorney",
      },
    }),
    prisma.case.create({
      data: {
        id: "case-7",
        caseName: "Wilson Property Purchase",
        practiceArea: PracticeArea.REAL_PROPERTY,
        caseType: "Residential Purchase",
        status: CaseStatus.ACTIVE,
        description: "Representing James Wilson in the purchase of 1500 Oak Avenue, Los Angeles, CA 90024.",
        filingDate: new Date("2026-03-15"),
        importance: "low",
        clientId: "client-4",
        assignedUserId: "user-attorney",
        createdById: "user-paralegal",
      },
    }),
    prisma.case.create({
      data: {
        id: "case-8",
        caseName: "Martinez Family Law",
        practiceArea: PracticeArea.FAMILY_LAW,
        caseType: "Divorce",
        status: CaseStatus.PENDING,
        description: "Divorce proceedings for Ana Martinez. Uncontested with child custody arrangements.",
        clientId: "client-5",
        assignedUserId: "user-attorney",
        createdById: "user-attorney",
      },
    }),
  ]);
  console.log(`  ✓ ${cases.length} cases created`);

  // ── Documents ──────────────────────────────────────────────────────────
  const docs = [
    { id: "doc-1", originalName: "nguyen_passport.pdf", type: DocumentType.PASSPORT, clientId: "client-1", caseId: "case-1" },
    { id: "doc-2", originalName: "nguyen_marriage_certificate.pdf", type: DocumentType.MARRIAGE_CERTIFICATE, clientId: "client-1", caseId: "case-1" },
    { id: "doc-3", originalName: "nguyen_birth_certificate.pdf", type: DocumentType.BIRTH_CERTIFICATE, clientId: "client-1", caseId: "case-1" },
    { id: "doc-4", originalName: "garcia_i94.pdf", type: DocumentType.I94, clientId: "client-2", caseId: "case-2" },
    { id: "doc-5", originalName: "garcia_court_order.pdf", type: DocumentType.COURT_DOCUMENT, clientId: "client-2", caseId: "case-2" },
    { id: "doc-6", originalName: "zhang_visa.pdf", type: DocumentType.VISA, clientId: "client-3", caseId: "case-3" },
    { id: "doc-7", originalName: "zhang_offer_letter.pdf", type: DocumentType.OTHER, clientId: "client-3", caseId: "case-3" },
    { id: "doc-8", originalName: "martinez_tps_notice.pdf", type: DocumentType.OTHER, clientId: "client-5", caseId: "case-5" },
    { id: "doc-9", originalName: "nguyen_police_report.pdf", type: DocumentType.POLICE_REPORT, clientId: "client-1", caseId: "case-6" },
    { id: "doc-10", originalName: "nguyen_medical_bill.pdf", type: DocumentType.MEDICAL_BILL, clientId: "client-1", caseId: "case-6" },
  ];

  const documents = await Promise.all(
    docs.map((d) =>
      prisma.document.create({
        data: {
          id: d.id,
          fileName: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.pdf`,
          originalName: d.originalName,
          fileType: "application/pdf",
          fileSize: Math.floor(Math.random() * 5000000) + 50000,
          filePath: `/uploads/${d.id}.pdf`,
          documentType: d.type,
          clientId: d.clientId,
          caseId: d.caseId,
          isProcessed: Math.random() > 0.3,
        },
      })
    )
  );
  console.log(`  ✓ ${documents.length} documents created`);

  // ── Extracted Fields ───────────────────────────────────────────────────
  await prisma.extractedField.createMany({
    data: [
      { id: "ef-1", fieldName: "Full Name", fieldValue: "Tran Nguyen Van", confidence: 0.95, isApproved: true, documentId: "doc-1" },
      { id: "ef-2", fieldName: "Passport Number", fieldValue: "AB1234567", confidence: 0.92, isApproved: true, documentId: "doc-1" },
      { id: "ef-3", fieldName: "Date of Birth", fieldValue: "March 15, 1988", confidence: 0.94, isApproved: true, documentId: "doc-1" },
      { id: "ef-4", fieldName: "Nationality", fieldValue: "Vietnamese", confidence: 0.88, isApproved: true, documentId: "doc-1" },
      { id: "ef-5", fieldName: "Spouse Name", fieldValue: "Sarah Nguyen", confidence: 0.91, isApproved: false, documentId: "doc-2" },
      { id: "ef-6", fieldName: "Marriage Date", fieldValue: "June 20, 2022", confidence: 0.87, isApproved: false, documentId: "doc-2" },
      { id: "ef-7", fieldName: "I-94 Number", fieldValue: "98765432101", confidence: 0.76, isApproved: false, documentId: "doc-4" },
      { id: "ef-8", fieldName: "Admit Until Date", fieldValue: "March 15, 2026", confidence: 0.72, isApproved: false, documentId: "doc-4" },
    ],
  });
  console.log("  ✓ 8 extracted fields created");

  // ── Tasks ──────────────────────────────────────────────────────────────
  await prisma.task.createMany({
    data: [
      { id: "task-1", title: "Draft I-485 application", description: "Complete the I-485 form for Tran Nguyen", status: TaskStatus.IN_PROGRESS, dueDate: new Date("2026-06-15"), priority: "high", caseId: "case-1", assigneeId: "user-paralegal" },
      { id: "task-2", title: "Collect supporting documents", description: "Gather all evidence for Nguyen family case", status: TaskStatus.COMPLETED, dueDate: new Date("2026-05-01"), priority: "high", caseId: "case-1", assigneeId: "user-paralegal" },
      { id: "task-3", title: "File I-130 petition", description: "Submit the I-130 Petition for Alien Relative", status: TaskStatus.PENDING, dueDate: new Date("2026-06-01"), priority: "high", caseId: "case-1", assigneeId: "user-attorney" },
      { id: "task-4", title: "Prepare for removal hearing", description: "Review evidence and prepare defense strategy", status: TaskStatus.IN_PROGRESS, dueDate: new Date("2026-07-20"), priority: "high", caseId: "case-2", assigneeId: "user-attorney" },
      { id: "task-5", title: "Submit OPT application", description: "Complete I-765 for STEM OPT extension", status: TaskStatus.PENDING, dueDate: new Date("2026-05-30"), priority: "medium", caseId: "case-3", assigneeId: "user-paralegal" },
      { id: "task-6", title: "Draft living trust document", description: "Prepare revocable living trust for Wilson", status: TaskStatus.PENDING, dueDate: new Date("2026-06-10"), priority: "medium", caseId: "case-4", assigneeId: "user-paralegal" },
      { id: "task-7", title: "Follow up on medical records", description: "Request updated medical records from hospital", status: TaskStatus.IN_PROGRESS, dueDate: new Date("2026-05-25"), priority: "medium", caseId: "case-6", assigneeId: "user-paralegal" },
    ],
  });
  console.log("  ✓ 7 tasks created");

  // ── Deadlines ──────────────────────────────────────────────────────────
  await prisma.deadline.createMany({
    data: [
      { id: "dl-1", title: "I-485 Filing Deadline", description: "Must file before current status expires", dueDate: new Date("2026-07-15"), reminder: true, completed: false, caseId: "case-1" },
      { id: "dl-2", title: "Removal Hearing Date", description: "Master calendar hearing at Immigration Court", dueDate: new Date("2026-07-20"), reminder: true, completed: false, caseId: "case-2" },
      { id: "dl-3", title: "OPT Application Window", description: "Must apply within 60 days of I-20 issue date", dueDate: new Date("2026-06-01"), reminder: true, completed: false, caseId: "case-3" },
      { id: "dl-4", title: "TPS Renewal Deadline", description: "Re-registration period ends", dueDate: new Date("2026-06-30"), reminder: true, completed: false, caseId: "case-5" },
      { id: "dl-5", title: "Statute of Limitations", description: "Personal injury SOL for auto accident", dueDate: new Date("2028-12-15"), reminder: false, completed: false, caseId: "case-6" },
      { id: "dl-6", title: "Escrow Closing Date", description: "Scheduled close of escrow on property purchase", dueDate: new Date("2026-05-30"), reminder: true, completed: false, caseId: "case-7" },
    ],
  });
  console.log("  ✓ 6 deadlines created");

  // ── Notes ──────────────────────────────────────────────────────────────
  await prisma.note.createMany({
    data: [
      { id: "note-1", content: "Client called to confirm receipt of documents. All appear to be in order. Need to follow up on medical exam.", type: "general", isPinned: false, caseId: "case-1", authorId: "user-paralegal" },
      { id: "note-2", content: "Discussed removal defense strategy with client. Client prefers to pursue cancellation of removal. Will need to gather evidence of 10+ years continuous presence.", type: "strategy", isPinned: true, caseId: "case-2", authorId: "user-attorney" },
      { id: "note-3", content: "Received updated I-20 from USCIS for OPT recommendation. Ready to proceed with filing.", type: "general", isPinned: false, caseId: "case-3", authorId: "user-paralegal" },
      { id: "note-4", content: "Initial consultation completed. Client wants a comprehensive estate plan including trust, will, and healthcare directives.", type: "general", isPinned: false, caseId: "case-4", authorId: "user-attorney" },
      { id: "note-5", content: "Client was in a car accident on I-5. Rear-ended by another driver. Client has whiplash and back pain. Police report indicates other driver at fault.", type: "general", isPinned: false, caseId: "case-6", authorId: "user-paralegal" },
    ],
  });
  console.log("  ✓ 5 notes created");

  // ── AI Outputs ─────────────────────────────────────────────────────────
  await prisma.aIOutput.createMany({
    data: [
      { id: "ai-1", promptType: "summarize", inputText: "Case involves I-485 adjustment of status with marriage basis...", outputText: "## Case Summary\n\nThis is a family-based adjustment of status case for Tran Nguyen, married to a US citizen. The case requires filing of I-130 and I-485 concurrently. Key evidence includes marriage certificate, joint financial records, and affidavits from friends and family.", status: AIOutputStatus.PENDING_REVIEW, caseId: "case-1", authorId: "user-attorney" },
      { id: "ai-2", promptType: "translate", inputText: "Notice to Appear...", outputText: "Aviso de Comparecencia...", status: AIOutputStatus.APPROVED, caseId: "case-2", authorId: "user-paralegal" },
      { id: "ai-3", promptType: "draft", inputText: "Draft a cover letter for I-485 application packet", outputText: "Dear USCIS,\n\nEnclosed please find the I-485 Application to Register Permanent Residence or Adjust Status for Tran Nguyen...", status: AIOutputStatus.PENDING_REVIEW, caseId: "case-1", authorId: "user-paralegal" },
      { id: "ai-4", promptType: "checklist", inputText: "Generate document checklist for I-485", outputText: "## Required Documents\n- Copy of passport\n- Birth certificate\n- Marriage certificate\n- I-94 Arrival Record\n- Medical exam (I-693)\n- Two passport photos\n- Form I-864 Affidavit of Support", status: AIOutputStatus.APPROVED, caseId: "case-1", authorId: "user-attorney" },
    ],
  });
  console.log("  ✓ 4 AI outputs created");

  // ── Leads ──────────────────────────────────────────────────────────────
  await prisma.lead.createMany({
    data: [
      { id: "lead-1", firstName: "Robert", lastName: "Kim", email: "robert.kim@email.com", phone: "(323) 555-2001", practiceArea: PracticeArea.IMMIGRATION, status: LeadStatus.NEW, referralSource: "Google Ads", estimatedValue: 5000, conflictCheckDone: false, notes: "Called about employment-based green card" },
      { id: "lead-2", firstName: "Sofia", lastName: "Lopez", email: "sofia.lopez@email.com", phone: "(323) 555-2002", practiceArea: PracticeArea.FAMILY_LAW, status: LeadStatus.CONSULTATION_SCHEDULED, referralSource: "Existing client referral", estimatedValue: 8000, conflictCheckDone: true, notes: "Divorce consultation scheduled for June 1" },
      { id: "lead-3", firstName: "Michael", lastName: "Brown", email: "michael.brown@email.com", phone: "(323) 555-2003", practiceArea: PracticeArea.PERSONAL_INJURY, status: LeadStatus.RETAINED, referralSource: "Accident attorney referral", estimatedValue: 35000, conflictCheckDone: true, consultationNotes: "Client was in a slip and fall at a grocery store. Store owner negligence is clear.", clientId: null, notes: "Strong case, signed retainer on May 1" },
      { id: "lead-4", firstName: "Yuki", lastName: "Tanaka", email: "yuki.tanaka@email.com", phone: "(323) 555-2004", practiceArea: PracticeArea.IMMIGRATION, status: LeadStatus.FOLLOW_UP_NEEDED, referralSource: "Website inquiry", estimatedValue: 3000, conflictCheckDone: true, consultationNotes: "Client on H-1B visa, seeking employer-sponsored green card. Employer is willing to sponsor.", clientId: null, notes: "Follow up with employer's HR department" },
    ],
  });
  console.log("  ✓ 4 leads created");

  // ── Messages ───────────────────────────────────────────────────────────
  await prisma.message.createMany({
    data: [
      { id: "msg-1", subject: "Document submission confirmation", body: "Dear Tran, We have received all your documents. Our team will review them and reach out if anything else is needed.", direction: "OUTBOUND", channel: "email", sentAt: new Date("2026-04-20T10:30:00Z"), readAt: new Date("2026-04-20T14:00:00Z"), caseId: "case-1", clientId: "client-1", senderId: "user-paralegal" },
      { id: "msg-2", subject: "Question about marriage evidence", body: "What additional documents do you need for our marriage evidence?", direction: "INBOUND", channel: "portal", sentAt: new Date("2026-04-22T09:15:00Z"), caseId: "case-1", clientId: "client-1", senderId: "user-client" },
      { id: "msg-3", subject: "Hearing preparation", body: "Maria, please review the attached evidence packet before our next hearing preparation meeting.", direction: "OUTBOUND", channel: "email", sentAt: new Date("2026-05-01T16:00:00Z"), caseId: "case-2", clientId: "client-2", senderId: "user-attorney" },
    ],
  });
  console.log("  ✓ 3 messages created");

  // ── Review Items ───────────────────────────────────────────────────────
  await prisma.reviewItem.createMany({
    data: [
      { id: "review-1", title: "I-485 Form Data Packet — Nguyen Family Immigration", type: "IMMIGRATION_PACKET", status: "PENDING_REVIEW", caseId: "case-1", clientName: "Tran Nguyen", details: "Form data packet generated for Nguyen Family Immigration case. Ready for attorney review.", createdAt: new Date("2026-05-20T08:00:00Z") },
      { id: "review-2", title: "AI Summary — Nguyen Family Immigration", type: "AI_SUMMARY", status: "PENDING_REVIEW", caseId: "case-1", clientName: "Tran Nguyen", details: "AI-generated case summary pending attorney review.", createdAt: new Date("2026-05-19T14:30:00Z") },
      { id: "review-3", title: "Translation — Garcia Removal Defense", type: "TRANSLATION", status: "APPROVED", caseId: "case-2", clientName: "Maria Garcia", details: "Spanish translation of Notice to Appear. Approved by James Rodriguez.", createdAt: new Date("2026-05-15T11:00:00Z") },
      { id: "review-4", title: "I-765 Draft — Zhang OPT Extension", type: "IMMIGRATION_PACKET", status: "PENDING_REVIEW", caseId: "case-3", clientName: "Wei Zhang", details: "Form I-765 draft generated for STEM OPT extension.", createdAt: new Date("2026-05-22T09:00:00Z") },
    ],
  });
  console.log("  ✓ 4 review items created");

  // ── Audit Logs ─────────────────────────────────────────────────────────
  await prisma.auditLog.createMany({
    data: [
      { id: "audit-1", action: "USER_LOGIN", entityType: "User", entityId: "user-attorney", details: { ip: "192.168.1.10" }, userId: "user-attorney", createdAt: new Date("2026-05-24T08:00:00Z") },
      { id: "audit-2", action: "CLIENT_CREATED", entityType: "Client", entityId: "client-1", details: { createdBy: "user-attorney" }, userId: "user-attorney", createdAt: new Date("2025-10-15T10:00:00Z") },
      { id: "audit-3", action: "DOCUMENT_UPLOADED", entityType: "Document", entityId: "doc-1", details: { fileName: "nguyen_passport.pdf" }, userId: "user-paralegal", createdAt: new Date("2026-04-15T14:00:00Z") },
      { id: "audit-4", action: "AI_OUTPUT_GENERATED", entityType: "AIOutput", entityId: "ai-1", details: { promptType: "summarize" }, userId: "user-attorney", createdAt: new Date("2026-05-19T14:30:00Z") },
      { id: "audit-5", action: "REVIEW_APPROVED", entityType: "ReviewItem", entityId: "review-3", details: { approvedBy: "user-attorney" }, userId: "user-attorney", createdAt: new Date("2026-05-16T09:00:00Z") },
    ],
  });
  console.log("  ✓ 5 audit logs created");

  // ── ESigned Requests ───────────────────────────────────────────────────
  await prisma.eSignRequest.createMany({
    data: [
      { id: "esign-1", title: "Retainer Agreement — Nguyen", signerName: "Tran Nguyen", signerEmail: "tran.nguyen@email.com", status: "SIGNED", signedFilePath: "/uploads/esign/retainer-nguyen-signed.pdf", sentAt: new Date("2025-10-20T10:00:00Z"), signedAt: new Date("2025-10-21T14:00:00Z"), caseId: "case-1", documentId: "doc-1", preparedById: "user-attorney" },
      { id: "esign-2", title: "Release of Information — Garcia", signerName: "Maria Garcia", signerEmail: "maria.garcia@email.com", status: "PENDING", caseId: "case-2", preparedById: "user-paralegal" },
    ],
  });
  console.log("  ✓ 2 e-sign requests created");

  // ── Case Checklist Items ───────────────────────────────────────────────
  await prisma.caseChecklistItem.createMany({
    data: [
      { id: "cci-1", itemName: "Copy of passport biographical page", isRequired: true, isReceived: true, receivedAt: new Date("2026-04-10"), sortOrder: 1, caseId: "case-1" },
      { id: "cci-2", itemName: "Birth certificate with translation", isRequired: true, isReceived: true, receivedAt: new Date("2026-04-10"), sortOrder: 2, caseId: "case-1" },
      { id: "cci-3", itemName: "Marriage certificate", isRequired: true, isReceived: true, receivedAt: new Date("2026-04-11"), sortOrder: 3, caseId: "case-1" },
      { id: "cci-4", itemName: "Medical exam (Form I-693)", isRequired: true, isReceived: false, sortOrder: 4, caseId: "case-1" },
      { id: "cci-5", itemName: "Form I-864 Affidavit of Support", isRequired: true, isReceived: false, sortOrder: 5, caseId: "case-1" },
      { id: "cci-6", itemName: "Two passport-style photos", isRequired: true, isReceived: true, receivedAt: new Date("2026-04-12"), sortOrder: 6, caseId: "case-1" },
      { id: "cci-7", itemName: "Police clearance certificate", isRequired: true, isReceived: false, sortOrder: 1, caseId: "case-2" },
      { id: "cci-8", itemName: "Proof of continuous residence", isRequired: true, isReceived: false, sortOrder: 2, caseId: "case-2" },
    ],
  });
  console.log("  ✓ 8 case checklist items created");

  // ── Intakes ────────────────────────────────────────────────────────────
  await prisma.intake.createMany({
    data: [
      {
        id: "intake-1",
        clientId: "client-1",
        formData: {
          personal: {
            firstName: "Tran", lastName: "Nguyen", dateOfBirth: "1988-03-15",
            email: "tran.nguyen@email.com", phone: "(213) 555-1001",
            gender: "Male", countryOfBirth: "Vietnam", countryOfCitizenship: "Vietnam",
            ssn: "***-**-5678", height: "5'8\"", weight: "165 lbs",
            hairColor: "Black", eyeColor: "Brown", otherNames: "",
          },
          address: { street: "1234 Main Street", city: "Los Angeles", state: "CA", zip: "90012" },
          family: {
            maritalStatus: "Married", spouseName: "Sarah Nguyen",
            spouseDOB: "1990-07-22", spouseCountryBirth: "United States",
            spouseCitizen: true, marriageDate: "2022-06-20", marriagePlace: "Los Angeles, CA",
            priorMarriages: "0", motherName: "Lien Nguyen", fatherName: "Huy Nguyen",
          },
          immigration: {
            aNumber: "A123 456 789", immigrationStatus: "Lawful Permanent Resident",
            lastArrivalDate: "2022-06-20", lastArrivalPlace: "Los Angeles, CA",
            statusAtEntry: "K-1 Fiancé Visa", i94Number: "98765432101",
            statusExpired: false, waiverNeeded: false, removalProceedings: false,
            unauthorizedWork: false, visaViolations: false,
          },
          education: { highestLevel: "Bachelor's Degree", schoolName: "University of California, Irvine" },
          employment: { currentEmployer: "Tech Corp Inc.", currentTitle: "Software Engineer" },
          priorFilings: { hasPriorFilings: false },
          criminalHistory: { arrested: false, convicted: false },
        },
        submittedAt: new Date("2026-04-01T10:00:00Z"),
      },
    ],
  });
  console.log("  ✓ 1 intake record created");

  console.log("\n✓ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
