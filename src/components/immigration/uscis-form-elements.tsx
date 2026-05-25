"use client";

import { AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/* ------------------------------------------------------------------ */
/*  Checkbox — Unicode □ / ☑ style like real paper forms              */
/* ------------------------------------------------------------------ */
function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span className="form-checkbox">
      {checked ? "☑" : "☐"}
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
/*  FormField — label on left, typewriter value on underline           */
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
      <span className="form-label">
        {label}
        <LegalTooltip reference={legalReference} title={legalTitle} />
      </span>
      <span className="form-value">{value || "—"}</span>
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
      <span className="form-label">
        {label}
        <LegalTooltip reference={legalReference} title={legalTitle} />
      </span>
      <span className="flex items-center gap-3">
        <span className="form-yesno">
          <Checkbox checked={value === true} /> Yes
        </span>
        <span className="form-yesno">
          <Checkbox checked={value === false || value === undefined} /> No
        </span>
      </span>
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
/*  USCISFormShell — official DHS / USCIS header                       */
/* ------------------------------------------------------------------ */
interface USCISFormShellProps {
  formNumber: string;
  title: string;
  subtitle: string;
  ombNumber: string;
  expDate: string;
  children: React.ReactNode;
  intakeId?: string;
}

function USCISFormShell({
  formNumber,
  title,
  subtitle,
  ombNumber,
  expDate,
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
        <div className="text-center pb-3 mb-4" style={{ borderBottom: "2px solid #000" }}>
          <p className="text-[9px] tracking-widest text-slate-600 mb-1" style={{ fontFamily: "system-ui, sans-serif" }}>
            OMB No. {ombNumber}
          </p>
          <p className="text-[11px] font-bold text-slate-800" style={{ fontFamily: "system-ui, sans-serif" }}>
            Department of Homeland Security
          </p>
          <p className="text-[11px] text-slate-600" style={{ fontFamily: "system-ui, sans-serif" }}>
            U.S. Citizenship and Immigration Services
          </p>
          <h1 className="form-title">{formNumber}</h1>
          <p className="text-[11px] font-medium text-slate-700" style={{ fontFamily: "system-ui, sans-serif" }}>
            {title}
            {subtitle && (
              <>
                <br />
                {subtitle}
              </>
            )}
          </p>
          <p className="text-[9px] text-slate-400 mt-1" style={{ fontFamily: "system-ui, sans-serif" }}>
            Expires {expDate}. See current forms page at www.uscis.gov/forms.
          </p>
        </div>

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

      {/* Signature Area */}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div>
              <span className="form-label">Signature of Applicant:</span>
              <div className="form-signature-line" />
            </div>
            <div>
              <span className="form-label">Date:</span>
              <div className="form-signature-line" />
            </div>
            <div>
              <span className="form-label">Printed Name:</span>
              <div className="form-signature-line" />
            </div>
          </div>
        </div>
      </div>

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

export { Checkbox, FormField, FormSection, FormYesNo, LegalTooltip, USCISFormShell };
export type { FormFieldProps, FormYesNoProps, FormSectionProps, USCISFormShellProps };
