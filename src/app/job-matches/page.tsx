"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  ArrowUpDown,
  BadgeInfo,
  Bookmark,
  Briefcase,
  Building2,
  ChevronDown,
  Filter,
  LayoutGrid,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  CheckCircle,
  Clock3,
  DollarSign,
  ExternalLink,
} from "lucide-react";
import MatchBadge from "@/components/MatchBadge";
import JobDetailsModal, { type JobListing } from "@/components/JobDetailsModal";
import { fetchJobs } from "@/lib/api";

const ENABLE_DEV_PANEL = process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_ENABLE_DEV_PANEL !== "false";

const RAW_JOBS: JobListing[] = [
  {
    id: "job-1",
    title: ".NET Developer",
    company: "JobRaaI Labs",
    location: "Remote · India",
    salary: "₹12L – ₹18L",
    posted: "2 days ago",
    postedAt: "2026-05-25T10:00:00.000Z",
    match: 96,
    confidence: 93,
    remote: true,
    type: "Full-time",
    experience: "Senior",
    companySize: "51-200 employees",
    description: "Build modern ATS and workflow features for a fast-moving talent intelligence platform.",
    skills: ["C#", ".NET", "ASP.NET", "SQL Server", "Azure", "Entity Framework"],
    matchedSkills: ["C#", ".NET", "ASP.NET", "SQL Server", "Azure"],
    missingSkills: ["Distributed systems", "GraphQL"],
    benefits: ["Remote-first", "Flexible hours", "Learning budget"],
    matchNote: "Strong full-stack backend alignment with your current resume and ATS-friendly experience.",
    apply_url: "https://jobs.jobraai.example/apply/job-1",
  },
  {
    id: "job-2",
    title: "Account Executive",
    company: "GrowthLoop",
    location: "Hybrid · Bengaluru",
    salary: "₹10L – ₹16L",
    posted: "1 day ago",
    postedAt: "2026-05-26T09:30:00.000Z",
    match: 84,
    confidence: 80,
    remote: false,
    type: "Full-time",
    experience: "Mid to Senior",
    companySize: "201-500 employees",
    description: "Own strategic client relationships and drive pipeline growth across enterprise accounts.",
    skills: ["Sales", "Negotiation", "CRM", "Prospecting", "Pipeline", "Closing"],
    matchedSkills: ["Sales", "Negotiation", "CRM", "Pipeline"],
    missingSkills: ["Enterprise SaaS", "Forecasting"],
    benefits: ["Performance bonus", "Travel allowance", "Health cover"],
    matchNote: "Matches your communication, persuasion, and relationship-building signals.",
    apply_url: "https://jobs.growthloop.example/apply/job-2",
  },
  {
    id: "job-3",
    title: "Product Designer",
    company: "PixelForge",
    location: "San Francisco, CA",
    salary: "$120k – $160k",
    posted: "4 days ago",
    postedAt: "2026-05-23T08:00:00.000Z",
    match: 92,
    confidence: 91,
    remote: true,
    type: "Contract",
    experience: "Senior",
    companySize: "11-50 employees",
    description: "Design thoughtful product experiences for a new AI workflow suite.",
    skills: ["Figma", "Design Systems", "Prototyping", "User Research"],
    matchedSkills: ["Figma", "Design Systems", "Prototyping"],
    missingSkills: ["Motion design"],
    benefits: ["Remote flexibility", "Fast iteration", "High ownership"],
    matchNote: "Excellent fit for design systems work and rapid product prototyping.",
    apply_url: "https://jobs.pixelforge.example/apply/job-3",
  },
  {
    id: "job-4",
    title: "Full Stack Engineer",
    company: "Nimbus Apps",
    location: "Remote · Global",
    salary: "$130k – $180k",
    posted: "Today",
    postedAt: "2026-05-27T06:00:00.000Z",
    match: 88,
    confidence: 86,
    remote: true,
    type: "Full-time",
    experience: "Senior",
    companySize: "51-200 employees",
    description: "Ship features across React, TypeScript, and Node in a product-led SaaS team.",
    skills: ["React", "TypeScript", "Node.js", "APIs", "Testing"],
    matchedSkills: ["React", "TypeScript", "APIs"],
    missingSkills: ["System design", "Performance tuning"],
    benefits: ["Home office stipend", "Async culture", "Open source time"],
    matchNote: "Good match for modern frontend and API-heavy product work.",
    apply_url: "https://jobs.nimbus.example/apply/job-4",
  },
  {
    id: "job-5",
    title: "Growth Marketing Manager",
    company: "Northstar AI",
    location: "Mumbai, India",
    salary: "₹18L – ₹24L",
    posted: "6 days ago",
    postedAt: "2026-05-21T09:00:00.000Z",
    match: 79,
    confidence: 76,
    remote: false,
    type: "Full-time",
    experience: "Mid-level",
    companySize: "51-200 employees",
    description: "Own acquisition experiments, campaigns, and conversion funnels for a growing AI business.",
    skills: ["Performance Marketing", "Analytics", "Experimentation", "Funnels"],
    matchedSkills: ["Analytics", "Experimentation"],
    missingSkills: ["Paid search", "Attribution"],
    benefits: ["ESOPs", "Growth team", "Fast promotions"],
    matchNote: "A partial match based on analytical and growth experimentation experience.",
    apply_url: "https://jobs.northstar.example/apply/job-5",
  },
  {
    id: "job-6",
    title: "AI Solutions Consultant",
    company: "VectorWorks",
    location: "Remote · APAC",
    salary: "$100k – $145k",
    posted: "3 days ago",
    postedAt: "2026-05-24T13:00:00.000Z",
    match: 90,
    confidence: 89,
    remote: true,
    type: "Full-time",
    experience: "Senior",
    companySize: "201-500 employees",
    description: "Bridge customer needs with AI product strategy, demos, and technical discovery.",
    skills: ["Discovery", "Solution Design", "Stakeholder Mgmt", "AI Strategy"],
    matchedSkills: ["Discovery", "Solution Design", "AI Strategy"],
    missingSkills: ["Enterprise security"],
    benefits: ["Global team", "Bonus plan", "Travel-friendly"],
    matchNote: "High-confidence match for consultative, customer-facing, and strategic roles.",
    apply_url: "https://jobs.vectorworks.example/apply/job-6",
  },
];

