import { UserRole } from "@/generated/prisma/enums";

export type Permission =
  | "view:dashboard"
  | "view:clients"
  | "create:client"
  | "edit:client"
  | "delete:client"
  | "view:cases"
  | "create:case"
  | "edit:case"
  | "delete:case"
  | "view:documents"
  | "upload:document"
  | "delete:document"
  | "view:ai-features"
  | "use:ai-write"
  | "use:ai-extract"
  | "use:ai-translate"
  | "approve:ai-output"
  | "view:tasks"
  | "create:task"
  | "edit:task"
  | "view:deadlines"
  | "view:reports"
  | "view:crm"
  | "edit:crm"
  | "view:settings"
  | "edit:settings"
  | "manage:users"
  | "view:audit-log"
  | "view:portal"
  | "use:esign"
  | "delete:data";

const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    "view:dashboard", "view:clients", "create:client", "edit:client", "delete:client",
    "view:cases", "create:case", "edit:case", "delete:case",
    "view:documents", "upload:document", "delete:document",
    "view:ai-features", "use:ai-write", "use:ai-extract", "use:ai-translate", "approve:ai-output",
    "view:tasks", "create:task", "edit:task",
    "view:deadlines",
    "view:reports",
    "view:crm", "edit:crm",
    "view:settings", "edit:settings",
    "manage:users",
    "view:audit-log",
    "view:portal",
    "use:esign",
    "delete:data",
  ],
  [UserRole.ATTORNEY]: [
    "view:dashboard", "view:clients", "create:client", "edit:client",
    "view:cases", "create:case", "edit:case",
    "view:documents", "upload:document",
    "view:ai-features", "use:ai-write", "use:ai-extract", "use:ai-translate", "approve:ai-output",
    "view:tasks", "create:task", "edit:task",
    "view:deadlines",
    "view:reports",
    "view:crm", "edit:crm",
    "view:portal",
    "use:esign",
  ],
  [UserRole.PARALEGAL]: [
    "view:dashboard", "view:clients", "create:client", "edit:client",
    "view:cases", "create:case", "edit:case",
    "view:documents", "upload:document",
    "view:ai-features", "use:ai-write", "use:ai-extract", "use:ai-translate",
    "view:tasks", "create:task", "edit:task",
    "view:deadlines",
    "view:crm", "edit:crm",
    "view:portal",
  ],
  [UserRole.INTAKE_STAFF]: [
    "view:dashboard",
    "view:clients", "create:client", "edit:client",
    "view:cases", "create:case",
    "view:documents", "upload:document",
    "view:tasks", "create:task",
    "view:deadlines",
    "view:crm", "edit:crm",
  ],
  [UserRole.CLIENT]: [
    "view:dashboard",
    "view:portal",
    "view:documents",
    "view:tasks",
    "view:deadlines",
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    [UserRole.ADMIN]: "Admin",
    [UserRole.ATTORNEY]: "Attorney",
    [UserRole.PARALEGAL]: "Paralegal",
    [UserRole.INTAKE_STAFF]: "Intake Staff",
    [UserRole.CLIENT]: "Client",
  };
  return labels[role];
}
