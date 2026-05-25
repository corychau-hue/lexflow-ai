"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { I485_KNOWLEDGE_BASE, EVIDENCE_CHECKLIST } from "@/lib/i485-knowledge-base";
import { ChevronDown, ChevronUp, BookOpen, Shield, AlertTriangle } from "lucide-react";

interface ClientData {
  fullName: string;
  dateOfBirth: string;
  countryOfBirth: string;
  citizenship: string;
  aNumber: string;
  immigrationStatus: string;
  dateOfEntry: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  phone: string;

  // Extended I-485 fields from intake
  gender?: string;
  maritalStatus?: string;
  otherNames?: string;
  ssn?: string;
  height?: string;
  weight?: string;
  hairColor?: string;
  eyeColor?: string;
  smsConsent?: boolean;
  needsAccommodation?: boolean;

  // Education
  eduLevel?: string;
  eduSchool?: string;
  eduLocation?: string;
  eduDegree?: string;
  eduFrom?: string;
  eduTo?: string;

  // Employment
  employer?: string;
  jobTitle?: string;
  empStart?: string;
  empAddress?: string;
  empCity?: string;
  empState?: string;
  empDuties?: string;
  prevEmployer?: string;
  prevTitle?: string;
  prevStart?: string;
  prevEnd?: string;

  // Family
  spouseName?: string;
  spouseDOB?: string;
  spouseBirth?: string;
  spouseANumber?: string;
  spouseCitizen?: boolean;
  spouseStatus?: string;
  marriageDate?: string;
  marriagePlace?: string;
  priorMarriages?: string;
  priorMarriageEnd?: string;
  priorMarriageEndDate?: string;
  childrenCount?: string;
  childName?: string;
  childDOB?: string;
  childCitizen?: boolean;
  motherName?: string;
  motherCountry?: string;
  fatherName?: string;
  fatherCountry?: string;
  parentUSCitizen?: boolean;
  siblingsCount?: string;
  petitionerRelationship?: string;

  // Immigration history
  i94Number?: string;
  lastArrivalPlace?: string;
  statusAtEntry?: string;
  departureHistory?: string;
  statusExpired?: boolean;
  waiverNeeded?: boolean;
  removalProceedings?: boolean;
  unauthorizedWork?: boolean;
  visaViolations?: boolean;
  publicBenefits?: boolean;
  militaryService?: boolean;

  // Criminal
  arrested?: boolean;
  arrestExplanation?: string;
  convicted?: boolean;
  convictionExplanation?: string;

  // Prior Filings
  hasPriorFilings?: boolean;
  priorFormType?: string;
  priorFilingDate?: string;
  priorReceiptNumber?: string;
}

interface I485FormProps {
  clientData: ClientData;
  intakeId?: string;
}

