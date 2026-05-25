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
  address: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  phone: string;
  gender?: string;
  maritalStatus?: string;
  otherNames?: string;
  spouseName?: string;
  spouseDOB?: string;
  spouseBirth?: string;
  motherName?: string;
  motherCountry?: string;
  fatherName?: string;
  fatherCountry?: string;
  childrenCount?: string;
  employer?: string;
  jobTitle?: string;
  eduLevel?: string;
  departureHistory?: string;
  hasPriorFilings?: boolean;
  priorReceiptNumber?: string;
}

interface DS260FormProps {
  clientData: ClientData;
  intakeId?: string;
}

export function DS260Form({ clientData, intakeId }: DS260FormProps) {
  const d = clientData;

  return (
    <USCISFormShell
      formNumber="DS-260"
      title="Immigrant Visa Application"
      subtitle=""
      ombNumber="1405-0164"
      expDate="12/31/2027"
      intakeId={intakeId}
    >
      <FormSection part="Part 1" title="Personal Information">
        <FormField
          label="1. Full Legal Name"
          value={d.fullName}
          legalReference="INA § 222"
          legalTitle="Application for immigrant visas"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <FormField label="2. Date of Birth" value={d.dateOfBirth} />
          <FormField label="3. Country of Birth" value={d.countryOfBirth} />
        </div>
        <FormField label="4. Country of Citizenship" value={d.citizenship} />
        <div className="grid grid-cols-2 gap-0">
          <FormField label="5. Gender" value={d.gender || "—"} />
          <FormField label="6. Marital Status" value={d.maritalStatus || "—"} />
        </div>
        <FormField label="7. Other Names Used" value={d.otherNames || "N/A"} />
        <FormField label="8. A-Number" value={d.aNumber} />
      </FormSection>

      <FormSection part="Part 2" title="Address & Contact">
        <FormField label="1. Current Street Address" value={d.address} />
        <div className="grid grid-cols-3 gap-0">
          <FormField label="2. City" value={d.city} />
          <FormField label="3. State/Province" value={d.state} />
          <FormField label="4. ZIP/Postal Code" value={d.zip} />
        </div>
        <FormField label="5. Phone Number" value={d.phone} />
        <FormField label="6. Email Address" value={d.email || "N/A"} />
      </FormSection>

      <FormSection part="Part 3" title="Family Information">
        <FormField label="1. Spouse's Full Name" value={d.spouseName || "N/A"} />
        <FormField label="2. Spouse's Date of Birth" value={d.spouseDOB || "—"} />
        <FormField label="3. Spouse's Citizenship" value={d.spouseBirth || "—"} />
        <FormField label="4. Number of Children" value={d.childrenCount || "0"} />
        <FormField label="5. Mother's Full Name" value={d.motherName || "N/A"} />
        <FormField label="6. Father's Full Name" value={d.fatherName || "N/A"} />
      </FormSection>

      <FormSection part="Part 4" title="Employment & Education">
        <FormField label="1. Current Employer" value={d.employer || "N/A"} />
        <FormField label="2. Job Title" value={d.jobTitle || "N/A"} />
        <FormField label="3. Highest Level of Education" value={d.eduLevel || "—"} />
      </FormSection>

      <FormSection part="Part 5" title="Travel & Immigration History">
        <FormField label="1. Travel History (last 5 years)" value={d.departureHistory || "No travel recorded"} />
        <FormYesNo label="2. Previously filed U.S. immigration applications?" value={d.hasPriorFilings} />
        {d.hasPriorFilings && (
          <FormField label="3. Prior Receipt Number" value={d.priorReceiptNumber || "N/A"} />
        )}
      </FormSection>
    </USCISFormShell>
  );
}
