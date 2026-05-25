"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Shield, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRoleLabel } from "@/lib/permissions";

const roles = [
  { id: "admin", name: "Admin", users: 1, description: "Full system access. Can manage users, delete data, and configure settings." },
  { id: "attorney", name: "Attorney", users: 1, description: "Can manage cases, use AI features, approve AI outputs, and access reports." },
  { id: "paralegal", name: "Paralegal", users: 1, description: "Can manage cases and use AI tools but cannot approve outputs or delete data." },
  { id: "intake", name: "Intake Staff", users: 1, description: "Can create clients and cases, upload documents. No AI feature access." },
  { id: "client", name: "Client", users: 1, description: "Portal access only. Can view own case and documents." },
];

const permissionMatrix: Record<string, string[]> = {
  "Admin": ["✓", "✓", "✓", "✓", "✓", "✓", "✓", "✓", "✓"],
  "Attorney": ["✓", "✓", "✓", "✓", "✓", "—", "—", "✓", "✓"],
  "Paralegal": ["✓", "✓", "✓", "—", "✓", "—", "—", "—", "✓"],
  "Intake Staff": ["✓", "✓", "—", "—", "—", "—", "—", "—", "✓"],
  "Client": ["—", "—", "—", "—", "—", "—", "—", "—", "✓"],
};

const permLabels = ["View Dashboard", "View Clients", "Create Cases", "AI Features", "View Tasks", "Approve AI", "Delete Data", "View Reports", "Client Portal"];

export default function RolesPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading...</p></div>;
  if (status === "unauthenticated") redirect("/login");
  if (!session) return null;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Roles & Permissions</h1>
        <p className="text-sm text-slate-500 mt-1">Manage role-based access control for the platform</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-slate-100">
                  <Shield size={18} className="text-slate-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{role.name}</p>
                  <p className="text-xs text-slate-500">{role.users} user(s)</p>
                </div>
              </div>
              <p className="text-xs text-slate-600">{role.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Permission Matrix</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-medium text-slate-600">Permission</th>
                {Object.keys(permissionMatrix).map((role) => (
                  <th key={role} className="text-center py-2 px-3 font-medium text-slate-600 text-xs">{role}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permLabels.map((perm, i) => (
                <tr key={perm} className="border-b border-slate-100">
                  <td className="py-2.5 pr-4 text-slate-700">{perm}</td>
                  {Object.values(permissionMatrix).map((perms, j) => (
                    <td key={j} className="text-center py-2.5 px-3">
                      {perms[i] === "✓" ? <Check size={14} className="text-green-600 mx-auto" /> : <X size={14} className="text-slate-300 mx-auto" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
