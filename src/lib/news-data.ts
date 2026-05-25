export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: "Policy Change" | "Form Update" | "Fee Change" | "Law Change" | "Processing Alert";
  summary: string;
  source: string;
  url: string;
}

export const IMMIGRATION_NEWS: NewsItem[] = [
  {
    id: "news-001",
    title: "USCIS Announces Fee Adjustment for Immigration Forms",
    date: "2026-04-01",
    category: "Fee Change",
    summary: "USCIS has published a final rule adjusting fees for several immigration forms including I-485, I-130, and N-400. The new fee schedule takes effect July 1, 2026.",
    source: "Federal Register / USCIS",
    url: "https://www.uscis.gov/newsroom/news-releases",
  },
  {
    id: "news-002",
    title: "Updated Form I-485 Released with Revised Edition Date",
    date: "2026-03-15",
    category: "Form Update",
    summary: "USCIS has released an updated edition of Form I-485 (Application to Register Permanent Residence or Adjust Status). The new edition dated 02/15/2026 must be used after June 15, 2026.",
    source: "USCIS Forms Page",
    url: "https://www.uscis.gov/i-485",
  },
  {
    id: "news-003",
    title: "Form I-765 Employment Authorization Interim Final Rule",
    date: "2026-02-28",
    category: "Policy Change",
    summary: "A new interim final rule extends automatic EAD renewal from 180 days to 540 days for certain renewal applicants filing Form I-765.",
    source: "DHS Press Office",
    url: "https://www.dhs.gov/news",
  },
  {
    id: "news-004",
    title: "Fee Waiver Expansion for Naturalization Applicants",
    date: "2026-02-10",
    category: "Policy Change",
    summary: "USCIS has expanded eligibility for fee waivers on Form N-400 naturalization applications, lowering the income threshold from 150% to 200% of the Federal Poverty Guidelines.",
    source: "USCIS Policy Manual Update",
    url: "https://www.uscis.gov/policy-manual",
  },
  {
    id: "news-005",
    title: "Processing Times Extended for Family-Based Green Cards",
    date: "2026-01-20",
    category: "Processing Alert",
    summary: "USCIS field offices report increased processing times for family-based I-485 applications, now averaging 14-18 months due to increased application volume.",
    source: "USCIS Processing Times Dashboard",
    url: "https://egov.uscis.gov/processing-times/",
  },
  {
    id: "news-006",
    title: "New Immigration Court Procedures Under EOIR",
    date: "2026-01-05",
    category: "Policy Change",
    summary: "The Executive Office for Immigration Review (EOIR) has implemented new case management procedures aimed at reducing the immigration court backlog, currently at 3.6 million pending cases.",
    source: "EOIR / Department of Justice",
    url: "https://www.justice.gov/eoir",
  },
  {
    id: "news-007",
    title: "INA § 212(h) Waiver Guidance Updated",
    date: "2025-12-15",
    category: "Law Change",
    summary: "USCIS issued updated policy guidance on INA § 212(h) waivers for certain criminal grounds of inadmissibility, clarifying the 'extreme hardship' standard for qualifying relatives.",
    source: "USCIS Policy Alert",
    url: "https://www.uscis.gov/policy-manual",
  },
  {
    id: "news-008",
    title: "Form I-131 Travel Document Processing Moves to Lockbox",
    date: "2025-12-01",
    category: "Processing Alert",
    summary: "USCIS has moved Form I-131 application filing for Advance Parole and Reentry Permits to designated lockbox facilities. Paper-filed applications must now be sent to the correct lockbox based on eligibility category.",
    source: "USCIS Alert",
    url: "https://www.uscis.gov/i-131",
  },
  {
    id: "news-009",
    title: "USCIS Modernization: Online Filing Expanded to I-130",
    date: "2025-11-10",
    category: "Form Update",
    summary: "USCIS has expanded online filing capabilities to include Form I-130, Petition for Alien Relative. Petitioners can now file, pay fees, and track case status through their USCIS online account.",
    source: "USCIS Online Filing",
    url: "https://www.uscis.gov/file-online",
  },
  {
    id: "news-010",
    title: "DS-260 Processing Updated for Diversity Visa 2027",
    date: "2025-10-25",
    category: "Processing Alert",
    summary: "The Department of State has updated DS-260 processing procedures for DV-2027 selectees, including new document submission requirements and interview scheduling protocols.",
    source: "Department of State / Travel.state.gov",
    url: "https://travel.state.gov/content/travel/en/us-visas/immigrate/diversity-visa-program.html",
  },
  {
    id: "news-011",
    title: "Public Charge Rule Finalized: INA § 212(a)(4)",
    date: "2025-10-01",
    category: "Law Change",
    summary: "DHS has published the final public charge rule clarifying which benefits are considered in inadmissibility determinations under INA § 212(a)(4). The rule provides greater clarity for family-based adjustment applicants.",
    source: "Federal Register / DHS",
    url: "https://www.uscis.gov/public-charge",
  },
  {
    id: "news-012",
    title: "New Edition of Form I-864 Published",
    date: "2025-09-15",
    category: "Form Update",
    summary: "USCIS has published a new edition of Form I-864 (Affidavit of Support) with updated income threshold requirements based on 2025 HHS Poverty Guidelines.",
    source: "USCIS Forms Page",
    url: "https://www.uscis.gov/i-864",
  },
];
