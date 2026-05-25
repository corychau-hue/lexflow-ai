"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Copy, Download, Save, Bot, AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea, Select } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getAIService } from "@/lib/ai-service-core";

const actions = [
  { id: "formal_legal", label: "Formal Legal Style", icon: "⚖️" },
  { id: "simple_english", label: "Simple English", icon: "📝" },
  { id: "more_professional", label: "More Professional", icon: "💼" },
  { id: "more_friendly", label: "More Friendly", icon: "🤝" },
  { id: "draft_client_update", label: "Draft Client Update", icon: "📧" },
  { id: "draft_attorney_letter", label: "Draft Attorney Letter", icon: "✉️" },
  { id: "draft_insurance_demand", label: "Insurance Demand", icon: "📄" },
  { id: "draft_uscis_inquiry", label: "USCIS/NVC Inquiry", icon: "🏛️" },
  { id: "draft_court_filing", label: "Court Filing Summary", icon: "📑" },
  { id: "summarize", label: "Summarize", icon: "📋" },
  { id: "extract_action_items", label: "Action Items", icon: "✅" },
  { id: "create_checklist", label: "Create Checklist", icon: "📌" },
];

export default function AIWritingPage() {
  const { data: session, status } = useSession();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [tone, setTone] = useState("formal");
  const [practiceArea, setPracticeArea] = useState("");
  const [copied, setCopied] = useState(false);

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading...</p></div>;
  if (status === "unauthenticated") redirect("/login");
  if (!session) return null;

  const handleAction = async (actionId: string) => {
    if (!inputText.trim()) return;
    setSelectedAction(actionId);
    setLoading(true);
    setOutputText("");

    try {
      const service = getAIService();
      const result = await service.generateText({
        prompt: inputText,
        system: `Action: ${actionId}. Tone: ${tone}. Practice area: ${practiceArea || "General"}.`,
      });
      setOutputText(result);
    } catch {
      setOutputText("Error generating text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI Writing Assistant</h1>
        <p className="text-sm text-slate-500 mt-1">Draft, rewrite, and translate legal documents with AI assistance</p>
      </div>

      {/* AI Warning Banner */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">Attorney Review Required</p>
          <p className="text-xs text-amber-700">All AI-generated content must be reviewed by an attorney before being sent, filed, or relied upon. AI output does not constitute legal advice.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Actions Panel */}
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-sm">AI Actions</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleAction(action.id)}
                disabled={loading || !inputText.trim()}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedAction === action.id
                    ? "bg-accent-50 text-accent-700 border border-accent-200"
                    : "hover:bg-slate-50 text-slate-700 border border-transparent"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="mr-2">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Main Panel */}
        <div className="lg:col-span-3 space-y-4">
          {/* Controls */}
          <div className="flex gap-3">
            <Select
              label="Tone"
              options={[
                { value: "formal", label: "Formal Legal" },
                { value: "simple", label: "Simple/Plain" },
                { value: "professional", label: "Professional" },
                { value: "friendly", label: "Friendly" },
              ]}
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="flex-1"
            />
            <Select
              label="Practice Area"
              options={[
                { value: "", label: "General" },
                { value: "IMMIGRATION", label: "Immigration" },
                { value: "PERSONAL_INJURY", label: "Personal Injury" },
                { value: "FAMILY_LAW", label: "Family Law" },
                { value: "PROBATE_ESTATE_PLANNING", label: "Estate Planning" },
              ]}
              value={practiceArea}
              onChange={(e) => setPracticeArea(e.target.value)}
              className="flex-1"
            />
            <Select
              label="Language"
              options={[
                { value: "english", label: "English" },
                { value: "vietnamese", label: "Vietnamese" },
                { value: "chinese", label: "Chinese" },
                { value: "spanish", label: "Spanish" },
              ]}
              className="flex-1"
            />
          </div>

          {/* Input */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Input Text</CardTitle></CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter text to rewrite, translate, or use as the basis for drafting..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[150px]"
              />
            </CardContent>
          </Card>

          {/* Output */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bot size={16} className="text-accent-600" />
                  AI Output
                  {outputText && <Badge variant="status" status="PENDING_REVIEW">Pending Review</Badge>}
                </CardTitle>
                {outputText && (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="xs" onClick={handleCopy}>
                      <Copy size={14} /> {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button variant="ghost" size="xs"><Download size={14} /> Export</Button>
                    <Button variant="primary" size="xs"><Save size={14} /> Save</Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12 text-slate-400">
                  <RefreshCw size={24} className="animate-spin mr-3" />
                  Generating...
                </div>
              ) : outputText ? (
                <div className="relative">
                  <div className="p-4 rounded-lg bg-white border border-slate-200 whitespace-pre-wrap text-sm text-slate-700 min-h-[150px]">
                    {outputText}
                  </div>
                  <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <p className="text-xs text-amber-700 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      AI-Generated Content — Must be reviewed by an attorney before use
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <Bot size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Select an action above to generate content</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