const DEFAULT_FILTERS = ["All Matches", "90%+ Match", "Remote Only", "Senior Level", "Recently Posted"] as const;
const SORT_OPTIONS = [
  { value: "best_match", label: "Best match" },
  { value: "recent", label: "Newest first" },
  { value: "salary_high", label: "Salary high to low" },
] as const;

const STAT_ICONS = [Target, TrendingUp, Bookmark, CheckCircle] as const;

function normalizeJobs(jobs: JobListing[]): JobListing[] {
  return jobs
    .filter((job) => Boolean(job?.id) && Boolean(job?.title))
    .map((job) => ({
      ...job,
      company: job.company || "Unknown company",
      title: job.title || "Untitled role",
      skills: Array.isArray(job.skills) ? job.skills : [],
      matchedSkills: Array.isArray(job.matchedSkills) ? job.matchedSkills : [],
      missingSkills: Array.isArray(job.missingSkills) ? job.missingSkills : [],
      benefits: Array.isArray(job.benefits) ? job.benefits : [],
    }));
}

function parseSalaryValue(salary?: string) {
  if (!salary) return 0;
  const matches = salary.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/g);
  if (!matches?.length) return 0;
  const values = matches.map(Number).filter((n) => Number.isFinite(n));
  return Math.max(...values, 0);
}

function isRecentlyPosted(job: JobListing) {
  if (!job.postedAt) return /today|1 day|2 days/i.test(job.posted || "");
  const time = new Date(job.postedAt).getTime();
  return Number.isFinite(time) && Date.now() - time < 1000 * 60 * 60 * 24 * 7;
}

