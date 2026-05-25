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
  motherName?: string;
  motherCountry?: string;
  fatherName?: string;
  fatherCountry?: string;
  parentUSCitizen?: boolean;
  petitionerRelationship?: string;
}

interface I130FormProps {
  clientData: ClientData;
  intakeId?: string;
}

export function I130Form({ clientData, intakeId }: I130FormProps) {
  const d = clientData;

  return (
    <USCISFormShell
      formNumber="Form I-130"
      title="Petition for Alien Relative"
      subtitle=""
      ombNumber="1615-0012"
      expDate="01/31/2027"
      intakeId={intakeId}
    >
      <FormSection part="Part 1" title="Relationship to Beneficiary">
        <FormField
          label="1. Relationship to Beneficiary"
          value={d.petitionerRelationship || "Spouse"}
          legalReference="INA § 203(a)"
          legalTitle="Preference allocation for family-sponsored immigrants"
        />
      </FormSection>

      <FormSection part="Part 2" title="Information About You (Petitioner)">
        <FormField
          label="1. Your Full Legal Name"
          value={d.fullName}
          legalReference="INA § 204(a)(1)(A)"
          legalTitle="Petition requirements for immediate relatives"
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
        <FormField label="11. Marital Status" value={d.maritalStatus || "—"} />
        <FormField label="12. A-Number" value={d.aNumber} />
      </FormSection>

      <FormSection part="Part 3" title="Information About Your Relative (Beneficiary)">
        <FormField label="1. Beneficiary's Full Name" value={d.spouseName || "N/A"} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <FormField label="2. Date of Birth" value={d.spouseDOB || "—"} />
          <FormField label="3. Country of Birth" value={d.spouseBirth || "—"} />
        </div>
        <FormField label="4. Country of Citizenship" value={d.spouseStatus || "—"} />
        <FormField label="5. Beneficiary's A-Number" value={d.spouseANumber || "N/A"} />
        <FormField label="6. Current Address" value={d.address} />
      </FormSection>

      <FormSection part="Part 4" title="Beneficiary's Parents">
        <FormField label="1. Mother's Full Name" value={d.motherName || "N/A"} />
        <FormField label="2. Father's Full Name" value={d.fatherName || "N/A"} />
      </FormSection>

      <FormSection part="Part 5" title="Beneficiary's Marital History">
        <FormField label="1. Number of Prior Marriages" value={d.priorMarriages || "0"} />
        <FormField label="2. Date of Current Marriage" value={d.marriageDate || "—"} />
        <FormField label="3. Place of Current Marriage" value={d.marriagePlace || "—"} />
      </FormSection>

      <FormSection part="Part 6" title="Petitioner's Previous Marriages">
        <FormField label="1. Number of Prior Marriages" value={d.priorMarriages || "0"} />
      </FormSection>
    </USCISFormShell>
  );
}
