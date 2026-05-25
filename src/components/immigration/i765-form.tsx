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
  ssn?: string;
  hasPriorFilings?: boolean;
  priorReceiptNumber?: string;
}

interface I765FormProps {
  clientData: ClientData;
  intakeId?: string;
}

export function I765Form({ clientData, intakeId }: I765FormProps) {
  const d = clientData;

  return (
    <USCISFormShell
      formNumber="Form I-765"
      title="Application for Employment Authorization"
      subtitle=""
      ombNumber="1615-0040"
      expDate="09/30/2027"
      intakeId={intakeId}
    >
      <FormSection part="Part 1" title="Information About You">
        <FormField
          label="1. Full Legal Name"
          value={d.fullName}
          legalReference="8 CFR § 274a.12"
          legalTitle="Categories of aliens authorized for employment"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <FormField label="2. Date of Birth" value={d.dateOfBirth} />
          <FormField label="3. Country of Birth" value={d.countryOfBirth} />
        </div>
        <FormField label="4. A-Number (USCIS Number)" value={d.aNumber} />
        <FormField label="5. Social Security Number" value={d.ssn || "N/A"} />
        <div className="grid grid-cols-2 gap-0">
          <FormField label="6. Gender" value={d.gender || "—"} />
          <FormField label="7. Marital Status" value={d.maritalStatus || "—"} />
        </div>
      </FormSection>

      <FormSection part="Part 2" title="Eligibility Category">
        <FormField
          label="1. Eligibility Category"
          value={d.immigrationStatus || "Adjustment of Status Applicant"}
          legalReference="8 CFR § 274a.12(a)-(c)"
          legalTitle="Categories of employment authorization"
        />
      </FormSection>

      <FormSection part="Part 3" title="Address & Contact">
        <FormField label="1. Street Address" value={d.address} />
        <div className="grid grid-cols-3 gap-0">
          <FormField label="2. City" value={d.city} />
          <FormField label="3. State" value={d.state} />
          <FormField label="4. ZIP Code" value={d.zip} />
        </div>
        <FormField label="5. Phone Number" value={d.phone} />
        <FormField label="6. Email Address" value={d.email || "N/A"} />
      </FormSection>

      <FormSection part="Part 4" title="Previous EAD Information">
        <FormYesNo label="1. Previously applied for an EAD?" value={d.hasPriorFilings} />
        {d.hasPriorFilings && (
          <FormField label="2. Previous Receipt Number" value={d.priorReceiptNumber || "N/A"} />
        )}
      </FormSection>
    </USCISFormShell>
  );
}
