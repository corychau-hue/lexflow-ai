"use client";

import { AlertTriangle, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EVIDENCE_CHECKLIST } from "@/lib/i485-knowledge-base";

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
  eduLevel?: string;
  eduSchool?: string;
  eduLocation?: string;
  eduDegree?: string;
  eduFrom?: string;
  eduTo?: string;
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
  arrested?: boolean;
  arrestExplanation?: string;
  convicted?: boolean;
  convictionExplanation?: string;
  hasPriorFilings?: boolean;
  priorFormType?: string;
  priorFilingDate?: string;
  priorReceiptNumber?: string;
}

interface I485FormProps {
  clientData: ClientData;
  intakeId?: string;
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span className={`inline-flex items-center justify-center w-5 h-5 border-2 text-xs font-bold mr-1 ${checked ? "border-slate-700 bg-slate-700 text-white" : "border-slate-400 bg-white"}`}>
      {checked ? <Check size={12} strokeWidth={3} /> : null}
    </span>
  );
}

function FormField({ label, value, isYesNo }: { label: string; value: string; isYesNo?: boolean }) {
  return (
    <div className="form-field">
      <span className="form-label">{label}:</span>
      <span className="form-value">{value || "—"}</span>
    </div>
  );
}

function FormYesNo({ label, value }: { label: string; value: boolean | undefined }) {
  return (
    <div className="form-field">
      <span className="form-label">{label}:</span>
      <span className="flex items-center gap-4">
        <span className="flex items-center text-sm"><Checkbox checked={value === true} /> Yes</span>
        <span className="flex items-center text-sm"><Checkbox checked={value === false || value === undefined} /> No</span>
      </span>
    </div>
  );
}

function FormSection({ part, title, children }: { part: string; title: string; children: React.ReactNode }) {
  return (
    <div className="form-section">
      <div className="form-section-header">
        <span className="form-section-part">{part}</span>
        <span className="form-section-title">{title}</span>
      </div>
      <div className="form-section-body">
        {children}
      </div>
    </div>
  );
}

