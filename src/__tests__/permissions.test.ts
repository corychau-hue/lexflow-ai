import { describe, it, expect } from "vitest";
import { UserRole } from "@/generated/prisma/enums";
import { hasPermission, getRoleLabel } from "@/lib/permissions";
import type { Permission } from "@/lib/permissions";

/**
 * Full permission matrix as documented in the spec.
 * true = role has the permission, false = role does not.
 */
const MATRIX: Record<UserRole, Record<Permission, boolean>> = {
  [UserRole.ADMIN]: {
    "view:dashboard": true, "view:clients": true, "create:client": true, "edit:client": true, "delete:client": true,
    "view:cases": true, "create:case": true, "edit:case": true, "delete:case": true,
    "view:documents": true, "upload:document": true, "delete:document": true,
    "view:ai-features": true, "use:ai-write": true, "use:ai-extract": true, "use:ai-translate": true, "approve:ai-output": true,
    "view:tasks": true, "create:task": true, "edit:task": true,
    "view:deadlines": true, "view:reports": true,
    "view:crm": true, "edit:crm": true,
    "view:settings": true, "edit:settings": true,
    "manage:users": true, "view:audit-log": true,
    "view:portal": true, "use:esign": true, "delete:data": true,
  },
  [UserRole.ATTORNEY]: {
    "view:dashboard": true, "view:clients": true, "create:client": true, "edit:client": true, "delete:client": false,
    "view:cases": true, "create:case": true, "edit:case": true, "delete:case": false,
    "view:documents": true, "upload:document": true, "delete:document": false,
    "view:ai-features": true, "use:ai-write": true, "use:ai-extract": true, "use:ai-translate": true, "approve:ai-output": true,
    "view:tasks": true, "create:task": true, "edit:task": true,
    "view:deadlines": true, "view:reports": true,
    "view:crm": true, "edit:crm": true,
    "view:settings": false, "edit:settings": false,
    "manage:users": false, "view:audit-log": false,
    "view:portal": true, "use:esign": true, "delete:data": false,
  },
  [UserRole.PARALEGAL]: {
    "view:dashboard": true, "view:clients": true, "create:client": true, "edit:client": true, "delete:client": false,
    "view:cases": true, "create:case": true, "edit:case": true, "delete:case": false,
    "view:documents": true, "upload:document": true, "delete:document": false,
    "view:ai-features": true, "use:ai-write": true, "use:ai-extract": true, "use:ai-translate": true, "approve:ai-output": false,
    "view:tasks": true, "create:task": true, "edit:task": true,
    "view:deadlines": true, "view:reports": false,
    "view:crm": true, "edit:crm": true,
    "view:settings": false, "edit:settings": false,
    "manage:users": false, "view:audit-log": false,
    "view:portal": true, "use:esign": false, "delete:data": false,
  },
  [UserRole.INTAKE_STAFF]: {
    "view:dashboard": true, "view:clients": true, "create:client": true, "edit:client": true, "delete:client": false,
    "view:cases": true, "create:case": true, "edit:case": false, "delete:case": false,
    "view:documents": true, "upload:document": true, "delete:document": false,
    "view:ai-features": false, "use:ai-write": false, "use:ai-extract": false, "use:ai-translate": false, "approve:ai-output": false,
    "view:tasks": true, "create:task": true, "edit:task": false,
    "view:deadlines": true, "view:reports": false,
    "view:crm": true, "edit:crm": true,
    "view:settings": false, "edit:settings": false,
    "manage:users": false, "view:audit-log": false,
    "view:portal": false, "use:esign": false, "delete:data": false,
  },
  [UserRole.CLIENT]: {
    "view:dashboard": true, "view:clients": false, "create:client": false, "edit:client": false, "delete:client": false,
    "view:cases": false, "create:case": false, "edit:case": false, "delete:case": false,
    "view:documents": true, "upload:document": false, "delete:document": false,
    "view:ai-features": false, "use:ai-write": false, "use:ai-extract": false, "use:ai-translate": false, "approve:ai-output": false,
    "view:tasks": true, "create:task": false, "edit:task": false,
    "view:deadlines": true, "view:reports": false,
    "view:crm": false, "edit:crm": false,
    "view:settings": false, "edit:settings": false,
    "manage:users": false, "view:audit-log": false,
    "view:portal": true, "use:esign": false, "delete:data": false,
  },
};

