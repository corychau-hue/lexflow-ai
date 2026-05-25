"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Settings as SettingsIcon, Shield, Bell, Lock, Database, Upload, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/textarea";

export default function SettingsPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading...</p></div>;
  if (status === "unauthenticated") redirect("/login");
  if (!session) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Configure system preferences and firm information</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><SettingsIcon size={18} /> Firm Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Firm Name" defaultValue="LexFlow AI Legal Services" />
            <Input label="State Bar Number" defaultValue="CA Bar #123456" />
            <Input label="Address" defaultValue="123 Legal Avenue, Suite 400" />
            <Input label="Phone" defaultValue="(555) 123-4567" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Shield size={18} /> Security Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Session Timeout" options={[{ value: "15", label: "15 minutes" }, { value: "30", label: "30 minutes" }, { value: "60", label: "1 hour" }, { value: "240", label: "4 hours" }]} />
            <Select label="Password Policy" options={[{ value: "standard", label: "Standard" }, { value: "strict", label: "Strict (12+ chars)" }]} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Bell size={18} /> Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {["Deadline reminders", "New intake notifications", "AI review completed", "Task assignments"].map((n) => (
            <label key={n} className="flex items-center gap-3 text-sm">
              <input type="checkbox" className="rounded border-slate-300 accent-accent-600" defaultChecked />
              {n}
            </label>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Database size={18} /> AI Configuration</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="AI Provider" options={[{ value: "mock", label: "Mock (Development)" }, { value: "openai", label: "OpenAI" }, { value: "anthropic", label: "Anthropic" }]} />
            <Input label="API Key" type="password" placeholder="sk-..." />
          </div>
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-xs text-amber-700">
              <strong>AI Disclaimer:</strong> All AI-generated content must be reviewed by an attorney. Enable real AI providers only after configuring proper oversight.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="primary"><Save size={16} /> Save Settings</Button>
      </div>
    </div>
  );
}
