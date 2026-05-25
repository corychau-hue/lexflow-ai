"use client";

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
  spouseName?: string;
  spouseDOB?: string;
  spouseCitizen?: boolean;
  marriageDate?: string;
  priorMarriages?: string;
  childrenCount?: string;
  employer?: string;
  jobTitle?: string;
  empStart?: string;
  eduLevel?: string;
  arrested?: boolean;
  convicted?: boolean;
  militaryService?: boolean;
  publicBenefits?: boolean;
  departureHistory?: string;
  dateOfEntry?: string;
  lastArrivalPlace?: string;
}

interface N400FormProps {
  clientData: ClientData;
  intakeId?: string;
}

export function N400Form({ clientData, intakeId }: N400FormProps) {
  const d = clientData;

  return (
    <USCISFormShell
      formNumber="Form N-400"
      title="Application for Naturalization"
      subtitle=""
      ombNumber="1615-0052"
      expDate="03/31/2028"
      intakeId={intakeId}
    >
      <FormSection part="Part 1" title="Information About You (Applicant)">
        <FormField
          label="1. Full Legal Name"
          value={d.fullName}
          legalReference="INA § 310"
          legalTitle="Naturalization authority"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <FormField label="2. Date of Birth" value={d.dateOfBirth} />
          <FormField label="3. Country of Birth" value={d.countryOfBirth} />
        </div>
        <FormField label="4. Country of Citizenship" value={d.citizenship} />
        <FormField label="5. A-Number (USCIS Number)" value={d.aNumber} />
        <FormField label="6. Social Security Number" value={d.ssn || "N/A"} />
        <div className="grid grid-cols-2 gap-0">
          <FormField label="7. Gender" value={d.gender || "—"} />
          <FormField label="8. Marital Status" value={d.maritalStatus || "—"} />
        </div>
        <FormField label="9. Other Names Used" value={d.otherNames || "N/A"} />
      </FormSection>

      <FormSection part="Part 2" title="Physical Presence & Residency">
        <FormField
          label="1. Years as a Lawful Permanent Resident"
          value={d.immigrationStatus || "—"}
          legalReference="INA § 316(a)"
          legalTitle="Residency requirements for naturalization"
        />
        <FormField label="2. Date of Entry as Permanent Resident" value={d.dateOfEntry || "—"} />
        <FormField label="3. Place of Entry" value={d.lastArrivalPlace || "—"} />
        <FormField label="4. Departures from U.S. (last 5 years)" value={d.departureHistory || "No departures recorded"} />
        <FormField label="5. Street Address" value={d.address} />
        <div className="grid grid-cols-3 gap-0">
          <FormField label="6. City" value={d.city} />
          <FormField label="7. State" value={d.state} />
          <FormField label="8. ZIP Code" value={d.zip} />
        </div>
      </FormSection>

      <FormSection part="Part 3" title="Family Information">
        <FormField label="1. Spouse's Full Name" value={d.spouseName || "N/A"} />
        <FormField label="2. Spouse's Date of Birth" value={d.spouseDOB || "—"} />
        <FormYesNo label="3. Is spouse a U.S. citizen?" value={d.spouseCitizen} />
        <FormField label="4. Date of Marriage" value={d.marriageDate || "—"} />
        <FormField label="5. Number of Prior Marriages" value={d.priorMarriages || "0"} />
        <FormField label="6. Total Number of Children" value={d.childrenCount || "0"} />
      </FormSection>

      <FormSection part="Part 4" title="Employment & Education">
        <FormField label="1. Current Employer" value={d.employer || "N/A"} />
        <FormField label="2. Job Title" value={d.jobTitle || "N/A"} />
        <FormField label="3. Start Date" value={d.empStart || "—"} />
        <FormField label="4. Highest Level of Education" value={d.eduLevel || "—"} />
      </FormSection>

      <FormSection part="Part 5" title="Good Moral Character">
        <FormYesNo
          label="1. Ever arrested or detained?"
          value={d.arrested}
          legalReference="INA § 316(a)(3)"
          legalTitle="Good moral character requirement"
        />
        <FormYesNo label="2. Ever convicted of a crime?" value={d.convicted} />
        <FormYesNo
          label="3. Ever served in U.S. military?"
          value={d.militaryService}
          legalReference="INA § 328"
          legalTitle="Naturalization through military service"
        />
        <FormYesNo label="4. Ever received public benefits?" value={d.publicBenefits} />
      </FormSection>

      <FormSection part="Part 6" title="Oath Requirements">
        <FormYesNo
          label="1. Do you support the U.S. Constitution?"
          value={true}
          legalReference="INA § 337"
          legalTitle="Oath of renunciation and allegiance"
        />
      </FormSection>
    </USCISFormShell>
  );
}