export function I485Form({ clientData, intakeId }: I485FormProps) {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);
  const [expandedPart, setExpandedPart] = useState<string | null>(null);

  const d = clientData;

  const formSections = [
    {
      partNumber: "Part 1",
      title: "Information About You",
      fields: [
        { label: "Your Full Legal Name (Last, First, Middle)", value: d.fullName, intakeSource: "Personal Info → First/Last Name", instructions: "Enter exactly as shown on passport." },
        { label: "Date of Birth", value: d.dateOfBirth, type: "date", intakeSource: "Personal Info → DOB", instructions: "Must match birth certificate." },
        { label: "Country of Birth", value: d.countryOfBirth, intakeSource: "Personal Info → Country of Birth", instructions: "Enter as currently known." },
        { label: "Country of Citizenship", value: d.citizenship, intakeSource: "Personal Info → Country of Citizenship", instructions: "Enter current citizenship." },
        { label: "U.S. Social Security Number", value: d.ssn || "N/A", intakeSource: "Personal Info → SSN", instructions: "If not issued, write 'None'." },
        { label: "A-Number (USCIS Number)", value: d.aNumber, intakeSource: "Immigration History → A-Number", instructions: "Format: AXXXXXXXX." },
        { label: "Gender", value: d.gender || "—", intakeSource: "Personal Info → Gender", instructions: "Select your gender." },
        { label: "Marital Status", value: d.maritalStatus || "—", intakeSource: "Family → Marital Status", instructions: "As of filing date." },
        { label: "Other Names Used", value: d.otherNames || "N/A", intakeSource: "Personal Info → Other Names", instructions: "Maiden name, aliases, nicknames." },
        { label: "Height / Weight", value: `${d.height || "—"} / ${d.weight || "—"}`, intakeSource: "Personal Info", instructions: "Height in feet/inches, weight in pounds." },
      ],
    },
    {
      partNumber: "Part 2",
      title: "Application Type",
      fields: [
        { label: "Application Basis", value: d.petitionerRelationship || "Spouse of U.S. Citizen", intakeSource: "Family → Petitioner Relationship", instructions: "Basis for adjustment." },
        { label: "Applying for Waiver?", value: d.waiverNeeded ? "Yes" : "No", intakeSource: "Immigration History → Waiver Needed", instructions: "I-601/I-601A if needed." },
      ],
    },
    {
      partNumber: "Part 3",
      title: "Address & Contact Information",
      fields: [
        { label: "Street Address", value: d.address, intakeSource: "Address → Street", instructions: "Current U.S. residential address." },
        { label: "City / State / ZIP", value: `${d.city}, ${d.state} ${d.zip}`, intakeSource: "Address", instructions: "Current residence." },
        { label: "Email Address", value: d.email, intakeSource: "Personal Info → Email", instructions: "For USCIS case updates." },
        { label: "Phone Number", value: d.phone, intakeSource: "Personal Info → Phone", instructions: "Daytime phone." },
        { label: "SMS/Text Authorized?", value: d.smsConsent ? "Yes" : "No", intakeSource: "Personal Info → SMS Consent", instructions: "USCIS may send SMS updates." },
      ],
    },
    {
      partNumber: "Part 5",
      title: "Employment History (Last 5 Years)",
      fields: [
        { label: "Current Employer", value: d.employer || "ABC Corporation", intakeSource: "Employment → Employer", instructions: "Current or most recent employer name." },
        { label: "Job Title", value: d.jobTitle || "Software Engineer", intakeSource: "Employment → Title", instructions: "Current position title." },
        { label: "Start Date", value: d.empStart || "2023-01-15", type: "date", intakeSource: "Employment → Start Date", instructions: "Date employment began." },
        { label: "Employer Address", value: `${d.empAddress || "N/A"}, ${d.empCity || ""}, ${d.empState || ""}`, intakeSource: "Employment", instructions: "Employer's physical address." },
        { label: "Job Duties", value: d.empDuties || "N/A", intakeSource: "Employment → Duties", instructions: "Brief description of responsibilities." },
        { label: "Previous Employer", value: d.prevEmployer || "N/A", intakeSource: "Employment → Previous", instructions: "If less than 5 years at current." },
        { label: "Previous Employment Dates", value: d.prevStart && d.prevEnd ? `${d.prevStart} to ${d.prevEnd}` : "N/A", intakeSource: "Employment → Previous Dates", instructions: "Date range for prior employment." },
      ],
    },
    {
      partNumber: "Part 6",
      title: "Education",
      fields: [
        { label: "Highest Level of Education", value: d.eduLevel || "Bachelor's Degree", intakeSource: "Education → Highest Level", instructions: "Select highest completed." },
        { label: "School Name", value: d.eduSchool || "University of California", intakeSource: "Education → School Name", instructions: "Institution where degree earned." },
        { label: "School Location", value: d.eduLocation || "N/A", intakeSource: "Education → Location", instructions: "City, State/Country." },
        { label: "Degree Earned", value: d.eduDegree || "B.S. Computer Science", intakeSource: "Education → Degree", instructions: "Degree, diploma, or certificate." },
        { label: "Dates Attended", value: d.eduFrom && d.eduTo ? `${d.eduFrom} to ${d.eduTo}` : "N/A", intakeSource: "Education → Dates", instructions: "Start and end dates." },
      ],
    },
    {
      partNumber: "Part 8",
      title: "Your Parents",
      fields: [
        { label: "Mother's Full Name", value: d.motherName || "N/A", intakeSource: "Family → Mother", instructions: "Biological mother's name at birth." },
        { label: "Mother's Country of Birth", value: d.motherCountry || "N/A", intakeSource: "Family → Mother Country", instructions: "Country of birth." },
        { label: "Father's Full Name", value: d.fatherName || "N/A", intakeSource: "Family → Father", instructions: "Biological father's name at birth." },
        { label: "Father's Country of Birth", value: d.fatherCountry || "N/A", intakeSource: "Family → Father Country", instructions: "Country of birth." },
        { label: "Either Parent a U.S. Citizen?", value: d.parentUSCitizen ? "Yes" : "No", intakeSource: "Family → Parent Citizenship", instructions: "If yes, provide evidence." },
      ],
    },
    {
      partNumber: "Part 9",
      title: "Your Spouse",
      fields: [
        { label: "Spouse's Full Name", value: d.spouseName || "N/A", intakeSource: "Family → Spouse Name", instructions: "Spouse's full legal name." },
        { label: "Spouse's Date of Birth", value: d.spouseDOB || "—", type: "date", intakeSource: "Family → Spouse DOB", instructions: "Date of birth." },
        { label: "Spouse's Country of Birth", value: d.spouseBirth || "—", intakeSource: "Family → Spouse Birth Country", instructions: "Country of birth." },
        { label: "Spouse's A-Number", value: d.spouseANumber || "N/A", intakeSource: "Family → Spouse A-Number", instructions: "If applicable." },
        { label: "Date of Marriage", value: d.marriageDate || "—", type: "date", intakeSource: "Family → Marriage Date", instructions: "Date married." },
        { label: "Place of Marriage", value: d.marriagePlace || "—", intakeSource: "Family → Marriage Place", instructions: "City, State/Country." },
        { label: "Spouse is U.S. Citizen?", value: d.spouseCitizen ? "Yes" : "No", intakeSource: "Family → Spouse Citizen", instructions: "Evidence required." },
        { label: "Spouse Immigration Status", value: d.spouseStatus || "—", intakeSource: "Family → Spouse Status", instructions: "Current status." },
      ],
    },
    {
      partNumber: "Part 10",
      title: "Your Children",
      fields: [
        { label: "Number of Children", value: d.childrenCount || "0", intakeSource: "Family → Children", instructions: "All children, regardless of age/location." },
        { label: "Child's Name (if applicable)", value: d.childName || "N/A", intakeSource: "Family → Child Name", instructions: "Full name." },
        { label: "Child's Date of Birth", value: d.childDOB || "—", type: "date", intakeSource: "Family → Child DOB", instructions: "Date of birth." },
        { label: "Child is U.S. Citizen?", value: d.childCitizen ? "Yes" : "No", intakeSource: "Family → Child Citizen", instructions: "If yes, provide evidence." },
      ],
    },
    {
      partNumber: "Part 11",
      title: "Your Siblings",
      fields: [
        { label: "Number of Siblings", value: d.siblingsCount || "0", intakeSource: "Family → Siblings", instructions: "Include half/step-siblings." },
      ],
    },
    {
      partNumber: "Part 12",
      title: "Marital History",
      fields: [
        { label: "Prior Marriages", value: d.priorMarriages || "0", intakeSource: "Family → Prior Marriages", instructions: "Number of times previously married." },
        { label: "How Prior Marriage Ended", value: d.priorMarriageEnd || "N/A", intakeSource: "Family → Prior Marriage End", instructions: "Divorce, annulment, or death." },
        { label: "Date Prior Marriage Ended", value: d.priorMarriageEndDate || "—", type: "date", intakeSource: "Family → Prior Marriage End Date", instructions: "Date of divorce/annulment/death." },
      ],
    },
    {
      partNumber: "Part 13",
      title: "Previous Immigration History",
      fields: [
        { label: "Date of Last Arrival", value: d.dateOfEntry, type: "date", intakeSource: "Immigration → Last Arrival", instructions: "Most recent U.S. entry date." },
        { label: "Place of Last Arrival", value: d.lastArrivalPlace || "Los Angeles, CA", intakeSource: "Immigration → Arrival Place", instructions: "City and state of entry." },
        { label: "Status at Last Entry", value: d.statusAtEntry || d.immigrationStatus, intakeSource: "Immigration → Status at Entry", instructions: "Visa type or status at entry." },
        { label: "I-94 Number", value: d.i94Number || "N/A", intakeSource: "Immigration → I-94", instructions: "Admission record number." },
        { label: "Status Ever Expired?", value: d.statusExpired ? "Yes" : "No", intakeSource: "Immigration → Status Expired", instructions: "Overstayed authorized period?" },
        { label: "Departure History (5 years)", value: d.departureHistory || "No departures recorded", intakeSource: "Immigration → Departures", instructions: "All trips outside U.S." },
      ],
    },
    {
      partNumber: "Part 14",
      title: "Additional Information",
      fields: [
        { label: "Ever in Removal Proceedings?", value: d.removalProceedings ? "Yes" : "No", intakeSource: "Immigration → Removal", instructions: "Deportation or exclusion proceedings." },
        { label: "Ever Worked Without Authorization?", value: d.unauthorizedWork ? "Yes" : "No", intakeSource: "Immigration → Unauthorized Work", instructions: "Unauthorized employment in U.S." },
        { label: "Ever Arrested or Convicted?", value: d.arrested || d.convicted ? `Yes${d.arrestExplanation ? ": " + d.arrestExplanation : ""}` : "No", intakeSource: "Criminal History", instructions: "All arrests and convictions." },
        { label: "Ever Violated Visa Terms?", value: d.visaViolations ? "Yes" : "No", intakeSource: "Immigration → Visa Violations", instructions: "Violated nonimmigrant status terms." },
        { label: "Ever Received Public Benefits?", value: d.publicBenefits ? "Yes" : "No", intakeSource: "Immigration → Public Benefits", instructions: "Medicaid, SNAP, housing assistance." },
        { label: "Prior Immigration Filings?", value: d.hasPriorFilings ? `Yes: ${d.priorFormType || ""} (${d.priorReceiptNumber || ""})` : "No", intakeSource: "Prior Filings", instructions: "Previously filed petitions/applications." },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Knowledge Base Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="flex items-center gap-2 text-xs text-accent-600 hover:text-accent-700 font-medium"
        >
          <BookOpen size={14} />
          {showInstructions ? "Hide" : "Show"} USCIS Instructions
        </button>
        <button
          onClick={() => setShowEvidence(!showEvidence)}
          className="flex items-center gap-2 text-xs text-accent-600 hover:text-accent-700 font-medium"
        >
          <Shield size={14} />
          {showEvidence ? "Hide" : "Show"} Evidence Requirements
        </button>
        {intakeId && (
          <Badge variant="status" status="COMPLETED">Intake: {intakeId}</Badge>
        )}
      </div>

      {/* Form Header */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-900">Form I-485</h2>
            <p className="text-sm text-slate-500">Application to Register Permanent Residence or Adjust Status</p>
            <p className="text-xs text-slate-400 mt-1">Department of Homeland Security &middot; USCIS &middot; OMB No. 1615-0023</p>
          </div>
        </CardContent>
      </Card>

      {/* Evidence Checklist */}
      {showEvidence && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Shield size={16} className="text-amber-600" />
              Required Evidence Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {EVIDENCE_CHECKLIST.map((item, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50">
                  <input type="checkbox" className="mt-0.5 rounded border-slate-300 accent-accent-600" />
                  <div>
                    <p className="text-sm text-slate-700">{item.item}</p>
                    <p className="text-xs text-slate-400">Parts: {item.uscisParts.join(", ")} — {item.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Sections */}
      {formSections.map((section) => (
        <Card key={section.partNumber}>
          <CardHeader
            className={`border-b border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors ${expandedPart === section.partNumber ? "bg-slate-50" : ""}`}
            onClick={() => setExpandedPart(expandedPart === section.partNumber ? null : section.partNumber)}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-800">
                {section.partNumber} — {section.title}
                <span className="ml-2 text-xs font-normal text-slate-400">{section.fields.length} fields</span>
              </CardTitle>
              {expandedPart === section.partNumber ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </div>
          </CardHeader>
          {expandedPart === section.partNumber && (
            <CardContent className="p-6">
              <div className="space-y-3">
                {section.fields.map((field, fi) => (
                  <div key={fi} className="border border-slate-100 rounded-lg p-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-slate-500">{field.label}</span>
                          <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{field.intakeSource}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-800">{field.value}</p>
                        {showInstructions && (
                          <p className="text-xs text-accent-600 mt-1 flex items-center gap-1">
                            <BookOpen size={10} />
                            {field.instructions}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      {/* Footer */}
      <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3">
        <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-amber-800">Attorney Review Required</p>
          <p className="text-xs text-amber-700">
            This I-485 data packet was prepared from client intake data. All information must be reviewed by a licensed attorney
            before submission to USCIS. Verify all fields against original source documents.
          </p>
        </div>
      </div>
    </div>
  );
}
