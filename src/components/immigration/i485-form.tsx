"use client";

import { EVIDENCE_CHECKLIST } from "@/lib/i485-knowledge-base";
import {
  FormField,
  FormSection,
  FormYesNo,
  USCISFormShell,
} from "@/components/immigration/uscis-form-elements";

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

/* Helper: parse fullName "Last, First Middle" into parts */
function parseName(fullName: string) {
  const parts = fullName.split(",").map((s) => s.trim());
  if (parts.length >= 2) {
    const last = parts[0];
    const rest = parts.slice(1).join(" ").split(/\s+/);
    const first = rest[0] || "";
    const middle = rest.slice(1).join(" ") || "";
    return { last, first, middle };
  }
  const words = fullName.split(/\s+/);
  return { last: words[words.length - 1] || "", first: words[0] || "", middle: words.slice(1, -1).join(" ") || "" };
}

export function I485Form({ clientData, intakeId }: I485FormProps) {
  const d = clientData;
  const name = parseName(d.fullName);

  return (
    <USCISFormShell
      formNumber="Form I-485"
      title="Application to Register Permanent Residence"
      subtitle="or Adjust Status"
      ombNumber="1615-0023"
      expDate="04/30/2027"
      intakeId={intakeId}
    >
      {/* ======================================================================
          PART 1 — Information About You
          ====================================================================== */}
      <FormSection part="Part 1" title="Information About You">
        <p className="form-instruction">
          Provide your full legal name as it appears on your passport or government-issued ID.
        </p>
        <FormField label="1.a. Family Name (Last Name)" value={name.last} />
        <FormField label="1.b. Given Name (First Name)" value={name.first} />
        <FormField label="1.c. Middle Name" value={name.middle} />
        <FormField label="2. Other Names Used (aliases, maiden name)" value={d.otherNames || "N/A"} />
        <FormField label="3. Date of Birth (mm/dd/yyyy)" value={d.dateOfBirth} />
        <FormField label="4. Country of Birth" value={d.countryOfBirth} />
        <FormField label="5. Country of Citizenship" value={d.citizenship} />
        <FormField label="6. Gender" value={d.gender || "—"} />
        <FormField label="7. A-Number (Alien Registration Number)" value={d.aNumber} />
        <FormField label="8. U.S. Social Security Number" value={d.ssn || "N/A"} />
      </FormSection>

      {/* ======================================================================
          PART 2 — Immigration Information
          ====================================================================== */}
      <FormSection part="Part 2" title="Immigration Information">
        <p className="form-instruction">
          Provide your current immigration status and most recent arrival information.
        </p>
        <FormField label="1. Current Immigration Status" value={d.immigrationStatus} />
        <FormField label="2. Date of Last Arrival in the U.S." value={d.dateOfEntry} />
        <FormField label="3. I-94 Arrival-Departure Record Number" value={d.i94Number || "N/A"} />
        <FormField label="4. Status at Last Arrival" value={d.statusAtEntry || d.immigrationStatus} />
        <FormField label="5. Place of Last Arrival" value={d.lastArrivalPlace || "—"} />
        <FormYesNo label="6. Has your authorized stay ever expired?" value={d.statusExpired} />
        <FormField label="7. Departures from U.S. (last 5 years)" value={d.departureHistory || "No departures recorded"} />
      </FormSection>

      {/* ======================================================================
          PART 3 — Basis for Filing (Eligibility Category)
          ====================================================================== */}
      <FormSection part="Part 3" title="Basis for Filing (Eligibility Category)">
        <p className="form-instruction">
          Select the category under which you are applying for adjustment of status.
        </p>
        <FormField label="1. Basis for Adjustment" value={d.petitionerRelationship || "Spouse of U.S. Citizen"} />
        <FormYesNo label="2. Are you also applying for a waiver of inadmissibility?" value={d.waiverNeeded} />
        <FormYesNo label="3. Have you previously filed any immigration application?" value={d.hasPriorFilings} />
        {d.hasPriorFilings && (
          <div className="ml-8 mt-1">
            <FormField label="Prior Form Type" value={d.priorFormType || "N/A"} />
            <FormField label="Prior Receipt Number" value={d.priorReceiptNumber || "N/A"} />
            <FormField label="Prior Filing Date" value={d.priorFilingDate || "N/A"} />
          </div>
        )}
      </FormSection>

      {/* ======================================================================
          PART 4 — Biographic Information
          ====================================================================== */}
      <FormSection part="Part 4" title="Biographic Information">
        <p className="form-instruction">
          Provide the following biographic details for identification purposes.
        </p>
        <div className="form-grid-row">
          <FormField label="1. Height" value={d.height || "—"} />
          <FormField label="2. Weight (lbs)" value={d.weight || "—"} />
        </div>
        <div className="form-grid-row">
          <FormField label="3. Hair Color" value={d.hairColor || "—"} />
          <FormField label="4. Eye Color" value={d.eyeColor || "—"} />
        </div>
      </FormSection>

      {/* ======================================================================
          PART 5 — Address, Contact & Employment History
          ====================================================================== */}
      <FormSection part="Part 5" title="Address, Contact &amp; Employment History">
        <p className="form-instruction">
          Your current residential address, contact information, and employment history for the last 5 years.
        </p>
        <FormField label="1. Street Address" value={d.address} />
        <div className="form-grid-row">
          <FormField label="2. City" value={d.city} />
          <FormField label="3. State" value={d.state} />
          <FormField label="4. ZIP Code" value={d.zip} />
        </div>
        <FormField label="5. Email Address" value={d.email || "N/A"} />
        <FormField label="6. Phone Number" value={d.phone || "N/A"} />
        <FormYesNo label="7. Authorize SMS/text message updates?" value={d.smsConsent} />
        <FormYesNo label="8. Need a disability accommodation?" value={d.needsAccommodation} />

        <div className="border-t border-black mt-3 pt-3" />
        <p className="form-instruction">Employment History (last 5 years — start with current or most recent):</p>
        <FormField label="9. Current/Most Recent Employer" value={d.employer || "N/A"} />
        <FormField label="10. Job Title" value={d.jobTitle || "N/A"} />
        <FormField label="11. Start Date" value={d.empStart || "N/A"} />
        <FormField label="12. Employer Address" value={d.empAddress || "N/A"} />
        <div className="form-grid-row">
          <FormField label="13. Employer City" value={d.empCity || "—"} />
          <FormField label="14. Employer State" value={d.empState || "—"} />
        </div>
        <FormField label="15. Job Duties" value={d.empDuties || "N/A"} />
        <FormField label="16. Previous Employer" value={d.prevEmployer || "N/A"} />
        <FormField label="17. Previous Job Title" value={d.prevTitle || "N/A"} />
        <div className="form-grid-row">
          <FormField label="18. Previous Start Date" value={d.prevStart || "—"} />
          <FormField label="19. Previous End Date" value={d.prevEnd || "—"} />
        </div>
      </FormSection>

      {/* ======================================================================
          PART 6 — Parents & Children
          ====================================================================== */}
      <FormSection part="Part 6" title="Parents &amp; Children">
        <p className="form-instruction">
          Provide information about your biological or legal parents and all of your children.
        </p>
        <FormField label="1. Mother's Full Name" value={d.motherName || "N/A"} />
        <FormField label="2. Mother's Country of Birth" value={d.motherCountry || "N/A"} />
        <FormField label="3. Father's Full Name" value={d.fatherName || "N/A"} />
        <FormField label="4. Father's Country of Birth" value={d.fatherCountry || "N/A"} />
        <FormYesNo label="5. Is either parent a U.S. citizen?" value={d.parentUSCitizen} />
        <div className="border-t border-black mt-3 pt-3" />
        <FormField label="6. Number of Children" value={d.childrenCount || "0"} />
        {d.childrenCount && d.childrenCount !== "0" && d.childrenCount !== "" && (
          <>
            <FormField label="7. Child's Full Name" value={d.childName || "N/A"} />
            <div className="form-grid-row">
              <FormField label="8. Child's Date of Birth" value={d.childDOB || "—"} />
              <FormYesNo label="9. Child is a U.S. citizen?" value={d.childCitizen} />
            </div>
          </>
        )}
      </FormSection>

      {/* ======================================================================
          PART 7 — Admissibility Information
          ====================================================================== */}
      <FormSection part="Part 7" title="Admissibility Information (Yes/No Questions)">
        <p className="form-instruction">
          Answer each question truthfully. Your answers may affect your eligibility for adjustment of status.
        </p>
        <FormYesNo label="1. Have you EVER been in removal, deportation, or exclusion proceedings?" value={d.removalProceedings} />
        <FormYesNo label="2. Have you EVER worked without authorization in the U.S.?" value={d.unauthorizedWork} />
        <FormYesNo label="3. Have you EVER violated the terms of your nonimmigrant status?" value={d.visaViolations} />
        <FormYesNo label="4. Have you EVER received public benefits (Medicaid, SNAP, etc.)?" value={d.publicBenefits} />
        <FormYesNo label="5. Have you EVER served in the U.S. military?" value={d.militaryService} />
        <FormYesNo label="6. Have you EVER been arrested, cited, or detained?" value={d.arrested} />
        {d.arrested && d.arrestExplanation && (
          <div className="ml-8 mt-1 mb-2">
            <FormField label="Explain arrest:" value={d.arrestExplanation} />
          </div>
        )}
        <FormYesNo label="7. Have you EVER been convicted of a crime?" value={d.convicted} />
        {d.convicted && d.convictionExplanation && (
          <div className="ml-8 mt-1 mb-2">
            <FormField label="Explain conviction:" value={d.convictionExplanation} />
          </div>
        )}
      </FormSection>

      {/* ======================================================================
          PART 8 — Additional Information (Marital History, Education)
          ====================================================================== */}
      <FormSection part="Part 8" title="Additional Information">
        <p className="form-instruction">Marital history, education, and family information for application processing.</p>

        <p className="text-[9px] font-semibold text-slate-700 mb-1" style={{ fontFamily: "system-ui, sans-serif" }}>
          Marital History
        </p>
        <FormField label="1. Current Marital Status" value={d.maritalStatus || "—"} />
        <FormField label="2. Spouse's Full Name" value={d.spouseName || "N/A"} />
        <div className="form-grid-row">
          <FormField label="3. Spouse's Date of Birth" value={d.spouseDOB || "—"} />
          <FormField label="4. Spouse's Country of Birth" value={d.spouseBirth || "—"} />
        </div>
        <FormField label="5. Spouse's A-Number" value={d.spouseANumber || "N/A"} />
        <FormYesNo label="6. Is your spouse a U.S. citizen?" value={d.spouseCitizen} />
        <FormField label="7. Spouse's Immigration Status" value={d.spouseStatus || "—"} />
        <div className="form-grid-row">
          <FormField label="8. Date of Marriage" value={d.marriageDate || "—"} />
          <FormField label="9. Place of Marriage" value={d.marriagePlace || "—"} />
        </div>
        <FormField label="10. Number of Prior Marriages" value={d.priorMarriages || "0"} />
        {d.priorMarriages && d.priorMarriages !== "0" && d.priorMarriages !== "" && (
          <>
            <FormField label="11. How prior marriage ended" value={d.priorMarriageEnd || "—"} />
            <FormField label="12. Date prior marriage ended" value={d.priorMarriageEndDate || "—"} />
          </>
        )}

        <div className="border-t border-black mt-3 pt-3" />
        <p className="text-[9px] font-semibold text-slate-700 mb-1" style={{ fontFamily: "system-ui, sans-serif" }}>
          Education
        </p>
        <FormField label="13. Highest Level of Education" value={d.eduLevel || "—"} />
        <FormField label="14. School Name" value={d.eduSchool || "N/A"} />
        <FormField label="15. School Location" value={d.eduLocation || "N/A"} />
        <FormField label="16. Degree Earned" value={d.eduDegree || "N/A"} />
        <div className="form-grid-row">
          <FormField label="17. Attended From" value={d.eduFrom || "—"} />
          <FormField label="18. Attended To" value={d.eduTo || "—"} />
        </div>
      </FormSection>

      {/* Evidence Checklist */}
      <div className="no-print form-section mt-6">
        <div className="form-section-header">
          <span className="form-section-title">Required Evidence Checklist</span>
        </div>
        <div className="form-section-body">
          <p className="form-instruction">
            Use this checklist to verify all supporting documents are gathered before filing.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {EVIDENCE_CHECKLIST.map((item, i) => (
              <div key={i} className="flex items-start gap-2 p-2 border border-slate-300">
                <input type="checkbox" className="mt-0.5 accent-blue-600" />
                <div>
                  <p className="text-[10px] font-medium text-slate-700">{item.item}</p>
                  <p className="text-[8px] text-slate-500">
                    Parts: {item.uscisParts.join(", ")} &mdash; {item.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </USCISFormShell>
  );
}
