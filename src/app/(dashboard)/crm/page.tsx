"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { UserPlus, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  practiceArea?: string;
  status: string;
  referralSource?: string;
  estimatedValue?: number;
  createdAt: string;
}

export default function CRMPage() {
  const { data: session, status } = useSession();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        setLeads(data.leads || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading...</p></div>;
  if (status === "unauthenticated") redirect("/login");
  if (!session) return null;

  const newCount = leads.filter((l) => l.status === "NEW").length;
  const consultationCount = leads.filter((l) => l.status === "CONSULTATION_SCHEDULED").length;
  const retainedCount = leads.filter((l) => l.status === "RETAINED").length;
  const followUpCount = leads.filter((l) => l.status === "FOLLOW_UP_NEEDED").length;

  const leadStats = [
    { label: "New Leads", value: newCount, color: "text-blue-600" },
    { label: "Consultations", value: consultationCount, color: "text-purple-600" },
    { label: "Retained", value: retainedCount, color: "text-green-600" },
    { label: "Follow-up Needed", value: followUpCount, color: "text-amber-600" },
  ];

  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading leads...</p></div>;

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
        <CardHeader>
          <CardTitle className="text-sm">All Leads</CardTitle>
        </CardHeader>
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
              {leads.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-sm text-slate-500">No leads yet</td></tr>
              ) : (
                leads.map((lead) => (
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
                    <td className="px-6 py-4 text-sm text-slate-500">{formatDate(new Date(lead.createdAt))}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
