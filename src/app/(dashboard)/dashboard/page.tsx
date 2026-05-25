"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  Briefcase,
  Users,
  FileText,
  CalendarClock,
  Bot,
  AlertTriangle,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate, daysUntil, getPracticeAreaColor } from "@/lib/utils";

// Mock data for dashboard
const stats = [
  { label: "Active Cases", value: "24", icon: Briefcase, color: "bg-blue-50 text-blue-600", change: "+3 this month" },
  { label: "New Intakes", value: "8", icon: Users, color: "bg-purple-50 text-purple-600", change: "+2 this week" },
  { label: "Pending Documents", value: "12", icon: FileText, color: "bg-amber-50 text-amber-600", change: "5 urgent" },
  { label: "Upcoming Deadlines", value: "7", icon: CalendarClock, color: "bg-red-50 text-red-600", change: "3 overdue" },
  { label: "AI Tasks Pending", value: "15", icon: Bot, color: "bg-indigo-50 text-indigo-600", change: "Needs review" },
];

const recentActivity = [
  { id: "1", action: "Document uploaded", details: "Nguyen Passport - I-485 Case", time: "10 minutes ago", user: "Maria Kim" },
  { id: "2", action: "AI extraction completed", details: "Police Report - Garcia PI Case", time: "25 minutes ago", user: "AI Assistant" },
  { id: "3", action: "Case status updated", details: "Zhang F-1 Visa → PENDING", time: "1 hour ago", user: "James Rodriguez" },
  { id: "4", action: "New lead added", details: "Ana Martinez - Immigration Consult", time: "2 hours ago", user: "David Park" },
  { id: "5", action: "Task completed", details: "Reviewed I-485 application form", time: "3 hours ago", user: "James Rodriguez" },
  { id: "6", action: "Translation saved", details: "Client update letter → Vietnamese", time: "4 hours ago", user: "Maria Kim" },
  { id: "7", action: "Lead converted to client", details: "Sarah Wilson → Retained", time: "5 hours ago", user: "David Park" },
];

const casesByArea = [
  { area: "Immigration", count: 10, color: "bg-blue-500" },
  { area: "Personal Injury", count: 5, color: "bg-red-500" },
  { area: "Family Law", count: 3, color: "bg-purple-500" },
  { area: "Estate Planning", count: 4, color: "bg-green-500" },
  { area: "Real Property", count: 1, color: "bg-amber-500" },
  { area: "Business/Tax", count: 1, color: "bg-indigo-500" },
];

const upcomingDeadlines = [
  { id: "1", title: "DACA Renewal Filing", case: "Pham DACA Renewal", due: new Date("2026-05-25"), urgent: true },
  { id: "2", title: "Medical Records Request", case: "Garcia PI Claim", due: new Date("2026-05-28"), urgent: true },
  { id: "3", title: "RFE Response Due", case: "Zhang F-1 Visa", due: new Date("2026-06-01"), urgent: true },
  { id: "4", title: "Review I-485 Application", case: "Nguyen AOS", due: new Date("2026-06-01"), urgent: false },
  { id: "5", title: "Trust Document Review", case: "Johnson Estate", due: new Date("2026-06-05"), urgent: false },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const role = (session?.user as any)?.role;

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading...</p></div>;
  if (status === "unauthenticated") redirect("/login");
  if (!session) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, {session.user?.name}. You have {stats.reduce((a, s) => a + parseInt(s.value), 0)} items requiring attention.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/intake/new">
            <Button variant="primary" size="sm">
              <Users size={16} />
              New Intake
            </Button>
          </Link>
          <Link href="/cases">
            <Button variant="secondary" size="sm">
              <Briefcase size={16} />
              New Case
            </Button>
          </Link>
        </div>
      </div>

      {/* AI Attorney Review Banner */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">Attorney Review Required</p>
          <p className="text-xs text-amber-700 mt-0.5">
            <strong>15 AI-generated items</strong> are pending attorney review. AI outputs must not be used, sent, or filed without attorney approval.
            <Link href="/review-queue" className="underline font-medium ml-1">View Review Queue →</Link>
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <ArrowUpRight size={14} className="text-slate-400" />
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-3">{stat.value}</p>
              <p className="text-sm text-slate-600 mt-0.5">{stat.label}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity size={18} className="text-slate-500" />
                Recent Activity
              </CardTitle>
              <Link href="/reports" className="text-xs text-accent-600 hover:underline">View all</Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {recentActivity.map((item, i) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 py-3 ${i < recentActivity.length - 1 ? "border-b border-slate-100" : ""}`}
                >
                  <div className="w-2 h-2 rounded-full bg-accent-500 mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-800">{item.action}</p>
                      <span className="text-xs text-slate-400 flex-shrink-0">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{item.details}</p>
                    <p className="text-xs text-slate-400 mt-0.5">by {item.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarClock size={18} className="text-slate-500" />
                Deadlines
              </CardTitle>
              <Link href="/calendar" className="text-xs text-accent-600 hover:underline">View all</Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map((dl) => {
                const days = daysUntil(dl.due);
                return (
                  <div key={dl.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium text-slate-800">{dl.title}</p>
                      <Badge
                        variant="status"
                        status={days <= 3 ? "OVERDUE" : days <= 7 ? "PENDING" : "ACTIVE"}
                      >
                        {days <= 0 ? "OVERDUE" : `${days} days`}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{dl.case}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Due: {formatDate(dl.due)}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cases by Practice Area */}
        <Card>
          <CardHeader>
            <CardTitle>Cases by Practice Area</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {casesByArea.map((area) => (
                <div key={area.area}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-slate-700">{area.area}</span>
                    <span className="text-sm font-semibold text-slate-900">{area.count}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${area.color}`}
                      style={{ width: `${(area.count / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-slate-100">
                <Link href="/reports">
                  <Button variant="ghost" size="sm" className="w-full text-xs">
                    View Full Report
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Pending AI Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot size={18} className="text-slate-500" />
              AI Review Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: "Document Extraction", case: "Nguyen AOS", status: "Pending", time: "10 min ago" },
                { type: "Translation", case: "Garcia PI", status: "Pending", time: "25 min ago" },
                { type: "Writing - Client Update", case: "Pham DACA", status: "Pending", time: "1 hour ago" },
                { type: "Case Summary", case: "Johnson Estate", status: "Draft", time: "2 hours ago" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.type}</p>
                    <p className="text-xs text-slate-500">{item.case}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="status" status="PENDING_REVIEW">Review</Badge>
                    <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
              <Link href="/review-queue">
                <Button variant="primary" size="sm" className="w-full">
                  Open Review Queue
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