export default function JobMatchesPage() {
  const [jobs, setJobs] = useState<JobListing[]>(RAW_JOBS);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<(typeof DEFAULT_FILTERS)[number]>("All Matches");
  const [sortBy, setSortBy] = useState<(typeof SORT_OPTIONS)[number]["value"]>("best_match");
  const [activeTab, setActiveTab] = useState<"all" | "saved">("all");
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [showRawPanel, setShowRawPanel] = useState(false);
  const [rawJson, setRawJson] = useState("");
  const [rawError, setRawError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<"raw" | "api" | "live">("raw");

  useEffect(() => {
    const s = localStorage.getItem("saved_jobs");
    if (s) {
      try {
        const arr = JSON.parse(s) as string[];
        setSaved(new Set(arr));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const timer = window.setTimeout(() => {
      if (mounted) setLoading(false);
    }, 350);

    fetchJobs()
      .then((res) => {
        if (!mounted) return;
        if (res.jobs?.length) {
          setJobs(normalizeJobs(res.jobs as JobListing[]));
          setApiStatus("api");
        }
      })
      .catch(() => {
        if (!mounted) return;
        setApiStatus("raw");
      })
      .finally(() => {
        if (!mounted) return;
        window.clearTimeout(timer);
        setLoading(false);
      });

    return () => {
      mounted = false;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const arr = Array.from(saved);
    localStorage.setItem("saved_jobs", JSON.stringify(arr));
  }, [saved]);

  const visibleJobs = useMemo(() => {
    const q = search.trim().toLowerCase();

    let list = jobs.filter((job) => {
      const matchesSearch = !q || [job.title, job.company, job.location, job.description, ...(job.skills ?? [])].some((value) => String(value || "").toLowerCase().includes(q));
      const matchesSaved = activeTab === "saved" ? saved.has(job.id) : true;
      const matchesFilter =
        activeFilter === "All Matches"
          ? true
          : activeFilter === "90%+ Match"
            ? (job.match ?? 0) >= 90
            : activeFilter === "Remote Only"
              ? Boolean(job.remote)
              : activeFilter === "Senior Level"
                ? /senior|lead|manager/i.test(`${job.title} ${job.experience || ""}`)
                : isRecentlyPosted(job);

      return matchesSearch && matchesSaved && matchesFilter;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "recent") {
        const aTime = a.postedAt ? new Date(a.postedAt).getTime() : 0;
        const bTime = b.postedAt ? new Date(b.postedAt).getTime() : 0;
        return bTime - aTime;
      }

      if (sortBy === "salary_high") {
        return parseSalaryValue(b.salary) - parseSalaryValue(a.salary);
      }

      return (b.match ?? 0) - (a.match ?? 0);
    });

    return list;
  }, [jobs, saved, activeTab, activeFilter, search, sortBy]);

  const stats = useMemo(() => {
    const total = jobs.length;
    const highMatch = jobs.filter((job) => (job.match ?? 0) >= 90).length;
    const savedCount = saved.size;
    const liveCount = apiStatus === "api" ? jobs.length : RAW_JOBS.length;
    return [
      { label: "Total Matches", value: total || liveCount, icon: STAT_ICONS[0] },
      { label: "High Match (90%+)", value: highMatch, icon: STAT_ICONS[1] },
      { label: "Saved Jobs", value: savedCount, icon: STAT_ICONS[2] },
      { label: "Live Ready", value: apiStatus === "api" ? "API" : "Raw", icon: STAT_ICONS[3] },
    ];
  }, [apiStatus, jobs.length, saved.size]);

  const toggleSaved = (job: JobListing) => {
    setSaved((current) => {
      const next = new Set(current);
      if (next.has(job.id)) next.delete(job.id);
      else next.add(job.id);
      return next;
    });
  };

  const handleApply = (job: JobListing) => {
    setSelectedJob(job);
    // UI-only today; backend hook can be wired without changing the page structure.
  };

  const openJob = (job: JobListing) => {
    setSelectedJob(job);
  };

  const loadRawJson = (value: string) => {
    try {
      const parsed = JSON.parse(value || "[]");
      if (!Array.isArray(parsed)) throw new Error("JSON must be an array of job objects");
      setJobs(normalizeJobs(parsed as JobListing[]));
      setApiStatus("raw");
      setRawError(null);
    } catch (error) {
      setRawError(error instanceof Error ? error.message : String(error));
    }
  };

  const savedJobsCount = jobs.filter((job) => saved.has(job.id)).length;

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-muted-foreground/60 mb-2">✦ AI Job Matching</p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Your Job <span className="warm-text">Matches</span>
              </h1>
              <p className="text-[13px] text-muted-foreground mt-2 max-w-2xl">
                AI-curated opportunities that align with your skills and career goals. The page is raw-data-first now and ready to swap to live API data later.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[12px]">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${apiStatus === "api" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" : "bg-card text-muted-foreground border-border"}`}>
                <span className={`w-2 h-2 rounded-full ${apiStatus === "api" ? "bg-emerald-400" : "bg-primary/60"}`} />
                {apiStatus === "api" ? "API data ready" : "Raw data mode"}
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                {loading ? "Loading jobs" : `${visibleJobs.length} results`}
              </span>
            </div>
          </div>

          {ENABLE_DEV_PANEL && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button onClick={() => setShowRawPanel((current) => !current)} className="px-3.5 py-2 rounded-xl bg-card border border-border text-sm font-semibold hover:border-primary/30 transition-colors">
                Developer: {showRawPanel ? "Hide" : "Toggle"} Raw Data
              </button>
              <button
                onClick={() => {
                  const sample = JSON.stringify(RAW_JOBS, null, 2);
                  setRawJson(sample);
                  loadRawJson(sample);
                }}
                className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-[0_12px_28px_hsl(25_55%_58%/0.24)]"
              >
                Load Sample Data
              </button>
            </div>
          )}

          {ENABLE_DEV_PANEL && showRawPanel && (
            <div className="mt-4 bg-card border border-border rounded-3xl p-4 sm:p-5">
              <p className="text-sm font-semibold mb-2">Paste raw jobs JSON here. The UI will render it immediately.</p>
              <textarea
                value={rawJson}
                onChange={(event) => setRawJson(event.target.value)}
                placeholder='[ { "id": "1", "title": "..." } ]'
                className="w-full h-36 p-3 bg-bg rounded-2xl border border-border text-sm text-foreground resize-y focus:outline-none focus:border-primary/40"
              />
              {rawError && <div className="text-rose-400 text-sm mt-2">{rawError}</div>}
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => loadRawJson(rawJson)} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold">Load JSON</button>
                <button onClick={() => { setRawJson(""); setRawError(null); }} className="px-4 py-2 rounded-xl bg-card border border-border font-semibold">Clear</button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-3xl border border-border p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-primary tabular-nums">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-2xl font-semibold text-sm border transition-all ${activeTab === "all" ? "bg-primary text-primary-foreground border-primary shadow-[0_10px_24px_hsl(25_55%_58%/0.22)]" : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30"}`}
            >
              All Jobs
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-4 py-2 rounded-2xl font-semibold text-sm border transition-all ${activeTab === "saved" ? "bg-primary text-primary-foreground border-primary shadow-[0_10px_24px_hsl(25_55%_58%/0.22)]" : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30"}`}
            >
              Saved Jobs ({savedJobsCount})
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search jobs..."
                className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>
            <div className="relative w-full sm:w-52">
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
                className="w-full appearance-none pl-4 pr-10 py-2.5 bg-card border border-border rounded-2xl text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          {DEFAULT_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-[12px] font-semibold border transition-colors ${activeFilter === filter ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-card rounded-3xl border border-border p-5 sm:p-6 animate-pulse">
                <div className="flex flex-col gap-4 md:flex-row md:items-start">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/60" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-1/3 bg-secondary/60 rounded" />
                    <div className="h-3 w-1/4 bg-secondary/60 rounded" />
                    <div className="h-3 w-2/3 bg-secondary/60 rounded" />
                    <div className="flex flex-wrap gap-2 pt-2">
                      <div className="h-7 w-16 bg-secondary/60 rounded-full" />
                      <div className="h-7 w-20 bg-secondary/60 rounded-full" />
                      <div className="h-7 w-24 bg-secondary/60 rounded-full" />
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col gap-2 md:items-end">
                    <div className="h-11 w-28 bg-secondary/60 rounded-2xl" />
                    <div className="h-10 w-20 bg-secondary/60 rounded-2xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : visibleJobs.length === 0 ? (
          <div className="bg-card rounded-3xl border border-border p-10 sm:p-12 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <BadgeInfo className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">No jobs match your current view</h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Try clearing the filter, switching back to all jobs, or loading a different raw dataset. The modal and cards are ready for live API data when you connect it.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <button onClick={() => { setSearch(""); setActiveFilter("All Matches"); setActiveTab("all"); }} className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold">Clear filters</button>
              {ENABLE_DEV_PANEL && <button onClick={() => setShowRawPanel(true)} className="px-4 py-2.5 rounded-xl bg-card border border-border font-semibold">Edit raw data</button>}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleJobs.map((job) => {
              const avatarLetter = (job.company?.[0] || job.title?.[0] || "?").toUpperCase();
              const isSaved = saved.has(job.id);

              return (
                <article
                  key={job.id}
                  className="group bg-card rounded-[28px] border border-border p-5 sm:p-6 shadow-[0_10px_36px_rgba(0,0,0,0.12)] hover:border-primary/20 hover:shadow-[0_18px_46px_rgba(0,0,0,0.18)] transition-all"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => openJob(job)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          openJob(job);
                        }
                      }}
                      className="flex-1 text-left min-w-0 cursor-pointer"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-border flex items-center justify-center shrink-0 font-bold text-primary text-lg">
                          {avatarLetter}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start gap-3 mb-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-[16px] sm:text-[17px] font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                                {job.title}
                              </h3>
                              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-muted-foreground">
                                <span className="inline-flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" />{job.company}</span>
                                <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{job.location || "Location flexible"}</span>
                                <span className="inline-flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" />{job.salary || "Salary disclosed later"}</span>
                                <span className="inline-flex items-center gap-1.5"><Clock3 className="w-3.5 h-3.5" />{job.posted || "Recently posted"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            <MatchBadge match={job.match ?? 0} onClick={() => openJob(job)} />
                            {job.remote && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-secondary text-muted-foreground border border-border">Remote</span>}
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-card text-muted-foreground border border-border">
                              <Briefcase className="w-3 h-3" />{job.type || "Full-time"}
                            </span>
                          </div>

                          <p className="text-[13px] leading-7 text-muted-foreground line-clamp-2 sm:line-clamp-3">
                            {job.description || "This role is ready for real-time API data. For now it uses curated raw data so you can shape the UI quickly."}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {(job.skills ?? []).slice(0, 7).map((skill) => (
                              <span key={skill} className="px-3 py-1.5 rounded-full bg-secondary border border-border text-[12px] font-semibold text-muted-foreground">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2 sm:items-center lg:items-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (job.apply_url) {
                            window.open(job.apply_url, "_blank", "noopener,noreferrer");
                          } else {
                            openJob(job);
                          }
                        }}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground text-[13px] font-bold shadow-[0_12px_28px_hsl(25_55%_58%/0.24)] hover:opacity-95 transition-opacity"
                      >
                        Apply Now
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSaved(job)}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-border text-[13px] font-semibold bg-card hover:bg-secondary/60 transition-colors"
                        aria-pressed={isSaved}
                      >
                        {isSaved ? "Saved" : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => openJob(job)}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-border text-[13px] font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors inline-flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Why this match?
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <JobDetailsModal
          job={selectedJob}
          open={Boolean(selectedJob)}
          saved={selectedJob ? saved.has(selectedJob.id) : false}
          onClose={() => setSelectedJob(null)}
          onToggleSaved={toggleSaved}
          onApply={handleApply}
        />
      </div>
    </DashboardLayout>
  );
}