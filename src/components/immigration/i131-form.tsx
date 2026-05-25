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
  departureHistory?: string;
  citizenship?: string;
  dateOfEntry?: string;
}

interface I131FormProps {
  clientData: ClientData;
  intakeId?: string;
}

export function I131Form({ clientData, intakeId }: I131FormProps) {
  const d = clientData;

  return (
    <USCISFormShell
      formNumber="Form I-131"
      title="Application for Travel Document"
      subtitle=""
      ombNumber="1615-0013"
      expDate="03/31/2027"
      intakeId={intakeId}
    >
      <FormSection part="Part 1" title="Information About You">
        <FormField
          label="1. Full Legal Name"
          value={d.fullName}
          legalReference="INA § 212(d)(4)"
          legalTitle="Travel document authority"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <FormField label="2. Date of Birth" value={d.dateOfBirth} />
          <FormField label="3. Country of Birth" value={d.countryOfBirth} />
        </div>
        <FormField label="4. A-Number (USCIS Number)" value={d.aNumber} />
        <div className="grid grid-cols-2 gap-0">
          <FormField label="5. Gender" value={d.gender || "—"} />
          <FormField label="6. Marital Status" value={d.maritalStatus || "—"} />
        </div>
      </FormSection>

      <FormSection part="Part 2" title="Travel Document Type">
        <FormField
          label="1. Application Type"
          value="Advance Parole / Reentry Permit"
          legalReference="INA § 223"
          legalTitle="Reentry permits"
        />
        <FormField
          label="2. Purpose of Travel"
          value={d.departureHistory || "Personal travel"}
        />
      </FormSection>

      <FormSection part="Part 3" title="Planned Travel Information">
        <FormField label="1. Expected Date of Departure" value="—" />
        <FormField label="2. Expected Date of Return" value="—" />
        <FormField label="3. Countries to Visit" value={d.citizenship || "—"} />
      </FormSection>

      <FormSection part="Part 4" title="Address & Contact">
        <FormField label="1. Street Address" value={d.address} />
        <div className="grid grid-cols-3 gap-0">
          <FormField label="2. City" value={d.city} />
          <FormField label="3. State" value={d.state} />
          <FormField label="4. ZIP Code" value={d.zip} />
        </div>
        <FormField label="5. Phone Number" value={d.phone} />
        <FormField label="6. Email Address" value={d.email || "N/A"} />
      </FormSection>
    </USCISFormShell>
  );
}
