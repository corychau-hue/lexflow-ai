"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Languages, ArrowRightLeft, Save, Copy, AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea, Select } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getAIService } from "@/lib/ai-service";

const languagePairs = [
  { value: "en-vi", label: "English → Vietnamese", source: "ENGLISH", target: "VIETNAMESE" },
  { value: "vi-en", label: "Vietnamese → English", source: "VIETNAMESE", target: "ENGLISH" },
  { value: "en-zh", label: "English → Chinese", source: "ENGLISH", target: "CHINESE" },
  { value: "zh-en", label: "Chinese → English", source: "CHINESE", target: "ENGLISH" },
  { value: "en-es", label: "English → Spanish", source: "ENGLISH", target: "SPANISH" },
  { value: "es-en", label: "Spanish → English", source: "SPANISH", target: "ENGLISH" },
];

export default function TranslationPage() {
  const { data: session, status } = useSession();
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [langPair, setLangPair] = useState("en-vi");
  const [mode, setMode] = useState("plain");
  const [copied, setCopied] = useState(false);

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading...</p></div>;
  if (status === "unauthenticated") redirect("/login");
  if (!session) return null;

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setLoading(true);
    setTranslatedText("");

    try {
      const service = getAIService();
      const pair = languagePairs.find((p) => p.value === langPair)!;
      const result = await service.translate({
        text: sourceText,
        sourceLang: pair.source,
        targetLang: pair.target,
        mode: mode as "plain" | "legal",
      });
      setTranslatedText(result);
    } catch {
      setTranslatedText("Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Translation Center</h1>
        <p className="text-sm text-slate-500 mt-1">Translate legal communications between English, Vietnamese, Chinese, and Spanish</p>
      </div>

      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">Translation Must Be Reviewed</p>
          <p className="text-xs text-amber-700">AI-generated translations must be reviewed by a qualified translator or attorney before sending or filing. Legal accuracy is critical.</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Select
          label="Language Pair"
          options={languagePairs}
          value={langPair}
          onChange={(e) => setLangPair(e.target.value)}
          className="w-64"
        />
        <Select
          label="Mode"
          options={[
            { value: "plain", label: "Plain Language" },
            { value: "legal", label: "Formal Legal" },
          ]}
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-40"
        />
        <div className="pt-5">
          <Button variant="primary" onClick={handleTranslate} disabled={loading || !sourceText.trim()}>
            {loading ? <><RefreshCw size={16} className="animate-spin" /> Translating...</> : <><ArrowRightLeft size={16} /> Translate</>}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">Source Text</CardTitle></CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter text to translate..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="min-h-[250px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Languages size={16} className="text-accent-600" />
                Translation
                {translatedText && <Badge variant="status" status="PENDING_REVIEW">Review Required</Badge>}
              </CardTitle>
              {translatedText && (
                <div className="flex gap-2">
                  <Button variant="ghost" size="xs" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</Button>
                  <Button variant="primary" size="xs"><Save size={14} /> Save</Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-16 text-slate-400">
                <RefreshCw size={24} className="animate-spin mr-3" />
                Translating...
              </div>
            ) : translatedText ? (
              <div>
                <div className="p-4 rounded-lg bg-white border border-slate-200 whitespace-pre-wrap text-sm text-slate-700 min-h-[250px]">
                  {translatedText}
                </div>
                <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs text-amber-700 flex items-center gap-1">
                    <AlertTriangle size={12} />
                    AI-Generated Translation — Must be reviewed before use
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400">
                <Languages size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Translation will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
