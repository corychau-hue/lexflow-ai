"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Calendar, Tag, ChevronDown, ChevronUp, Newspaper, RefreshCw, Wifi, WifiOff, Loader2, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { IMMIGRATION_NEWS, NewsItem } from "@/lib/news-data";

interface LiveItem {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  source: string;
  url: string;
  formType?: string | null;
}

type MergedItem = (NewsItem | LiveItem) & { _isLive?: boolean; formType?: string | null };

const categories = ["All", "Policy Change", "Form Update", "Fee Change", "Law Change", "Processing Alert", "USCIS Alert", "Federal Register"];

function SourceIndicator({ name, status }: { name: string; status: "ok" | "error" | "loading" }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${
      status === "ok" ? "text-green-700 border-green-300 bg-green-50" :
      status === "error" ? "text-red-700 border-red-300 bg-red-50" :
      "text-slate-500 border-slate-200 bg-slate-50"
    }`}>
      {status === "ok" ? <Wifi size={10} /> : status === "error" ? <WifiOff size={10} /> : <Loader2 size={10} className="animate-spin" />}
      {name}
    </span>
  );
}

function NewsCard({ item, isLive }: { item: MergedItem; isLive?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card className={`hover:border-accent-300 transition-colors ${isLive ? "border-l-2 border-l-accent-400" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar size={12} />
                {new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-accent-50 text-accent-700 border border-accent-200">
                {item.category}
              </span>
              {isLive && (
                <span className="text-[9px] font-medium px-1 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">
                  LIVE
                </span>
              )}
              {item.formType && (
                <span className="text-[9px] font-mono font-medium px-1 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {item.formType}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-slate-800 text-sm mb-1">{item.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {expanded ? item.summary : item.summary.length > 120 ? `${item.summary.slice(0, 120)}...` : item.summary}
            </p>
            {item.summary.length > 120 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-accent-600 hover:text-accent-700 flex items-center gap-0.5 mt-1"
              >
                {expanded ? <>Show less <ChevronUp size={12} /></> : <>Read more <ChevronDown size={12} /></>}
              </button>
            )}
          </div>
          {'url' in item && item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-slate-400 hover:text-accent-600 transition-colors mt-1"
              title="Open source"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1">
          <Tag size={10} className="text-slate-400" />
          <span className="text-[10px] text-slate-400">{item.source}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ImmigrationNewsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [liveItems, setLiveItems] = useState<LiveItem[]>([]);
  const [sourceStatus, setSourceStatus] = useState<Record<string, "ok" | "error" | "loading">>({});
  const [fetching, setFetching] = useState(false);
  const [lastFetched, setLastFetched] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const fetchLiveUpdates = async () => {
    setFetching(true);
    setSourceStatus({ "USCIS Alerts": "loading", "USCIS News": "loading", "Federal Register": "loading" });
    try {
      const res = await fetch("/api/immigration/updates");
      const data = await res.json();
      if (data.success) {
        setLiveItems(data.items || []);
        setSourceStatus(data.sourceStatus || {});
        setFromCache(data.fromCache || false);
        setLastFetched(new Date().toLocaleTimeString());
      }
    } catch {
      setSourceStatus({ "USCIS Alerts": "error", "USCIS News": "error", "Federal Register": "error" });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchLiveUpdates();
  }, []);

  // Merge live items with static news, dedup by title
  const allItems: MergedItem[] = (() => {
    const merged: MergedItem[] = [...IMMIGRATION_NEWS];
    const staticTitles = new Set(merged.map((i) => i.title.toLowerCase().slice(0, 60)));
    for (const live of liveItems) {
      if (!staticTitles.has(live.title.toLowerCase().slice(0, 60))) {
        merged.push({ ...live, _isLive: true });
      }
    }
    return merged;
  })();

  // Sort by date descending
  allItems.sort((a, b) => b.date.localeCompare(a.date));

  const filteredItems = activeCategory === "All"
    ? allItems
    : allItems.filter((item) => item.category === activeCategory);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Newspaper size={24} className="text-accent-600" />
            Immigration News & Updates
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Live feeds from USCIS, Federal Register, plus curated immigration news.
          </p>
        </div>
        <button
          onClick={fetchLiveUpdates}
          disabled={fetching}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 bg-white text-slate-600 hover:border-accent-300 hover:text-accent-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={13} className={fetching ? "animate-spin" : ""} />
          {fetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Source Status Indicators */}
      <div className="flex flex-wrap items-center gap-2">
        <SourceIndicator name="USCIS Alerts" status={sourceStatus["USCIS Alerts"] || "loading"} />
        <SourceIndicator name="USCIS News" status={sourceStatus["USCIS News"] || "loading"} />
        <SourceIndicator name="Federal Register" status={sourceStatus["Federal Register"] || "loading"} />
        {lastFetched && (
          <span className="text-[10px] text-slate-400 ml-1">Last updated: {lastFetched}</span>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              activeCategory === cat
                ? "bg-accent-600 text-white border-accent-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-accent-300 hover:text-accent-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Live Feed Notice */}
      {liveItems.length > 0 && (
        <div className={`p-2 rounded-lg border flex items-center gap-2 ${fromCache ? "bg-sky-50 border-sky-200" : "bg-green-50 border-green-200"}`}>
          {fromCache ? <Database size={14} className="text-sky-600" /> : <Wifi size={14} className="text-green-600" />}
          <p className={`text-xs ${fromCache ? "text-sky-700" : "text-green-700"}`}>
            {fromCache
              ? `Showing ${liveItems.length} cached updates from previous fetches. Live feeds temporarily unavailable.`
              : `Connected to USCIS and Federal Register live feeds. Showing ${liveItems.length} recent live updates alongside curated news.`
            }
          </p>
        </div>
      )}
      {liveItems.length === 0 && !fetching && (
        <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 flex items-center gap-2">
          <WifiOff size={14} className="text-amber-500" />
          <p className="text-xs text-amber-700">
            Live feeds unavailable. Showing curated news data. Click Refresh to try again.
          </p>
        </div>
      )}

      {/* News List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-slate-500">
              <p className="text-sm">No news items found for this category.</p>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map((item) => (
            <NewsCard key={item.id} item={item} isLive={(item as any)._isLive} />
          ))
        )}
      </div>

      {/* Disclaimer */}
      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
        <p className="text-xs text-amber-700">
          Live data sourced from <strong>USCIS.gov RSS feeds</strong> and the <strong>Federal Register API</strong>.
          Curated news provides additional context. This section is for informational purposes only and does not
          constitute legal advice. Always verify current form editions, fees, and requirements on the
          official USCIS website before filing.
        </p>
      </div>
    </div>
  );
}
