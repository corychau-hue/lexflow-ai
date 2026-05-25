"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { BarChart3, Briefcase, Users, FileText, Clock, TrendingUp, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockCases, mockLeads, mockTasks, mockClients } from "@/lib/mock-data";
import { practiceAreaLabels } from "@/lib/mock-data";

const reports = [
  { label: "Open Cases", value: mockCases.filter((c) => c.status === "ACTIVE").length, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Pending Intakes", value: "8", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Active Leads", value: mockLeads.filter((l) => l.status !== "DECLINED" && l.status !== "RETAINED").length, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
  { label: "Pending Tasks", value: mockTasks.filter((t) => t.status !== "COMPLETED").length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Total Clients", value: mockClients.length, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Total Documents", value: 12, icon: FileText, color: "text-slate-600", bg: "bg-slate-50" },
];

const casesByArea = [
  { area: "Immigration", count: 10, color: "text-blue-600" },
  { area: "Personal Injury", count: 5, color: "text-red-600" },
  { area: "Family Law", count: 3, color: "text-purple-600" },
  { area: "Estate Planning", count: 4, color: "text-green-600" },
  { area: "Real Property", count: 1, color: "text-amber-600" },
  { area: "Business/Tax", count: 1, color: "text-indigo-600" },
];

const recentReports = [
  { name: "Monthly Case Activity Report", date: "May 2026", type: "PDF" },
  { name: "Staff Productivity Summary", date: "Q2 2026", type: "PDF" },
  { name: "Lead Conversion Analysis", date: "May 2026", type: "CSV" },
  { name: "Deadline Compliance Report", date: "Week 20", type: "PDF" },
];

export default function ReportsPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading...</p></div>;
  if (status === "unauthenticated") redirect("/login");
  if (!session) return null;

  const total = casesByArea.reduce((sum, a) => sum + a.count, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Firm-wide performance metrics and reports</p>
        </div>
        <Button variant="primary" size="sm"><Download size={16} /> Export All</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r) => (
          <Card key={r.label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`p-3 rounded-lg ${r.bg}`}>
                <r.icon size={20} className={r.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{r.value}</p>
                <p className="text-sm text-slate-500">{r.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cases by Practice Area */}
        <Card>
          <CardHeader><CardTitle>Cases by Practice Area</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {casesByArea.map((area) => (
                <div key={area.area}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-slate-700">{area.area}</span>
                    <span className={`text-sm font-semibold ${area.color}`}>{area.count}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent-500"
                      style={{ width: `${(area.count / total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-2 text-sm text-slate-500">Total: {total} active cases</div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader><CardTitle>Generated Reports</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentReports.map((r) => (
              <div key={r.name} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                <div>
                  <p className="text-sm font-medium text-slate-800">{r.name}</p>
                  <p className="text-xs text-slate-500">{r.date}</p>
                </div>
                <Badge>{r.type}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Report Generation */}
      <Card>
        <CardHeader><CardTitle>Generate Report</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {["Open Cases", "Staff Workload", "Leads Converted", "Case Aging", "Monthly Productivity", "Missing Documents"].map((r) => (
              <Button key={r} variant="secondary" size="sm">{r}</Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
