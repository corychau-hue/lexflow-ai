export interface LiveUpdateItem {
  id: string;
  title: string;
  date: string;
  category: "Policy Change" | "Form Update" | "Fee Change" | "Law Change" | "Processing Alert" | "USCIS Alert" | "Federal Register";
  summary: string;
  source: string;
  url: string;
  formType?: string | null;
}

/* ------------------------------------------------------------------ */
/*  Parse RSS XML (no external deps)                                    */
/* ------------------------------------------------------------------ */
function parseRSS(xml: string, sourceLabel: string, defaultCategory: LiveUpdateItem["category"]): LiveUpdateItem[] {
  const items: LiveUpdateItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = extractTag(block, "title");
    const link = extractTag(block, "link");
    const desc = extractTag(block, "description");
    const pubDate = extractTag(block, "pubDate");
    const guid = extractTag(block, "guid") || link;

    if (!title) continue;

    // Categorize based on keywords
    const category = categorizeItem(title, desc);

    items.push({
      id: `fr:${guid.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 40)}`,
      title: decodeHtmlEntities(title),
      date: pubDate ? new Date(pubDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      category,
      summary: desc ? decodeHtmlEntities(desc.replace(/<[^>]+>/g, "")).slice(0, 500) : "",
      source: sourceLabel,
      url: link || "",
    });
  }
  return items;
}

function extractTag(block: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
  const m = regex.exec(block);
  return (m && (m[1] || m[2] || "").trim()) || "";
}

function categorizeItem(title: string, desc: string): LiveUpdateItem["category"] {
  const text = `${title} ${desc}`.toUpperCase();
  if (/\bFEE\b|\bPRICING\b|\bCOST\b/.test(text)) return "Fee Change";
  if (/\bFORM\b|\bEDITION\b|\bNEW\s+VERSION\b|\bREVISED\b|\bONLINE FILING\b/.test(text)) return "Form Update";
  if (/\bLAW\b|\bLEGISLATION\b|\bACT\b|\bBILL\b|\bSTATUTE\b|\bPUBLIC LAW\b/.test(text)) return "Law Change";
  if (/\bPROCESSING\b|\bDELAY\b|\bTIMEFRAME\b|\bBACKLOG\b|\bTIMELINE\b/.test(text)) return "Processing Alert";
  if (/\bPOLICY\b|\bGUIDANCE\b|\bRULE\b|\bREGULATION\b|\bMEMO\b/.test(text)) return "Policy Change";
  return "USCIS Alert";
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ------------------------------------------------------------------ */
/*  Form type detection — extract form numbers from titles             */
/* ------------------------------------------------------------------ */
const FORM_PATTERNS: { pattern: RegExp; formType: string }[] = [
  { pattern: /\bI-?485\b/i, formType: "I-485" },
  { pattern: /\bI-?130\b/i, formType: "I-130" },
  { pattern: /\bI-?130A\b/i, formType: "I-130A" },
  { pattern: /\bI-?765\b/i, formType: "I-765" },
  { pattern: /\bI-?131\b/i, formType: "I-131" },
  { pattern: /\bI-?864\b/i, formType: "I-864" },
  { pattern: /\bDS-?260\b/i, formType: "DS-260" },
  { pattern: /\bN-?400\b/i, formType: "N-400" },
  { pattern: /\bI-?907\b/i, formType: "I-907" },
  { pattern: /\bI-?601\b/i, formType: "I-601" },
  { pattern: /\bI-?589\b/i, formType: "I-589" },
  { pattern: /\bI-?751\b/i, formType: "I-751" },
  { pattern: /\bI-?129\b/i, formType: "I-129" },
  { pattern: /\bI-?140\b/i, formType: "I-140" },
  { pattern: /\bI-?212\b/i, formType: "I-212" },
  { pattern: /\bI-?290B\b/i, formType: "I-290B" },
  { pattern: /\bI-?601A\b/i, formType: "I-601A" },
  { pattern: /\bI-?824\b/i, formType: "I-824" },
  { pattern: /\bI-?912\b/i, formType: "I-912" },
];

function detectFormType(title: string, summary: string): string | null {
  const text = `${title} ${summary}`;
  for (const { pattern, formType } of FORM_PATTERNS) {
    if (pattern.test(text)) return formType;
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  DB persistence — cache live updates in PostgreSQL                  */
/* ------------------------------------------------------------------ */
async function getPrisma() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

export async function saveUpdatesToDb(items: LiveUpdateItem[]): Promise<void> {
  try {
    const prisma = await getPrisma();
    let saved = 0;
    for (const item of items) {
      const existing = await prisma.immigrationUpdate.findFirst({
        where: { url: item.url },
      });
      if (existing) continue;
      await prisma.immigrationUpdate.create({
        data: {
          id: item.id,
          title: item.title,
          date: new Date(item.date),
          category: item.category,
          summary: item.summary,
          source: item.source,
          url: item.url,
          formType: item.formType || null,
        },
      });
      saved++;
    }
    if (saved > 0) console.log(`Saved ${saved} new immigration updates to DB`);
  } catch (err) {
    console.error("Failed to save updates to DB:", err);
  }
}

export async function loadUpdatesFromDb(limit = 50): Promise<LiveUpdateItem[]> {
  try {
    const prisma = await getPrisma();
    const rows = await prisma.immigrationUpdate.findMany({
      orderBy: { date: "desc" },
      take: limit,
    });
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      date: r.date.toISOString().split("T")[0],
      category: r.category as LiveUpdateItem["category"],
      summary: r.summary,
      source: r.source,
      url: r.url,
      formType: r.formType,
    }));
  } catch (err) {
    console.error("Failed to load updates from DB:", err);
    return [];
  }
}

