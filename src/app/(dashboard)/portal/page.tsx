"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Briefcase, FileText, Clock, MessageSquare, Lock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default function ClientPortalPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading...</p></div>;
  if (status === "unauthenticated") redirect("/login");
  if (!session) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Portal</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome, {session.user?.name}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Lock size={12} />
          Secure Portal
        </div>
      </div>

      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">Important Notice</p>
          <p className="text-xs text-amber-700">The information in this portal is for reference only. Nothing on this portal constitutes legal advice. Please direct all legal questions to your attorney.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 text-center">
            <Briefcase size={24} className="text-accent-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">1</p>
            <p className="text-sm text-slate-500">Active Case</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <FileText size={24} className="text-accent-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">2</p>
            <p className="text-sm text-slate-500">Documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <Clock size={24} className="text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">3</p>
            <p className="text-sm text-slate-500">Pending Items</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase size={18} /> My Case</CardTitle></CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg border border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-800">Nguyen Family Immigration AOS</p>
                <p className="text-sm text-slate-500 mt-1">Adjustment of Status — Immigration</p>
              </div>
              <Badge variant="status" status="ACTIVE">Active</Badge>
            </div>
            <div className="mt-3 text-sm text-slate-600">
              <p>Your case is being processed. Our team is gathering the required documentation for your adjustment of status application.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><FileText size={18} /> Recent Documents</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {["Passport Copy", "Marriage Certificate", "I-94 Record"].map((doc) => (
              <div key={doc} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                <span className="text-sm text-slate-700">{doc}</span>
                <Badge variant="status" status="COMPLETED">Uploaded</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare size={18} /> Messages</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-sm text-slate-700">We have received your documents and will be in touch regarding next steps.</p>
              <p className="text-xs text-slate-400 mt-1">Your Legal Team &middot; 2 days ago</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-sm text-slate-700">Reminder: Please upload your most recent passport photo for the I-485 application.</p>
              <p className="text-xs text-slate-400 mt-1">Your Legal Team &middot; 5 days ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