export function I485Form({ clientData, intakeId }: I485FormProps) {
  const d = clientData;

  return (
    <div>

      {/* Official USCIS Form Header */}
      <div className="form-header">
        {intakeId && (
          <div className="no-print flex justify-end mb-2">
            <Badge variant="status" status="COMPLETED">Intake: {intakeId}</Badge>
          </div>
        )}
        <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
          <p className="text-xs tracking-widest text-slate-600 mb-1">OMB No. 1615-0023</p>
          <p className="text-sm font-semibold text-slate-800">Department of Homeland Security</p>
          <p className="text-sm text-slate-600">U.S. Citizenship and Immigration Services</p>
          <h1 className="form-title">Form I-485</h1>
          <p className="text-sm font-medium text-slate-700">Application to Register Permanent Residence<br />or Adjust Status</p>
          <p className="text-[10px] text-slate-400 mt-2">Expires 04/30/2027. See current forms page at www.uscis.gov/forms.</p>
        </div>

        {/* Attorney Review Banner */}
        <div className="no-print bg-amber-50 border border-amber-300 rounded p-3 mb-6 flex items-start gap-2">
          <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-800">Attorney Review Required</p>
            <p className="text-[11px] text-amber-700">This form was auto-populated from client intake data. All fields must be verified against original documents before submission to USCIS.</p>
          </div>
        </div>
      </div>

      {/* ===== PART 1: Information About You ===== */}
      <FormSection part="Part 1" title="Information About You">
        <p className="text-[11px] text-slate-500 mb-3 italic">Your full legal name, biographic details, and identification numbers.</p>
        <FormField label="1. Your Full Legal Name (Last, First, Middle)" value={d.fullName} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <FormField label="2. Date of Birth" value={d.dateOfBirth} />
          <FormField label="3. Country of Birth" value={d.countryOfBirth} />
        </div>
        <FormField label="4. Country of Citizenship" value={d.citizenship} />
        <FormField label="5. U.S. Social Security Number" value={d.ssn || "N/A"} />
        <FormField label="6. A-Number (USCIS Number)" value={d.aNumber} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <FormField label="7. Gender" value={d.gender || "—"} />
          <FormField label="8. Marital Status" value={d.maritalStatus || "—"} />
        </div>
        <FormField label="9. Other Names Used (Maiden, Aliases)" value={d.otherNames || "N/A"} />
        <FormField label="10. Height / Weight" value={`${d.height || "—"} / ${d.weight || "—"}`} />
      </FormSection>

      {/* ===== PART 2: Application Type ===== */}
      <FormSection part="Part 2" title="Application Type">
        <FormField label="1. Basis for Adjustment" value={d.petitionerRelationship || "Spouse of U.S. Citizen"} />
        <FormYesNo label="2. Applying for a Waiver of Inadmissibility?" value={d.waiverNeeded} />
      </FormSection>

      {/* ===== PART 3: Address & Contact Information ===== */}
      <FormSection part="Part 3" title="Address & Contact Information">
        <FormField label="1. Street Address" value={d.address} />
        <div className="grid grid-cols-3 gap-0">
          <FormField label="2. City" value={d.city} />
          <FormField label="3. State" value={d.state} />
          <FormField label="4. ZIP Code" value={d.zip} />
        </div>
        <FormField label="5. Email Address" value={d.email || "N/A"} />
        <FormField label="6. Phone Number" value={d.phone || "N/A"} />
        <FormYesNo label="7. Authorize SMS/Text Updates?" value={d.smsConsent} />
      </FormSection>

      {/* ===== PART 4: Disability Accommodations ===== */}
      <FormSection part="Part 4" title="Disability Accommodations">
        <FormYesNo label="1. Do you need a disability accommodation?" value={d.needsAccommodation} />
      </FormSection>

      {/* ===== PART 5: Employment History (Last 5 Years) ===== */}
      <FormSection part="Part 5" title="Employment History (Last 5 Years)">
        <p className="text-[11px] text-slate-500 mb-3 italic">List your employment history for the last 5 years, starting with your current or most recent employer.</p>
        <FormField label="1. Current/Most Recent Employer" value={d.employer || "N/A"} />
        <FormField label="2. Job Title" value={d.jobTitle || "N/A"} />
        <FormField label="3. Start Date" value={d.empStart || "N/A"} />
        <FormField label="4. Employer Street Address" value={d.empAddress || "N/A"} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <FormField label="5. Employer City" value={d.empCity || "—"} />
          <FormField label="6. Employer State" value={d.empState || "—"} />
        </div>
        <FormField label="7. Job Duties" value={d.empDuties || "N/A"} />
        <div className="border-t border-slate-200 my-3" />
        <FormField label="8. Previous Employer" value={d.prevEmployer || "N/A"} />
        <FormField label="9. Previous Job Title" value={d.prevTitle || "N/A"} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <FormField label="10. Previous Start Date" value={d.prevStart || "—"} />
          <FormField label="11. Previous End Date" value={d.prevEnd || "—"} />
        </div>
      </FormSection>

      {/* ===== PART 6: Education ===== */}
      <FormSection part="Part 6" title="Education">
        <FormField label="1. Highest Level of Education" value={d.eduLevel || "—"} />
        <FormField label="2. School Name" value={d.eduSchool || "N/A"} />
        <FormField label="3. School Location" value={d.eduLocation || "N/A"} />
        <FormField label="4. Degree Earned" value={d.eduDegree || "N/A"} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <FormField label="5. Attended From" value={d.eduFrom || "—"} />
          <FormField label="6. Attended To" value={d.eduTo || "—"} />
        </div>
      </FormSection>

      {/* ===== PART 7: Additional Information About You ===== */}
      <FormSection part="Part 7" title="Additional Information About You">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          <FormField label="1. Height" value={d.height || "—"} />
          <FormField label="2. Weight (lbs)" value={d.weight || "—"} />
          <FormField label="3. Hair Color" value={d.hairColor || "—"} />
          <FormField label="4. Eye Color" value={d.eyeColor || "—"} />
        </div>
      </FormSection>

      {/* ===== PART 8: Your Parents ===== */}
      <FormSection part="Part 8" title="Your Parents">
        <FormField label="1. Mother's Full Name" value={d.motherName || "N/A"} />
        <FormField label="2. Mother's Country of Birth" value={d.motherCountry || "N/A"} />
        <FormField label="3. Father's Full Name" value={d.fatherName || "N/A"} />
        <FormField label="4. Father's Country of Birth" value={d.fatherCountry || "N/A"} />
        <FormYesNo label="5. Either parent a U.S. citizen?" value={d.parentUSCitizen} />
      </FormSection>

      {/* ===== PART 9: Your Spouse ===== */}
      <FormSection part="Part 9" title="Your Spouse">
        <FormField label="1. Spouse's Full Name" value={d.spouseName || "N/A"} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <FormField label="2. Spouse's Date of Birth" value={d.spouseDOB || "—"} />
          <FormField label="3. Spouse's Country of Birth" value={d.spouseBirth || "—"} />
        </div>
        <FormField label="4. Spouse's A-Number" value={d.spouseANumber || "N/A"} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <FormField label="5. Date of Marriage" value={d.marriageDate || "—"} />
          <FormField label="6. Place of Marriage" value={d.marriagePlace || "—"} />
        </div>
        <FormYesNo label="7. Spouse is a U.S. citizen?" value={d.spouseCitizen} />
        <FormField label="8. Spouse's Immigration Status" value={d.spouseStatus || "—"} />
      </FormSection>

      {/* ===== PART 10: Your Children ===== */}
      <FormSection part="Part 10" title="Your Children">
        <FormField label="1. Number of Children" value={d.childrenCount || "0"} />
        {d.childrenCount && d.childrenCount !== "0" && d.childrenCount !== "" && (
          <>
            <FormField label="2. Child's Full Name" value={d.childName || "N/A"} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <FormField label="3. Child's Date of Birth" value={d.childDOB || "—"} />
              <FormYesNo label="4. Child is a U.S. citizen?" value={d.childCitizen} />
            </div>
          </>
        )}
        {(!d.childrenCount || d.childrenCount === "0" || d.childrenCount === "") && (
          <p className="text-xs text-slate-400 italic mt-1">No children listed.</p>
        )}
      </FormSection>

      {/* ===== PART 11: Your Siblings ===== */}
      <FormSection part="Part 11" title="Your Siblings">
        <FormField label="1. Number of Siblings" value={d.siblingsCount || "0"} />
      </FormSection>

      {/* ===== PART 12: Marital History ===== */}
      <FormSection part="Part 12" title="Your Marital History">
        <FormField label="1. Number of Prior Marriages" value={d.priorMarriages || "0"} />
        {d.priorMarriages && d.priorMarriages !== "0" && (
          <>
            <FormField label="2. How prior marriage ended" value={d.priorMarriageEnd || "—"} />
            <FormField label="3. Date prior marriage ended" value={d.priorMarriageEndDate || "—"} />
          </>
        )}
      </FormSection>

      {/* ===== PART 13: Previous Immigration History ===== */}
      <FormSection part="Part 13" title="Your Previous Immigration History">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <FormField label="1. Date of Last Arrival" value={d.dateOfEntry} />
          <FormField label="2. Place of Last Arrival" value={d.lastArrivalPlace || "—"} />
        </div>
        <FormField label="3. Immigration Status at Last Arrival" value={d.statusAtEntry || d.immigrationStatus} />
        <FormField label="4. I-94 Number" value={d.i94Number || "N/A"} />
        <FormYesNo label="5. Has your status ever expired?" value={d.statusExpired} />
        <FormField label="6. Departure History (last 5 years)" value={d.departureHistory || "No departures recorded"} />
      </FormSection>

      {/* ===== PART 14: Additional Information ===== */}
      <FormSection part="Part 14" title="Additional Application Information">
        <p className="text-[11px] text-slate-500 mb-3 italic">Answer each question truthfully and completely. Your answers may affect your eligibility.</p>
        <FormYesNo label="1. Ever in removal/deportation proceedings?" value={d.removalProceedings} />
        <FormYesNo label="2. Ever worked without authorization?" value={d.unauthorizedWork} />
        <div className="border-l-2 border-amber-300 pl-3 my-2">
          <FormYesNo label="3. Ever arrested or convicted of a crime?" value={d.arrested || d.convicted} />
          {(d.arrested || d.convicted) && (
            <p className="text-xs text-slate-600 mt-1 ml-10">
              {d.arrestExplanation && `Arrest explanation: ${d.arrestExplanation}`}
              {d.arrestExplanation && d.convictionExplanation && " | "}
              {d.convictionExplanation && `Conviction explanation: ${d.convictionExplanation}`}
            </p>
          )}
        </div>
        <FormYesNo label="4. Ever violated terms of nonimmigrant status?" value={d.visaViolations} />
        <FormYesNo label="5. Ever received public benefits?" value={d.publicBenefits} />
        <FormYesNo label="6. Ever served in U.S. military?" value={d.militaryService} />
        <FormYesNo label="7. Previously filed any immigration application?" value={d.hasPriorFilings} />
        {d.hasPriorFilings && (
          <div className="ml-10 mt-1">
            <FormField label="Prior Form Type" value={d.priorFormType || "N/A"} />
            <FormField label="Receipt Number" value={d.priorReceiptNumber || "N/A"} />
          </div>
        )}
      </FormSection>

      {/* Signature Area */}
      <div className="form-section mt-8">
        <div className="form-section-header">
          <span className="form-section-part">Signature</span>
          <span className="form-section-title">Applicant Certification and Signature</span>
        </div>
        <div className="form-section-body">
          <p className="text-[11px] text-slate-500 mb-4">
            I certify, under penalty of perjury, that all information provided in this application is true and correct.
            I have reviewed all parts of this application and confirm the information is complete.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-field">
              <span className="form-label">Signature of Applicant:</span>
              <div className="border-b border-slate-300 h-8 mt-1" />
            </div>
            <div className="form-field">
              <span className="form-label">Date:</span>
              <div className="border-b border-slate-300 h-8 mt-1" />
            </div>
            <div className="form-field">
              <span className="form-label">Phone Number:</span>
              <span className="form-value">{d.phone || "—"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Checklist */}
      <div className="no-print form-section mt-8">
        <div className="form-section-header">
          <span className="form-section-title">Required Evidence Checklist</span>
        </div>
        <div className="form-section-body">
          <p className="text-[11px] text-slate-500 mb-3">Use this checklist to verify all supporting documents are gathered before filing.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {EVIDENCE_CHECKLIST.map((item, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded border border-slate-200">
                <input type="checkbox" className="mt-0.5 rounded border-slate-300 accent-blue-600" />
                <div>
                  <p className="text-sm text-slate-700">{item.item}</p>
                  <p className="text-xs text-slate-400">Parts: {item.uscisParts.join(", ")} — {item.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="no-print mt-6 p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3">
        <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">Attorney Review Required — Not for Filing</p>
          <p className="text-xs text-amber-700">
            This I-485 data packet was prepared from client intake data for attorney/staff review only.
            All information must be verified against original source documents. This form does NOT constitute
            electronic filing with USCIS. Do not submit without attorney approval.
          </p>
        </div>
      </div>
    </div>
  );
}