/* ------------------------------------------------------------------ */
/*  Fetch USCIS Alerts RSS Feed                                        */
/* ------------------------------------------------------------------ */
export async function fetchUSCISAlerts(): Promise<LiveUpdateItem[]> {
  try {
    const res = await fetch("https://www.uscis.gov/news/rss-feed/22984", {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LexFlowAI/1.0; +https://lexflow.app)" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    return parseRSS(xml, "USCIS Alerts", "USCIS Alert");
  } catch (err) {
    console.error("Failed to fetch USCIS alerts:", err);
    return [];
  }
}

/* ------------------------------------------------------------------ */
/*  Fetch USCIS News Releases RSS Feed                                 */
/* ------------------------------------------------------------------ */
export async function fetchUSCISNewsReleases(): Promise<LiveUpdateItem[]> {
  try {
    const res = await fetch("https://www.uscis.gov/news/rss-feed/23269", {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LexFlowAI/1.0; +https://lexflow.app)" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    return parseRSS(xml, "USCIS News", "Policy Change");
  } catch (err) {
    console.error("Failed to fetch USCIS news releases:", err);
    return [];
  }
}

/* ------------------------------------------------------------------ */
/*  Fetch USCIS Forms Updates RSS Feed (if available)                  */
/* ------------------------------------------------------------------ */
export async function fetchUSCISFormsUpdates(): Promise<LiveUpdateItem[]> {
  // Try known forms update RSS feed IDs
  const feedIds = ["23321", "23015", "22845"];
  const results: LiveUpdateItem[] = [];

  for (const feedId of feedIds) {
    try {
      const res = await fetch(`https://www.uscis.gov/news/rss-feed/${feedId}`, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; LexFlowAI/1.0; +https://lexflow.app)" },
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) {
        const xml = await res.text();
        const items = parseRSS(xml, "USCIS Forms", "Form Update");
        results.push(...items);
      }
    } catch {
      // Feed may not exist, skip
    }
  }
  return results;
}

/* ------------------------------------------------------------------ */
/*  Fetch Federal Register articles about USCIS                         */
/* ------------------------------------------------------------------ */
export async function fetchFederalRegisterUpdates(): Promise<LiveUpdateItem[]> {
  try {
    const res = await fetch(
      "https://www.federalregister.gov/api/v1/articles.json?conditions%5Bagency_ids%5D%5B%5D=499&per_page=15&order=newest",
      { signal: AbortSignal.timeout(15000) }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const results = data.results || [];

    return results.map((a: any) => ({
      id: `fedreg:${a.document_number}`,
      title: a.title || "Untitled",
      date: a.publication_date || new Date().toISOString().split("T")[0],
      category: categorizeItem(a.title || "", a.abstract || ""),
      summary: (a.abstract || "").slice(0, 500),
      source: "Federal Register / USCIS",
      url: a.html_url || `https://www.federalregister.gov/documents/${a.document_number}`,
      formType: detectFormType(a.title || "", a.abstract || ""),
    }));
  } catch (err) {
    console.error("Failed to fetch Federal Register updates:", err);
    return [];
  }
}

/* ------------------------------------------------------------------ */
/*  Fetch all live updates, deduplicated and sorted by date             */
/* ------------------------------------------------------------------ */
export async function fetchAllLiveUpdates(): Promise<{
  items: LiveUpdateItem[];
  fetchedAt: string;
  sourceStatus: Record<string, "ok" | "error">;
}> {
  const [alerts, newsReleases, formsUpdates, fedReg] = await Promise.allSettled([
    fetchUSCISAlerts(),
    fetchUSCISNewsReleases(),
    fetchUSCISFormsUpdates(),
    fetchFederalRegisterUpdates(),
  ]);

  const allAlerts = alerts.status === "fulfilled" ? alerts.value : [];
  const allNews = newsReleases.status === "fulfilled" ? newsReleases.value : [];
  const allForms = formsUpdates.status === "fulfilled" ? formsUpdates.value : [];
  const allFedReg = fedReg.status === "fulfilled" ? fedReg.value : [];

  // Assign formType to RSS items too
  for (const item of [...allAlerts, ...allNews, ...allForms]) {
    if (!item.formType) item.formType = detectFormType(item.title, item.summary);
  }

  // Deduplicate by title similarity
  const seen = new Set<string>();
  const all = [...allAlerts, ...allNews, ...allForms, ...allFedReg].filter((item) => {
    const key = item.title.toLowerCase().slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by date descending
  all.sort((a, b) => b.date.localeCompare(a.date));

  // Persist to DB (fire-and-forget, don't block response)
  saveUpdatesToDb(all).catch(() => {});

  return {
    items: all,
    fetchedAt: new Date().toISOString(),
    sourceStatus: {
      "USCIS Alerts": allAlerts.length > 0 ? "ok" : "error",
      "USCIS News": allNews.length > 0 ? "ok" : "error",
      "USCIS Forms": allForms.length > 0 ? "ok" : "error",
      "Federal Register": allFedReg.length > 0 ? "ok" : "error",
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Fetch and cache — try live, fall back to DB cache                  */
/* ------------------------------------------------------------------ */
export async function fetchWithCacheFallback(): Promise<{
  items: LiveUpdateItem[];
  fetchedAt: string;
  sourceStatus: Record<string, "ok" | "error">;
  fromCache: boolean;
}> {
  try {
    const live = await fetchAllLiveUpdates();
    if (live.items.length > 0) {
      return { ...live, fromCache: false };
    }
    // Live returned nothing — fall back to DB
    const cached = await loadUpdatesFromDb();
    return {
      items: cached,
      fetchedAt: new Date().toISOString(),
      sourceStatus: {},
      fromCache: true,
    };
  } catch (err) {
    console.error("Live fetch failed, falling back to DB cache:", err);
    const cached = await loadUpdatesFromDb();
    return {
      items: cached,
      fetchedAt: new Date().toISOString(),
      sourceStatus: {},
      fromCache: true,
    };
  }
}
