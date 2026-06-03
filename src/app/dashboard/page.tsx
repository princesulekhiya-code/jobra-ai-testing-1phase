"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  AlertCircle, CheckCircle, Zap, Sparkles, Loader2, Briefcase,
  TrendingUp, Award, Target, BarChart3, ArrowUpRight, RefreshCw,
  FileText, Brain, Wand2, ShieldCheck, Rocket, ArrowRight,
} from "lucide-react";
import { type ATSAnalysis, type UpgradeResult, toArray, upgradeResume } from "@/lib/api";

const improveSteps = [
  { icon: FileText,    label: "Reviewing your analysis",     sub: "Gathering scores, gaps & strengths…" },
  { icon: Brain,       label: "AI is rewriting content",     sub: "Optimising bullet points & keywords…" },
  { icon: Wand2,       label: "Enhancing formatting",        sub: "Improving structure & ATS readability…" },
  { icon: ShieldCheck, label: "Running quality checks",      sub: "Verifying improvements against benchmarks…" },
  { icon: Rocket,      label: "Finalising upgraded resume",  sub: "Almost there, preparing your new version…" },
];

function ImprovingOverlay() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const iv = setInterval(() => setStep((s) => (s < improveSteps.length - 1 ? s + 1 : s)), 2800);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const target = Math.min(((step + 1) / improveSteps.length) * 90, 90);
    const timer = setTimeout(() => setProgress(target), 150);
    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    const iv = setInterval(() => setDots((d) => (d.length >= 3 ? "" : d + ".")), 500);
    return () => clearInterval(iv);
  }, []);

  const current = improveSteps[step];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/[0.06] blur-[120px] animate-pulse-slow" />
        <div className="absolute top-1/4 right-1/4 w-[200px] h-[200px] rounded-full bg-primary/[0.04] blur-[80px] animate-float" />
      </div>

      <div className="relative w-full max-w-md mx-auto px-6">
        <div className="flex justify-center mb-10">
          <div className="relative w-28 h-28">
            <svg className="absolute inset-0 w-full h-full" style={{ animation: "spin 4s linear infinite" }} viewBox="0 0 112 112">
              <circle cx="56" cy="56" r="50" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
              <circle cx="56" cy="56" r="50" fill="none" stroke="hsl(var(--primary))" strokeWidth="3"
                strokeDasharray="80 234" strokeLinecap="round" />
            </svg>
            <svg className="absolute inset-0 w-full h-full" style={{ animation: "spin 6s linear infinite reverse" }} viewBox="0 0 112 112">
              <circle cx="56" cy="56" r="42" fill="none" stroke="hsl(var(--primary) / 0.2)" strokeWidth="1.5"
                strokeDasharray="30 233" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-3 rounded-full bg-primary/[0.05] border border-primary/15" style={{ animation: "glowPulse 2.5s ease-in-out infinite" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center shadow-[0_0_30px_hsl(25_55%_58%/0.15)]">
                <current.icon className="w-7 h-7 text-primary" />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-[22px] font-extrabold text-foreground mb-2 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            {current.label}{dots}
          </h2>
          <p className="text-[13px] text-foreground/70 font-medium">{current.sub}</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-[11px] font-semibold text-foreground/60 mb-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-primary" /> Improving Resume
            </span>
            <span className="tabular-nums">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg, hsl(var(--warm-dim)), hsl(var(--primary)), hsl(var(--warm-light)))", backgroundSize: "200% 100%", animation: "flowLine 2s linear infinite" }}
            />
          </div>
        </div>

        <div className="space-y-2">
          {improveSteps.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-500 ${active ? "bg-primary/[0.06] border border-primary/15 scale-[1.02]" : done ? "opacity-60" : "opacity-25"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${done ? "bg-primary" : active ? "bg-primary/10 border-2 border-primary/40" : "bg-secondary"}`}>
                  {done
                    ? <CheckCircle className="w-4 h-4 text-primary-foreground" />
                    : active
                    ? <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                    : <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                  }
                </div>
                <div className="flex-1">
                  <span className={`text-[12px] font-semibold ${active ? "text-foreground" : "text-foreground/50"}`}>{s.label}</span>
                  {active && <p className="text-[10px] text-foreground/50 mt-0.5">{s.sub}</p>}
                </div>
                {active && <Zap className="w-3.5 h-3.5 text-primary animate-pulse" />}
                {done && <CheckCircle className="w-3.5 h-3.5 text-primary/60" />}
              </div>
            );
          })}
        </div>

        <p className="text-center text-[11px] text-foreground/40 mt-8">This may take up to 2 minutes</p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, accent }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="group relative bg-card rounded-2xl border border-border/60 p-5 hover:border-primary/25 transition-all duration-300 overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: accent || "hsl(var(--primary) / 0.08)" }} />
      <div className="relative flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10 group-hover:scale-105 transition-transform duration-300">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-[10px] text-foreground/60 font-medium uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-extrabold text-foreground tracking-tight">{value}</p>
          {sub && <p className="text-[10px] text-foreground/45 mt-0.5">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

function HealthIndicator({ label, value }: { label: string; value: string }) {
  const isGood = value === "No issues" || value === "No Issues";
  const isPercent = value.endsWith("%");
  const percentVal = isPercent ? parseInt(value) : 0;

  return (
    <div className="group flex flex-col items-center p-4 rounded-xl bg-gradient-to-b from-secondary/80 to-secondary/40 border border-border/50 hover:border-primary/20 transition-all duration-300 text-center">
      {isPercent ? (
        <div className="relative w-12 h-12 mb-2">
          <svg width="48" height="48" viewBox="0 0 48 48" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
            <circle cx="24" cy="24" r="20" fill="none"
              stroke={percentVal >= 70 ? "hsl(var(--primary))" : "#facc15"}
              strokeWidth="3" strokeLinecap="round"
              strokeDasharray={`${(percentVal / 100) * 125.6} 125.6`}
              className="transition-all duration-1000"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-foreground">{value}</span>
        </div>
      ) : (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
          isGood ? "bg-primary/15" : "bg-yellow-500/15"
        }`}>
          {isGood
            ? <CheckCircle className="w-5 h-5 text-primary" />
            : <AlertCircle className="w-5 h-5 text-yellow-500" />
          }
        </div>
      )}
      <span className="text-[10px] text-foreground/65 font-medium">{label}</span>
      {!isPercent && (
        <span className={`text-[12px] font-bold mt-0.5 ${isGood ? "text-primary" : "text-yellow-500"}`}>{value}</span>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<ATSAnalysis | null>(null);
  const [improving, setImproving] = useState(false);
  const [upgradeData, setUpgradeData] = useState<UpgradeResult | null>(null);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("ats_analysis");
    if (stored) {
      try { setData(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  if (!data) {
    return (
      <DashboardLayout headerTitle="Dashboard">
        <div className="flex flex-col items-center justify-center h-full gap-5 p-8">
          <div className="w-full max-w-md bg-gradient-to-br from-primary/90 to-warm-dim rounded-2xl p-7 text-primary-foreground shadow-[0_8px_32px_hsl(25_55%_58%/0.2)]">
            <p className="text-primary-foreground/60 text-[12px] font-semibold mb-1">Hello</p>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>No Analysis Found</h2>
            <p className="text-primary-foreground/70 text-[13px]">Upload your resume to get started with AI-powered ATS analysis.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
            <button
              onClick={() => router.push("/resume-analysis")}
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-5 py-3 text-[13px] font-semibold hover:opacity-90 transition-opacity shadow-[0_2px_8px_hsl(25_55%_58%/0.3)]"
            >
              <Sparkles className="w-4 h-4" /> Analyze Resume
            </button>
            <button
              onClick={() => router.push("/resume-builder")}
              className="flex items-center justify-center gap-2 bg-card border border-border text-foreground rounded-xl px-5 py-3 text-[13px] font-semibold hover:bg-secondary transition-colors"
            >
              <Zap className="w-4 h-4 text-primary" /> Build Resume
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const analysis = data;
  const atsScore = analysis.ATS_Score || 0;
  const summary = toArray(analysis.Summary);
  const suggestions = toArray(analysis.Suggestions_for_Improvement);
  const keySkills = analysis.Key_Skills || [];
  const missingKwRaw = analysis.Missing_Keywords || [];
  const missingKw: string[] = Array.isArray(missingKwRaw) ? missingKwRaw.map(String) : typeof missingKwRaw === "string" ? [missingKwRaw] : [];
  const strengths = toArray(analysis.Resume_Strength);
  const achievements = toArray(analysis.Achievements_or_Certifications);
  const breakdown = analysis.Score_Breakdown || {};
  const repeatedWords = analysis.Repeated_Word_Frequency || {};
  const wordReplacements = analysis.Word_Replacement_Suggestions || [];
  const safeUpgradeSummary = upgradeData?.Professional_Summary ?? "";
  const safeWorkExperience = Array.isArray(upgradeData?.Work_Experience) ? upgradeData.Work_Experience : [];
  const safeSkills = upgradeData?.Skills && typeof upgradeData.Skills === "object" && !Array.isArray(upgradeData.Skills)
    ? upgradeData.Skills
    : {};
  const resumeHealth = analysis.Resume_Health;

  const scoreItems = [
    { label: "Format", value: breakdown.FORMAT ?? 0, good: (breakdown.FORMAT ?? 0) >= 70 },
    { label: "Skills", value: breakdown.SKILLS ?? 0, good: (breakdown.SKILLS ?? 0) >= 70 },
    { label: "Experience", value: breakdown.EXPERIENCE ?? 0, good: (breakdown.EXPERIENCE ?? 0) >= 70 },
    { label: "Education", value: breakdown.EDUCATION ?? 0, good: (breakdown.EDUCATION ?? 0) >= 70 },
  ];

  const repeatWordEntries = Object.entries(repeatedWords).sort((a, b) => b[1] - a[1]);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - atsScore / 100);

  const resumePositioning = analysis.Resume_Positioning || "";
  const resumeHealthLabel = analysis.Resume_Health_Label || "";
  const scoreLabel = resumeHealthLabel || (atsScore >= 80 ? "Excellent" : atsScore >= 60 ? "Good" : "Needs Work");
  const scoreColor = atsScore >= 80 ? "#34d399" : atsScore >= 60 ? "hsl(var(--primary))" : "#facc15";

  const handleImprove = async () => {
    const fileName = sessionStorage.getItem("resume_file_name");
    const fileData = sessionStorage.getItem("resume_file_data");

    if (!fileName || !fileData) {
      router.push("/resume-analysis");
      return;
    }

    setImproving(true);
    setUpgradeError(null);
    try {
      const byteString = atob(fileData.split(",")[1]);
      const mimeMatch = fileData.match(/^data:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      const resumeFile = new File([ab], fileName, { type: mime });

      const analysisType = sessionStorage.getItem("resume_analysis_type") || "general";
      const role = sessionStorage.getItem("resume_analysis_role") || "";
      const jd = sessionStorage.getItem("resume_analysis_jd") || "";

      let choiceId: 1 | 2 | 3 = 1;
      if (analysisType === "jd" && role && jd) choiceId = 3;
      else if (analysisType === "role" && role) choiceId = 2;

      const result = await upgradeResume(resumeFile, choiceId, role || undefined, jd || undefined);
      setUpgradeData(result);
      sessionStorage.setItem("upgrade_result", JSON.stringify(result));
      // Also set the legacy key our resume builder checks and navigate there for next step
      try {
        sessionStorage.setItem("improved_resume", JSON.stringify(result));
      } catch (e) {
        // ignore storage errors
      }
      router.push("/resume-builder");
    } catch (err) {
      setUpgradeError(err instanceof Error ? err.message : "Upgrade failed. Please try again.");
    } finally {
      setImproving(false);
    }
  };

  return (
    <DashboardLayout headerTitle="Dashboard">
      {improving && <ImprovingOverlay />}
      <div className="p-4 sm:p-6 space-y-5">

        {/* Top summary banner */}
        <div className="relative rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--card)) 60%, hsl(var(--primary) / 0.04) 100%)" }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/[0.03] blur-[80px] pointer-events-none" />
          <div className="border border-border/60 rounded-2xl">
            {/* Header bar */}
            <div className="px-4 sm:px-6 py-4 border-b border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/15 flex items-center justify-center">
                  <FileText className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <h2 className="text-[15px] font-extrabold text-foreground tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Resume Analysis Report</h2>
                  <p className="text-[10px] text-foreground/50 uppercase tracking-widest font-medium">AI-powered ATS compatibility analysis</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {resumePositioning && (
                  <span className="px-3.5 py-1.5 rounded-lg text-[11px] font-bold border backdrop-blur-sm bg-blue-500/10 text-blue-400 border-blue-500/20">
                    {resumePositioning}
                  </span>
                )}
                <span className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold border backdrop-blur-sm ${
                  atsScore >= 80 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                  atsScore >= 60 ? "bg-primary/15 text-primary border-primary/20" :
                  "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                }`}>{scoreLabel}</span>
                <button
                  onClick={handleImprove}
                  disabled={improving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold transition-all duration-300 disabled:opacity-60 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:shadow-[0_4px_20px_hsl(25_55%_58%/0.3)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  {improving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {improving ? "Improving..." : "Upgrade Resume"}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Score + Summary */}
            <div className="p-5 sm:p-7 flex flex-col md:flex-row gap-6 md:gap-10">
              {/* Score ring */}
              <div className="shrink-0 flex flex-col items-center gap-4">
                <div className="relative w-36 h-36">
                  <svg width="144" height="144" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="72" cy="72" r={radius} stroke="hsl(var(--border) / 0.4)" strokeWidth="6" fill="none" />
                    <circle cx="72" cy="72" r={radius}
                      stroke={scoreColor}
                      strokeWidth="7" fill="none"
                      strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
                      className="transition-all duration-1000"
                      style={{ filter: `drop-shadow(0 0 6px ${scoreColor})` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[42px] font-extrabold text-foreground leading-none tracking-tighter">{atsScore}</span>
                    <span className="text-[9px] text-foreground/50 font-bold uppercase tracking-[0.2em] mt-1">ATS Score</span>
                  </div>
                </div>
                {(resumePositioning || resumeHealthLabel) && (
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {resumePositioning && (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/15">
                        {resumePositioning}
                      </span>
                    )}
                    {resumeHealthLabel && (
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                        atsScore >= 80 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/15" :
                        atsScore >= 60 ? "bg-primary/10 text-primary border-primary/15" :
                        "bg-yellow-500/10 text-yellow-400 border-yellow-500/15"
                      }`}>
                        {resumeHealthLabel}
                      </span>
                    )}
                  </div>
                )}
                {/* Mini breakdown pills */}
                <div className="grid grid-cols-2 gap-2">
                  {scoreItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/60 border border-border/40">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.good ? "bg-primary" : "bg-yellow-500"}`} />
                      <span className="text-[9px] text-foreground/60">{item.label}</span>
                      <span className="text-[10px] font-bold text-foreground ml-auto">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary text */}
              <div className="flex-1 min-w-0">
                <h3 className="text-[14px] font-extrabold text-foreground mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" />
                  Summary
                </h3>
                <p className="text-[13px] text-foreground/90 leading-[1.9] mb-5">{summary[0] || "AI-powered analysis complete."}</p>

                {/* Quick stats */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border/30">
                  {[
                    { icon: TrendingUp, label: "Skills", value: keySkills.length, color: "text-primary" },
                    { icon: AlertCircle, label: "Missing", value: missingKw.length, color: "text-yellow-500" },
                    { icon: Award, label: "Achievements", value: achievements.length, color: "text-emerald-400" },
                    { icon: RefreshCw, label: "Repeats", value: repeatWordEntries.length, color: "text-foreground/65" },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/30">
                      <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                      <span className="text-[10px] text-foreground/65">{stat.label}</span>
                      <span className="text-[12px] font-extrabold text-foreground">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <StatCard icon={Target} label="ATS Match" value={`${atsScore}%`} sub="vs industry average" accent="hsl(var(--primary) / 0.1)" />
          <StatCard icon={TrendingUp} label="Skills Found" value={`${keySkills.length}`} sub="key skills identified" />
          <StatCard icon={AlertCircle} label="Missing" value={`${missingKw.length}`} sub="keywords to add" accent="rgba(250,204,21,0.08)" />
          <StatCard icon={Award} label="Achievements" value={`${achievements.length}`} sub="certifications & wins" accent="rgba(52,211,153,0.08)" />
          <StatCard icon={RefreshCw} label="Repeats" value={`${repeatWordEntries.length}`} sub="overused words" />
        </div>

        {/* Resume Health */}
        {resumeHealth && (
          <div className="bg-card rounded-2xl border border-border/60 p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-[14px] font-extrabold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Resume Health</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <HealthIndicator label="Content" value={`${resumeHealth.Content_Percent}%`} />
              <HealthIndicator label="ATS Parse Rate" value={resumeHealth.ATS_Parse_Rate} />
              <HealthIndicator label="Quantifying Impact" value={resumeHealth.Quantifying_Impact} />
              <HealthIndicator label="Repetition" value={resumeHealth.Repetition} />
              <HealthIndicator label="Spelling & Grammar" value={resumeHealth.Spelling_Grammar} />
            </div>
          </div>
        )}

        {/* Score breakdown + Suggestions */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-card rounded-2xl border border-border/60 p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-[14px] font-extrabold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Score Breakdown</h3>
            </div>
            <div className="space-y-5">
              {scoreItems.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.good ? "bg-primary" : "bg-yellow-500"}`} />
                      <span className="text-[12px] text-foreground/75 font-medium">{item.label}</span>
                    </div>
                    <span className="text-[13px] font-extrabold text-foreground tabular-nums">{item.value}%</span>
                  </div>
                  <div className="h-2.5 bg-secondary/80 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${item.value}%`,
                        background: item.good
                          ? "linear-gradient(90deg, hsl(var(--warm-dim)), hsl(var(--primary)))"
                          : "linear-gradient(90deg, #ca8a04, #facc15)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border/60 p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-[14px] font-extrabold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>AI Suggestions</h3>
            </div>
            <div className="space-y-3">
              {suggestions.slice(0, 4).map((text, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-gradient-to-r from-secondary/80 to-secondary/40 border border-border/50 hover:border-primary/20 transition-all duration-200">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 mt-0.5 border border-primary/15">
                    <span className="text-[9px] font-bold text-primary">{i + 1}</span>
                  </div>
                  <p className="text-[11.5px] text-foreground/80 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Skills + Missing Keywords */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-card rounded-2xl border border-border/60 p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-[14px] font-extrabold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Key Skills</h3>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/15">{keySkills.length} found</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {keySkills.slice(0, 12).map((skill, i) => (
                <span key={i} className="text-[11px] font-semibold text-foreground/80 bg-gradient-to-r from-secondary to-secondary/60 border border-border/60 px-3.5 py-2 rounded-xl hover:border-primary/30 hover:bg-primary/[0.04] transition-all duration-200 cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border/60 p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                </div>
                <h3 className="text-[14px] font-extrabold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Missing Keywords</h3>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-500 border border-yellow-500/15">+{missingKw.length}</span>
            </div>
            {missingKw.length > 0 ? (
              <div className="space-y-2.5">
                {missingKw.map((msg, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-secondary/60 border border-border/50 hover:border-yellow-500/20 transition-all duration-200">
                    <div className="w-1 h-full min-h-[16px] rounded-full bg-yellow-500/50 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-foreground/80 leading-relaxed">{msg}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/[0.04] border border-primary/10">
                <CheckCircle className="w-5 h-5 text-primary" />
                <p className="text-[12px] text-foreground font-medium">No missing keywords, great job!</p>
              </div>
            )}
          </div>
        </div>

        {/* Repeat Words */}
        {repeatWordEntries.length > 0 && (
          <div className="bg-card rounded-2xl border border-border/60 p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-[14px] font-extrabold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Repeat Words</h3>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
              {repeatWordEntries.slice(0, 7).map(([word, count], i) => (
                <div key={i} className="group flex flex-col items-center p-3.5 rounded-xl bg-gradient-to-b from-secondary/80 to-secondary/40 border border-border/50 hover:border-primary/25 transition-all duration-300">
                  <span className="text-[11px] text-foreground/70 mb-1.5 capitalize font-medium">{word}</span>
                  <span className="text-xl font-extrabold text-primary group-hover:scale-110 transition-transform duration-300">{count}x</span>
                </div>
              ))}
            </div>
            {wordReplacements.length > 0 && (
              <div className="mt-4 space-y-2 pl-1">
                {wordReplacements.slice(0, 3).map((suggestion, i) => (
                  <p key={i} className="text-[11px] text-foreground/60 flex items-start gap-2">
                    <ArrowRight className="w-3 h-3 text-primary/40 mt-0.5 shrink-0" />
                    <span className="text-foreground/60">{suggestion.replace(/\n/g, " → ")}</span>
                  </p>
                ))}
              </div>
            )}
            <p className="text-[10px] text-foreground/50 mt-4 italic">Tip: Reduce repetition by using synonyms or rephrasing sentences to improve readability.</p>
          </div>
        )}

        {/* Strengths + Achievements */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-card rounded-2xl border border-border/60 p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-[14px] font-extrabold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Resume Strengths</h3>
            </div>
            <div className="space-y-2.5">
              {strengths.slice(0, 4).map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-gradient-to-r from-secondary/80 to-secondary/40 border border-border/50 hover:border-primary/20 transition-all duration-200 group">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <p className="text-[11.5px] text-foreground/80 leading-relaxed pt-1">{s}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border/60 p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Award className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-[14px] font-extrabold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Achievements & Certifications</h3>
            </div>
            {achievements.length > 0 ? (
              <div className="space-y-2.5">
                {achievements.slice(0, 4).map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-gradient-to-r from-secondary/80 to-secondary/40 border border-border/50 hover:border-primary/20 transition-all duration-200 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 border border-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-[11.5px] text-foreground/80 leading-relaxed pt-1">{a}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-secondary/40 border border-border/40 text-center">
                <p className="text-[12px] text-foreground/50">No specific achievements or certifications found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Upgrade Error */}
        {upgradeError && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/20">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-semibold text-destructive">Upgrade Failed</p>
              <p className="text-[12px] text-destructive/80 mt-0.5">{upgradeError}</p>
            </div>
          </div>
        )}

        {/* Upgrade Result */}
        {upgradeData && (
          <div className="bg-card rounded-2xl border border-primary/20 p-5 sm:p-7 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-border/40">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/15 flex items-center justify-center">
                <Rocket className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <h3 className="text-[15px] font-extrabold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Upgraded Resume</h3>
                <p className="text-[10px] text-foreground/50 uppercase tracking-widest font-medium">AI-optimized version</p>
              </div>
            </div>

            <div>
              <h4 className="text-[13px] font-bold text-foreground mb-2 flex items-center gap-2"><Brain className="w-4 h-4 text-primary" /> Professional Summary</h4>
              <p className="text-[12px] text-foreground/80 leading-relaxed bg-secondary/50 p-4 rounded-xl border border-border/40">{safeUpgradeSummary || "No summary returned by the upgrade API."}</p>
            </div>

            {safeWorkExperience.length > 0 && (
              <div>
                <h4 className="text-[13px] font-bold text-foreground mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary" /> Work Experience</h4>
                <div className="space-y-3">
                  {safeWorkExperience.map((exp, i) => (
                    <div key={i} className="p-4 rounded-xl bg-secondary/50 border border-border/40">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                        <span className="text-[12px] font-bold text-foreground">{exp.Job_Title}</span>
                        <span className="text-[10px] text-foreground/50">{exp.Dates}</span>
                      </div>
                      <p className="text-[11px] text-primary font-medium mb-1.5">{exp.Company}</p>
                      <p className="text-[11.5px] text-foreground/75 leading-relaxed">{exp.Description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Object.keys(safeSkills).length > 0 && (
              <div>
                <h4 className="text-[13px] font-bold text-foreground mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Skills</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {Object.entries(safeSkills).map(([category, skills]) => (
                    <div key={category} className="p-4 rounded-xl bg-secondary/50 border border-border/40">
                      <p className="text-[11px] font-bold text-foreground/70 uppercase tracking-wider mb-2">{category.replace(/_/g, " ")}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((s, j) => (
                          <span key={j} className="text-[10px] font-medium text-foreground/80 bg-card border border-border/60 px-2.5 py-1 rounded-lg">{s}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.06] via-transparent to-primary/[0.03] pointer-events-none" />
          <div className="border border-border/60 rounded-2xl p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card/80">
            <div>
              <h3 className="text-[15px] font-extrabold text-foreground mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                Ready to improve your resume?
              </h3>
              <p className="text-[12px] text-foreground/70">Let our AI optimize your resume for better ATS scores and more interviews.</p>
            </div>
            <button
              onClick={handleImprove}
              disabled={improving}
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-[13px] font-bold transition-all duration-300 disabled:opacity-60 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:shadow-[0_4px_24px_hsl(25_55%_58%/0.35)] hover:scale-[1.02] active:scale-[0.98]"
            >
              {improving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {improving ? "Improving..." : "Upgrade Resume"}
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
