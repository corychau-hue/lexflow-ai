"use client";

import {
  FormField,
  FormSection,
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
  otherNames?: string;
  spouseName?: string;
  spouseDOB?: string;
  spouseBirth?: string;
  spouseANumber?: string;
  motherName?: string;
  motherCountry?: string;
  fatherName?: string;
  fatherCountry?: string;
  priorMarriages?: string;
  priorMarriageEnd?: string;
  priorMarriageEndDate?: string;
  employer?: string;
  jobTitle?: string;
  eduLevel?: string;
}

interface I130AFormProps {
  clientData: ClientData;
  intakeId?: string;
}

export function I130AForm({ clientData, intakeId }: I130AFormProps) {
  const d = clientData;

  return (
    <USCISFormShell
      formNumber="Form I-130A"
      title="Supplemental Information for Spouse Beneficiary"
      subtitle=""
      ombNumber="1615-0012"
      expDate="01/31/2027"
      intakeId={intakeId}
    >
      <FormSection part="Part 1" title="Information About Spouse Beneficiary">
        <FormField
          label="1. Beneficiary's Full Legal Name"
          value={d.spouseName || d.fullName}
          legalReference="INA § 204(a)(1)(A)(i)"
          legalTitle="Petition by spouse"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <FormField label="2. Date of Birth" value={d.spouseDOB || "—"} />
          <FormField label="3. Country of Birth" value={d.spouseBirth || "—"} />
        </div>
        <FormField label="4. Gender" value={d.gender || "—"} />
        <FormField label="5. A-Number" value={d.spouseANumber || "N/A"} />
        <FormField label="6. Street Address" value={d.address} />
        <div className="grid grid-cols-3 gap-0">
          <FormField label="7. City" value={d.city} />
          <FormField label="8. State" value={d.state} />
          <FormField label="9. ZIP Code" value={d.zip} />
        </div>
        <FormField label="10. Phone Number" value={d.phone} />
        <FormField label="11. Email Address" value={d.email || "N/A"} />
        <FormField label="12. Other Names Used" value={d.otherNames || "N/A"} />
      </FormSection>

      <FormSection part="Part 2" title="Beneficiary's Parents">
        <FormField label="1. Mother's Full Name" value={d.motherName || "N/A"} />
        <FormField label="2. Mother's Country of Birth" value={d.motherCountry || "—"} />
        <FormField label="3. Father's Full Name" value={d.fatherName || "N/A"} />
        <FormField label="4. Father's Country of Birth" value={d.fatherCountry || "—"} />
      </FormSection>

      <FormSection part="Part 3" title="Beneficiary's Marital History">
        <FormField label="1. Number of Prior Marriages" value={d.priorMarriages || "0"} />
        <FormField label="2. How Prior Marriage Ended" value={d.priorMarriageEnd || "—"} />
        <FormField label="3. Date Prior Marriage Ended" value={d.priorMarriageEndDate || "—"} />
      </FormSection>

      <FormSection part="Part 4" title="Beneficiary's Employment & Education">
        <FormField label="1. Current Employer" value={d.employer || "N/A"} />
        <FormField label="2. Job Title" value={d.jobTitle || "N/A"} />
        <FormField label="3. Highest Level of Education" value={d.eduLevel || "—"} />
      </FormSection>
    </USCISFormShell>
  );
}
