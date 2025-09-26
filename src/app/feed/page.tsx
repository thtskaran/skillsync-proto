"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Download,
  CalendarRange,
  MapPin,
  Link as LinkIcon,
  Briefcase,
  ExternalLink,
  Banknote,
} from "lucide-react";

// Types mapped from JSON
type Opportunity = {
  title: string;
  link: string;
  logo: string | null;
  description: string;
  deadline: string;
  location: string;
  pay: string;
  category: "Internship" | "Job" | string;
};
type FeedData = {
  indian_opportunities: Opportunity[];
  international_opportunities: Opportunity[];
  metadata?: {
    last_updated?: string;
    total_opportunities?: number;
    indian_opportunities?: number;
    international_opportunities?: number;
    source?: string;
  };
};

function parseDeadline(d: string): number {
  // Try parsing common formats; fallback to Infinity so they go to the end
  const tryDate = Date.parse(d);
  return Number.isNaN(tryDate) ? Number.POSITIVE_INFINITY : tryDate;
}

function exportCSV(rows: Opportunity[]) {
  const header = ["Title", "Category", "Source", "Location", "Deadline", "Pay", "Link"];
  const csvRows = rows.map((o: any) => [
    `"${o.title.replace(/"/g, '""')}"`,
    o.category,
    o.__source,
    `"${o.location?.replace(/"/g, '""') || ""}"`,
    `"${o.deadline?.replace(/"/g, '""') || ""}"`,
    `"${o.pay?.replace(/"/g, '""') || ""}"`,
    o.link,
  ]);
  const csv = [header, ...csvRows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "opportunities-feed.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// NEW: helpers to convert pay to INR with muted display
const FX_RATES = {
  USD: 83,   // static snapshot
  EUR: 90,
  GBP: 105,
};
function formatINR(n: number) {
  return "₹" + new Intl.NumberFormat("en-IN").format(Math.round(n));
}
function toINR(pay: string | undefined | null): string | null {
  if (!pay) return null;
  // If no numeric info, keep as-is (e.g., "Competitive stipend", "Free")
  const nums = pay.match(/[\d,.]+/g);
  if (!nums) return pay;

  const hasINR = /₹|INR/i.test(pay);
  const hasUSD = /\$|USD/i.test(pay);
  const hasEUR = /€|EUR/i.test(pay);
  const hasGBP = /£|GBP/i.test(pay);

  const unit = /month/i.test(pay)
    ? "month"
    : /(year|annum|annual)/i.test(pay)
    ? "year"
    : null;

  const rate = hasUSD ? FX_RATES.USD : hasEUR ? FX_RATES.EUR : hasGBP ? FX_RATES.GBP : 1;

  const values = nums
    .map((s) => parseFloat(s.replace(/,/g, "")))
    .filter((n) => Number.isFinite(n))
    .map((n) => (hasINR ? n : n * rate));

  if (!values.length) return pay;

  const display =
    values.length > 1
      ? `${formatINR(values[0])} - ${formatINR(values[values.length - 1])}`
      : formatINR(values[0]);

  return unit ? `${display}/${unit}` : display;
}

export default function OpportunitiesFeedPage() {
  const [data, setData] = React.useState<FeedData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  // UI state
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<"All" | "Internship" | "Job">("All");
  const [source, setSource] = React.useState<"All" | "India" | "International">("All");
  const [remoteOnly, setRemoteOnly] = React.useState(false);
  const [sortKey, setSortKey] = React.useState<"deadline" | "title">("deadline");

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Prefer co-located JSON import (works when JSON is inside app/feed)
        const mod: any = await import("./ict_internships_jobs_2025.json");
        if (mounted) setData((mod && (mod.default ?? mod)) as FeedData);
      } catch {
        try {
          // Fallback: HTTP fetch (works if JSON is placed under /public/feed/)
          const res = await fetch("/feed/ict_internships_jobs_2025.json", { cache: "no-store" });
          if (!res.ok) throw new Error(`Failed to load feed (${res.status})`);
          const j: FeedData = await res.json();
          if (mounted) setData(j);
        } catch (e: any) {
          if (mounted) setErr(e?.message || "Failed to load feed");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const allOps = React.useMemo(() => {
    if (!data) return [];
    const IN = data.indian_opportunities.map((o) => ({ ...o, __source: "India" as const }));
    const INTL = data.international_opportunities.map((o) => ({ ...o, __source: "International" as const }));
    return [...IN, ...INTL];
  }, [data]);

  const filtered = React.useMemo(() => {
    let rows = allOps;
    if (category !== "All") {
      rows = rows.filter((o) => (o.category || "").toLowerCase() === category.toLowerCase());
    }
    if (source !== "All") {
      rows = rows.filter((o: any) => o.__source === source);
    }
    if (remoteOnly) {
      rows = rows.filter((o) => /remote/i.test(o.location));
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          (o.description ?? "").toLowerCase().includes(q) ||
          (o.location ?? "").toLowerCase().includes(q)
      );
    }
    rows = [...rows].sort((a, b) => {
      if (sortKey === "deadline") {
        return parseDeadline(a.deadline) - parseDeadline(b.deadline);
      }
      // title
      return a.title.localeCompare(b.title);
    });
    return rows;
  }, [allOps, category, source, remoteOnly, query, sortKey]);

  const stats = React.useMemo(() => {
    const meta = data?.metadata;
    return {
      lastUpdated: meta?.last_updated || "",
      total: data ? data.indian_opportunities.length + data.international_opportunities.length : 0,
      inCount: data?.indian_opportunities.length || 0,
      intlCount: data?.international_opportunities.length || 0,
    };
  }, [data]);

  return (
    <div className="min-h-screen w-full bg-neutral-50">
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/90 border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
          {/* Muted header chip */}
         
          <h1 className="text-xl font-semibold tracking-tight">Skill Sync</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button
              className="rounded-xl"
              variant="outline"
              onClick={() => exportCSV(filtered as any)}
              disabled={loading || !filtered.length}
            >
              <Download className="size-4 mr-2" /> Export CSV
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Page title + stats */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Muted icon */}
              <Briefcase className="text-neutral-600" size={20} />
              <div className="text-lg font-semibold tracking-tight">Opportunities Feed</div>
            </div>
            {!loading && (
              <div className="text-xs text-neutral-500">
                Last updated: {stats.lastUpdated || "—"}
              </div>
            )}
          </div>
          {!loading && (
            <div className="flex flex-wrap gap-2 text-xs text-neutral-600">
              <Badge variant="outline" className="rounded-full">Total: {stats.total}</Badge>
              <Badge variant="outline" className="rounded-full">India: {stats.inCount}</Badge>
              <Badge variant="outline" className="rounded-full">International: {stats.intlCount}</Badge>
            </div>
          )}
        </div>

        {/* Controls */}
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  placeholder="Search title, description, or location..."
                  className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-300"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Filter size={18} className="text-neutral-500" />
                <select
                  className="rounded-md border border-neutral-200 bg-white px-2 py-2 text-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                >
                  <option value="All">All Categories</option>
                  <option value="Internship">Internships</option>
                  <option value="Job">Jobs</option>
                </select>
                <select
                  className="rounded-md border border-neutral-200 bg-white px-2 py-2 text-sm"
                  value={source}
                  onChange={(e) => setSource(e.target.value as any)}
                >
                  <option value="All">All Sources</option>
                  <option value="India">India</option>
                  <option value="International">International</option>
                </select>
                <label className="inline-flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-neutral-300"
                    checked={remoteOnly}
                    onChange={(e) => setRemoteOnly(e.target.checked)}
                  />
                  Remote only
                </label>
                <select
                  className="rounded-md border border-neutral-200 bg-white px-2 py-2 text-sm"
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as any)}
                >
                  <option value="deadline">Deadline (soonest)</option>
                  <option value="title">Title (A–Z)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {err && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {err}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-md bg-neutral-200 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-neutral-200 rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-neutral-200 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="mt-3 h-16 bg-neutral-100 rounded animate-pulse" />
                  <div className="mt-3 flex gap-2">
                    <div className="h-6 w-24 bg-neutral-200 rounded-full animate-pulse" />
                    <div className="h-6 w-20 bg-neutral-200 rounded-full animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="text-sm text-neutral-600">
              Showing {filtered.length} of {stats.total} opportunities
            </div>
            {filtered.length === 0 ? (
              <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-500">
                No opportunities match current filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((o, idx) => (
                  <Card key={idx} className="rounded-2xl">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* REMOVED: logos. Always show muted icon chip */}
                        <div className="h-10 w-10 grid place-items-center rounded-md bg-neutral-50 border text-neutral-500">
                          <Briefcase className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="truncate font-semibold">{o.title}</div>
                            <Badge variant="outline" className="rounded-full shrink-0">
                              {o.category || "N/A"}
                            </Badge>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-600">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="size-3.5" />
                              {o.location || "—"}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <CalendarRange className="size-3.5" />
                              {o.deadline || "—"}
                            </span>
                            {o.pay ? (
                              <span className="inline-flex items-center gap-1">
                                <Banknote className="size-3.5" />
                                {toINR(o.pay)}
                              </span>
                            ) : null}
                            <Badge variant="outline" className="rounded-full">{(o as any).__source}</Badge>
                          </div>
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-neutral-700 line-clamp-4">
                        {o.description}
                      </p>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <a href={o.link} target="_blank" rel="noreferrer">
                          <Button variant="secondary" className="rounded-lg">
                            Apply <ExternalLink className="size-4 ml-2" />
                          </Button>
                        </a>
                       
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
        {/* Footer spacer */}
        <div className="py-10" />
      </main>
    </div>
  );
}
