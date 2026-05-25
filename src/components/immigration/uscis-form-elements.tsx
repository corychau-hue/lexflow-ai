"use client";

import { AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/* ------------------------------------------------------------------ */
/*  Checkbox — Unicode □ / ☑ style like real paper forms              */
/* ------------------------------------------------------------------ */
function Checkbox({ checked, children }: { checked: boolean; children?: React.ReactNode }) {
  return (
    <span className="form-checkbox-wrapper">
      <span className="form-checkbox">{checked ? "☑" : "☐"}</span>
      {children && <span className="form-checkbox-label">{children}</span>}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Legal Reference Tooltip                                            */
/* ------------------------------------------------------------------ */
function LegalTooltip({ reference, title }: { reference?: string; title?: string }) {
  if (!reference) return null;
  return (
    <span className="group relative inline-flex items-center ml-1 align-middle">
      <Info size={10} className="text-slate-400 cursor-help hover:text-accent-500 transition-colors" />
      <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-slate-800 text-white text-[9px] leading-tight shadow-lg whitespace-nowrap z-10 pointer-events-none">
        <span className="font-semibold">{reference}</span>
        {title && <span className="block text-slate-300 font-normal">{title}</span>}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  FormField — label above, value typed on an underline like a real   */
/*  paper form field                                                    */
/* ------------------------------------------------------------------ */
interface FormFieldProps {
  label: string;
  value: string;
  legalReference?: string;
  legalTitle?: string;
}

function FormField({ label, value, legalReference, legalTitle }: FormFieldProps) {
  return (
    <div className="form-field">
      <span className="form-field-label">
        {label}
        <LegalTooltip reference={legalReference} title={legalTitle} />
      </span>
      <div className="form-field-line">
        <span className="form-field-value">{value || "—"}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FormYesNo — □ Yes  □ No with checked state                         */
/* ------------------------------------------------------------------ */
interface FormYesNoProps {
  label: string;
  value: boolean | undefined;
  legalReference?: string;
  legalTitle?: string;
}

function FormYesNo({ label, value, legalReference, legalTitle }: FormYesNoProps) {
  return (
    <div className="form-field">
      <span className="form-field-label">
        {label}
        <LegalTooltip reference={legalReference} title={legalTitle} />
      </span>
      <div className="form-yesno-row">
        <Checkbox checked={value === true}>Yes</Checkbox>
        <Checkbox checked={value === false || value === undefined}>No</Checkbox>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FormSection — black header bar, heavy border                       */
/* ------------------------------------------------------------------ */
interface FormSectionProps {
  part: string;
  title: string;
  children: React.ReactNode;
}

function FormSection({ part, title, children }: FormSectionProps) {
  return (
    <div className="form-section">
      <div className="form-section-header">
        <span className="form-section-part">{part}</span>
        <span className="form-section-title">{title}</span>
      </div>
      <div className="form-section-body">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ForUSCISUseOnly — top-of-form box with checkboxes                  */
/* ------------------------------------------------------------------ */
function ForUSCISUseOnly() {
  return (
    <div className="form-uscis-only">
      <div className="form-uscis-only-header">For USCIS Use Only</div>
      <div className="form-uscis-only-body">
        <div className="form-uscis-only-row">
          <span className="form-field-label">Preference Category:</span>
          <div className="form-underline-wide" />
        </div>
        <div className="form-uscis-only-row">
          <span className="form-field-label">Country Chargeable:</span>
          <div className="form-underline-wide" />
        </div>
        <div className="form-uscis-only-row">
          <span className="form-field-label">Priority Date:</span>
          <div className="form-underline-wide" />
        </div>
        <div className="form-uscis-only-row">
          <span className="form-field-label">Section of Law:</span>
          <span className="form-yesno-row ml-2">
            <Checkbox checked={false}>245(a)</Checkbox>
            <Checkbox checked={false}>245(i)</Checkbox>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SignatureArea — matching the official form signature block         */
/* ------------------------------------------------------------------ */
function SignatureArea() {
  return (
    <div className="form-section">
      <div className="form-section-header">
        <span className="form-section-part">Signature</span>
        <span className="form-section-title">Applicant Certification and Signature</span>
      </div>
      <div className="form-section-body">
        <p className="form-instruction">
          I certify, under penalty of perjury, that all information provided in this
          application is true and correct. I have reviewed all parts of this application
          and confirm the information is complete.
        </p>
        <div className="form-signature-grid">
          <div className="form-signature-item">
            <span className="form-field-label">Signature of Applicant:</span>
            <div className="form-signature-line" />
          </div>
          <div className="form-signature-item">
            <span className="form-field-label">Date:</span>
            <div className="form-signature-line" />
          </div>
          <div className="form-signature-item">
            <span className="form-field-label">Printed Name:</span>
            <div className="form-signature-line" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  USCISFormShell — official DHS / USCIS header with "For USCIS Only" */
/* ------------------------------------------------------------------ */
interface USCISFormShellProps {
  formNumber: string;
  title: string;
  subtitle: string;
  ombNumber: string;
  expDate: string;
  editionDate?: string;
  children: React.ReactNode;
  intakeId?: string;
}

function USCISFormShell({
  formNumber,
  title,
  subtitle,
  ombNumber,
  expDate,
  editionDate = "01/20/25",
  children,
  intakeId,
}: USCISFormShellProps) {
  return (
    <div className="form-body">
      {/* Official USCIS Form Header */}
      <div className="form-header">
        {intakeId && (
          <div className="no-print flex justify-end mb-2">
            <Badge variant="status" status="COMPLETED">
              Intake: {intakeId}
            </Badge>
          </div>
        )}

        {/* Top-right OMB info */}
        <div className="form-header-top">
          <div className="form-header-left">
            <p className="form-header-edition">Form {formNumber} (Edition {editionDate})</p>
          </div>
          <div className="form-header-right">
            <p className="form-header-omb">OMB No. {ombNumber}</p>
            <p className="form-header-exp">Expires {expDate}</p>
          </div>
        </div>

        {/* DHS / USCIS Agency Header */}
        <div className="form-header-agency">
          <p className="form-agency-name">Department of Homeland Security</p>
          <p className="form-agency-sub">U.S. Citizenship and Immigration Services</p>
        </div>

        {/* Form Title Block */}
        <div className="form-header-title-block">
          <h1 className="form-title">{formNumber}</h1>
          <p className="form-subtitle">{title}</p>
          {subtitle && <p className="form-subtitle-sub">{subtitle}</p>}
        </div>

        {/* For USCIS Use Only */}
        <ForUSCISUseOnly />

        {/* Attorney Review Banner */}
        <div className="no-print bg-amber-50 border border-amber-300 rounded p-2 mb-4 flex items-start gap-2">
          <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-semibold text-amber-800" style={{ fontFamily: "system-ui, sans-serif" }}>
              Attorney Review Required
            </p>
            <p className="text-[9px] text-amber-700" style={{ fontFamily: "system-ui, sans-serif" }}>
              This form was auto-populated from client intake data. All fields must be
              verified against original documents before submission to USCIS.
            </p>
          </div>
        </div>
      </div>

      {children}

      <SignatureArea />

      {/* Footer Disclaimer */}
      <div className="no-print mt-4 p-3 rounded bg-amber-50 border border-amber-200 flex items-start gap-2">
        <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] font-medium text-amber-800" style={{ fontFamily: "system-ui, sans-serif" }}>
            Attorney Review Required &mdash; Not for Filing
          </p>
          <p className="text-[10px] text-amber-700" style={{ fontFamily: "system-ui, sans-serif" }}>
            This data packet was prepared from client intake data for attorney/staff review
            only. All information must be verified against original source documents. This
            form does NOT constitute electronic filing with USCIS. Do not submit without
            attorney approval.
          </p>
        </div>
      </div>
    </div>
  );
}

export { Checkbox, FormField, FormSection, FormYesNo, LegalTooltip, USCISFormShell, SignatureArea, ForUSCISUseOnly };
export type { FormFieldProps, FormYesNoProps, FormSectionProps, USCISFormShellProps };