const ALL_PERMISSIONS: Permission[] = [
  "view:dashboard", "view:clients", "create:client", "edit:client", "delete:client",
  "view:cases", "create:case", "edit:case", "delete:case",
  "view:documents", "upload:document", "delete:document",
  "view:ai-features", "use:ai-write", "use:ai-extract", "use:ai-translate", "approve:ai-output",
  "view:tasks", "create:task", "edit:task",
  "view:deadlines", "view:reports",
  "view:crm", "edit:crm",
  "view:settings", "edit:settings",
  "manage:users", "view:audit-log",
  "view:portal", "use:esign", "delete:data",
];

const ALL_ROLES = Object.values(UserRole);

describe("hasPermission", () => {
  // Test every single cell in the matrix
  for (const role of ALL_ROLES) {
    describe(`${role} role`, () => {
      for (const permission of ALL_PERMISSIONS) {
        const expected = MATRIX[role][permission];
        const label = expected ? "ALLOWS" : "DENIES";

        it(`${label} ${permission}`, () => {
          expect(hasPermission(role, permission)).toBe(expected);
        });
      }
    });
  }

  // Boundary tests — spot-check critical permissions
  describe("critical boundaries", () => {
    it("only ADMIN can delete data", () => {
      for (const role of ALL_ROLES) {
        expect(hasPermission(role, "delete:data")).toBe(role === UserRole.ADMIN);
      }
    });

    it("only ADMIN can manage users", () => {
      for (const role of ALL_ROLES) {
        expect(hasPermission(role, "manage:users")).toBe(role === UserRole.ADMIN);
      }
    });

    it("only ADMIN and ATTORNEY can approve AI output", () => {
      for (const role of ALL_ROLES) {
        const canApprove = role === UserRole.ADMIN || role === UserRole.ATTORNEY;
        expect(hasPermission(role, "approve:ai-output")).toBe(canApprove);
      }
    });

    it("INTAKE_STAFF and CLIENT cannot access AI features", () => {
      expect(hasPermission(UserRole.INTAKE_STAFF, "view:ai-features")).toBe(false);
      expect(hasPermission(UserRole.CLIENT, "view:ai-features")).toBe(false);
    });

    it("CLIENT can only view dashboard, portal, documents, tasks, deadlines", () => {
      const clientOnly: Permission[] = ["view:dashboard", "view:portal", "view:documents", "view:tasks", "view:deadlines"];
      const clientDenied = ALL_PERMISSIONS.filter((p) => !clientOnly.includes(p));

      for (const p of clientOnly) {
        expect(hasPermission(UserRole.CLIENT, p)).toBe(true);
      }
      for (const p of clientDenied) {
        expect(hasPermission(UserRole.CLIENT, p)).toBe(false);
      }
    });
  });

  describe("edge cases", () => {
    it("returns false for unknown role", () => {
      // @ts-expect-error testing invalid role
      expect(hasPermission("UNKNOWN_ROLE", "view:dashboard")).toBe(false);
    });

    it("returns false for unknown permission", () => {
      // @ts-expect-error testing invalid permission
      expect(hasPermission(UserRole.ADMIN, "unknown:permission")).toBe(false);
    });
  });
});

describe("getRoleLabel", () => {
  it("returns human-readable labels for all roles", () => {
    expect(getRoleLabel(UserRole.ADMIN)).toBe("Admin");
    expect(getRoleLabel(UserRole.ATTORNEY)).toBe("Attorney");
    expect(getRoleLabel(UserRole.PARALEGAL)).toBe("Paralegal");
    expect(getRoleLabel(UserRole.INTAKE_STAFF)).toBe("Intake Staff");
    expect(getRoleLabel(UserRole.CLIENT)).toBe("Client");
  });
});
