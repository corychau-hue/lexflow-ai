"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { UserPlus, Phone, Mail, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockLeads } from "@/lib/mock-data";
import { formatDate, getStatusColor } from "@/lib/utils";

const leadStats = [
  { label: "New Leads", value: "4", color: "text-blue-600" },
  { label: "Consultations", value: "1", color: "text-purple-600" },
  { label: "Retained", value: "1", color: "text-green-600" },
  { label: "Follow-up Needed", value: "1", color: "text-amber-600" },
];

export default function CRMPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading...</p></div>;
  if (status === "unauthenticated") redirect("/login");
  if (!session) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">CRM / Lead Management</h1>
          <p className="text-sm text-slate-500 mt-1">Track and manage client leads</p>
        </div>
        <Button variant="primary" size="sm"><UserPlus size={16} /> Add Lead</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {leadStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-slate-600 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Name</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Contact</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Practice Area</th>
                <th className="text-center text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Source</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Value</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-800">{lead.firstName} {lead.lastName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-600 space-y-1">
                      {lead.email && <span className="flex items-center gap-1"><Mail size={11} />{lead.email}</span>}
                      {lead.phone && <span className="flex items-center gap-1"><Phone size={11} />{lead.phone}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{lead.practiceArea?.replace(/_/g, " ") || "N/A"}</td>
                  <td className="px-6 py-4 text-center"><Badge variant="status" status={lead.status} /></td>
                  <td className="px-6 py-4 text-sm text-slate-600">{lead.referralSource || "N/A"}</td>
                  <td className="px-6 py-4 text-right text-sm text-slate-600">{lead.estimatedValue ? `$${lead.estimatedValue.toLocaleString()}` : "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{formatDate(lead.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
