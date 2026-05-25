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
  ssn?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  phone: string;
  petitionerRelationship?: string;
  spouseName?: string;
  maritalStatus?: string;
  childrenCount?: string;
  employer?: string;
  jobTitle?: string;
  empStart?: string;
  empAddress?: string;
  empCity?: string;
  empState?: string;
}

interface I864FormProps {
  clientData: ClientData;
  intakeId?: string;
}

export function I864Form({ clientData, intakeId }: I864FormProps) {
  const d = clientData;

  return (
    <USCISFormShell
      formNumber="Form I-864"
      title="Affidavit of Support Under Section 213A of the INA"
      subtitle=""
      ombNumber="1615-0075"
      expDate="05/31/2027"
      intakeId={intakeId}
    >
      <FormSection part="Part 1" title="Sponsor Information">
        <FormField
          label="1. Sponsor's Full Legal Name"
          value={d.fullName}
          legalReference="INA § 213A"
          legalTitle="Affidavit of support requirements"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <FormField label="2. Date of Birth" value={d.dateOfBirth} />
          <FormField label="3. Country of Birth" value={d.countryOfBirth} />
        </div>
        <FormField label="4. Country of Citizenship" value={d.citizenship} />
        <FormField label="5. Street Address" value={d.address} />
        <div className="grid grid-cols-3 gap-0">
          <FormField label="6. City" value={d.city} />
          <FormField label="7. State" value={d.state} />
          <FormField label="8. ZIP Code" value={d.zip} />
        </div>
        <FormField label="9. Phone Number" value={d.phone} />
        <FormField label="10. Email Address" value={d.email || "N/A"} />
        <FormField label="11. A-Number" value={d.aNumber} />
        <FormField label="12. Social Security Number" value={d.ssn || "N/A"} />
      </FormSection>

      <FormSection part="Part 2" title="Sponsor's Employment & Income">
        <FormField label="1. Current Employer" value={d.employer || "N/A"} />
        <FormField label="2. Job Title" value={d.jobTitle || "N/A"} />
        <FormField label="3. Start Date" value={d.empStart || "—"} />
        <FormField label="4. Employer Address" value={d.empAddress || "N/A"} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <FormField label="5. Employer City" value={d.empCity || "—"} />
          <FormField label="6. Employer State" value={d.empState || "—"} />
        </div>
      </FormSection>

      <FormSection part="Part 3" title="Household Size">
        <FormField
          label="1. Total Household Size"
          value={d.childrenCount || "1"}
          legalReference="INA § 213A(f)(4)"
          legalTitle="Household size determination"
        />
        <FormYesNo label="2. Is spouse included in household?" value={d.maritalStatus === "Married"} />
      </FormSection>

      <FormSection part="Part 4" title="Beneficiary Information">
        <FormField label="1. Principal Beneficiary's Name" value={d.spouseName || "N/A"} />
        <FormField label="2. Relationship to Beneficiary" value={d.petitionerRelationship || "Spouse"} />
      </FormSection>

      <FormSection part="Part 5" title="Assets">
        <FormField
          label="1. Total Cash Value of Assets"
          value="—"
          legalReference="INA § 213A(f)(3)"
          legalTitle="Assets counted toward support"
        />
      </FormSection>
    </USCISFormShell>
  );
}
