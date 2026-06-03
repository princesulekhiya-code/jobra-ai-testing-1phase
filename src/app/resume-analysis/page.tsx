"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import {
  FileText, CheckCircle, Search, Briefcase, Upload,
  BarChart3, Target, Sparkles, AlertCircle, Loader2, ChevronDown, X,
  Brain, Zap, ShieldCheck, Star, Lock, TrendingUp,
} from "lucide-react";
import { analyzeGeneral, analyzeWithRole, analyzeWithJD, fetchRoles, type RoleItem } from "@/lib/api";


const analyzeSteps = [
  { icon: FileText,    label: "Parsing your resume",       sub: "Extracting text, structure & sections…" },
  { icon: Brain,       label: "Running AI analysis",       sub: "Matching keywords and checking ATS rules…" },
  { icon: BarChart3,   label: "Calculating ATS score",     sub: "Scoring format, skills & experience…" },
  { icon: ShieldCheck, label: "Generating recommendations", sub: "Building your personalised action plan…" },
  { icon: Star,        label: "Finalising report",         sub: "Almost there, wrapping up insights…" },
];

function FilePreview({ file }: { file: File | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const docRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);
  const isPdf = file?.name.toLowerCase().endsWith(".pdf");
  const isDocx = file?.name.toLowerCase().endsWith(".docx") || file?.name.toLowerCase().endsWith(".doc");

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!file || !isPdf || !canvasRef.current) return;
    let cancelled = false;

    (async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || cancelled) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const defaultViewport = page.getViewport({ scale: 1 });
        const containerHeight = container.clientHeight;
        const containerWidth = container.clientWidth;
        const scaleH = containerHeight / defaultViewport.height;
        const scaleW = containerWidth / defaultViewport.width;
        const scale = Math.min(scaleH, scaleW) * 2;

        const viewport = page.getViewport({ scale });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;
        if (!cancelled) setRendered(true);
      } catch {
        /* PDF render failed silently */
      }
    })();

    return () => { cancelled = true; };
  }, [file, isPdf]);

  useEffect(() => {
    if (!file || !isDocx) return;
    let cancelled = false;

    (async () => {
      try {
        const mammoth = await import("mammoth");
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        if (!cancelled && docRef.current) {
          docRef.current.innerHTML = result.value;
          setRendered(true);
        }
      } catch {
        /* DOCX render failed */
      }
    })();

    return () => { cancelled = true; };
  }, [file, isDocx]);

  if (!file) return null;

  if (isDocx) {
    return (
      <div ref={containerRef} className={`w-full h-full overflow-hidden transition-opacity duration-700 ${rendered ? "opacity-100" : "opacity-0"}`}>
        <div
          ref={docRef}
          className="docx-preview bg-white text-black p-4 sm:p-5 min-h-full"
        />
        <style jsx global>{`
          .docx-preview { font-size: 9px; line-height: 1.35; }
          .docx-preview h1, .docx-preview h2, .docx-preview h3 {
            font-weight: 700;
            margin-top: 0.5em;
            margin-bottom: 0.2em;
            color: #111;
          }
          .docx-preview h1 { font-size: 1.3em; }
          .docx-preview h2 { font-size: 1.1em; }
          .docx-preview h3 { font-size: 1em; }
          .docx-preview p { margin: 0.15em 0; color: #222; line-height: 1.35; }
          .docx-preview ul, .docx-preview ol { padding-left: 1.2em; margin: 0.15em 0; }
          .docx-preview li { color: #222; margin: 0.1em 0; }
          .docx-preview table { border-collapse: collapse; width: 100%; margin: 0.3em 0; }
          .docx-preview td, .docx-preview th { border: 1px solid #ddd; padding: 2px 5px; }
          .docx-preview strong, .docx-preview b { font-weight: 700; }
          .docx-preview a { color: #1a56db; text-decoration: underline; }
          @media (min-width: 640px) { .docx-preview { font-size: 10px; } }
          @media (min-width: 768px) { .docx-preview { font-size: 11px; line-height: 1.4; } }
        `}</style>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className={`max-w-full max-h-full object-contain transition-opacity duration-700 ${rendered ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

function AnalyzingOverlay({ fileName, file }: { fileName: string; file: File | null }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [scanLine, setScanLine] = useState(0);
  const [highlightRows, setHighlightRows] = useState<number[]>([]);

  useEffect(() => {
    const iv = setInterval(() => setStep((s) => (s < analyzeSteps.length - 1 ? s + 1 : s)), 2400);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const target = Math.min(((step + 1) / analyzeSteps.length) * 92, 92);
    const timer = setTimeout(() => setProgress(target), 120);
    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    const iv = setInterval(() => setScanLine((p) => (p >= 100 ? 0 : p + 0.4)), 30);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      const count = Math.floor(Math.random() * 3) + 1;
      const rows = Array.from({ length: count }, () => Math.floor(Math.random() * 20));
      setHighlightRows(rows);
      setTimeout(() => setHighlightRows([]), 800);
    }, 1500);
    return () => clearInterval(iv);
  }, []);

  const current = analyzeSteps[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-primary/[0.03] blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-5 md:gap-8 items-center">
        {/* Left — File preview (visible on all screens) */}
        <div className="w-full md:flex-1 min-w-0">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden h-[280px] sm:h-[360px] md:h-[540px] flex flex-col shadow-2xl shadow-black/40">
            {/* Mac title bar */}
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border-b border-white/[0.06] bg-white/[0.03] shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <div className="flex items-center gap-2 ml-3 flex-1 min-w-0">
                <FileText className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                <span className="text-[10px] sm:text-[11px] text-muted-foreground/70 font-medium truncate">{fileName}</span>
              </div>
            </div>

            {/* File preview with scan effect */}
            <div className="flex-1 overflow-hidden relative bg-white/[0.02] flex items-start justify-center p-2 sm:p-4">
              {/* Scan beam */}
              <div
                className="absolute left-0 right-0 h-12 sm:h-16 pointer-events-none z-10 transition-all"
                style={{
                  top: `${scanLine}%`,
                  background: "linear-gradient(180deg, transparent 0%, hsl(var(--primary) / 0.08) 30%, hsl(var(--primary) / 0.18) 50%, hsl(var(--primary) / 0.08) 70%, transparent 100%)",
                  boxShadow: "0 0 60px hsl(var(--primary) / 0.1)",
                }}
              />
              {/* Scan line edge */}
              <div
                className="absolute left-0 right-0 h-[2px] pointer-events-none z-10"
                style={{
                  top: `calc(${scanLine}% + 1.5rem)`,
                  background: "linear-gradient(90deg, transparent 5%, hsl(var(--primary) / 0.6) 20%, hsl(var(--primary) / 0.8) 50%, hsl(var(--primary) / 0.6) 80%, transparent 95%)",
                  boxShadow: "0 0 12px hsl(var(--primary) / 0.4)",
                }}
              />
              {/* Random highlight rows */}
              {highlightRows.map((row, i) => (
                <div
                  key={`hl-${i}-${row}`}
                  className="absolute left-4 right-4 h-3 rounded-sm pointer-events-none z-10 animate-fade-in"
                  style={{
                    top: `${(row / 20) * 90 + 5}%`,
                    background: "hsl(var(--primary) / 0.08)",
                    border: "1px solid hsl(var(--primary) / 0.15)",
                  }}
                />
              ))}
              <FilePreview file={file} />
            </div>

            {/* Bottom status bar */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-t border-white/[0.06] bg-white/[0.03] shrink-0">
              <span className="text-[9px] sm:text-[10px] text-muted-foreground/40 truncate">{fileName}</span>
              <span className="text-[9px] sm:text-[10px] text-primary/70 font-semibold flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-50" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                Scanning…
              </span>
            </div>
          </div>
        </div>

        {/* Right — Progress + Steps */}
        <div className="w-full md:w-[340px] shrink-0 flex flex-col justify-center">
          {/* Spinner */}
          <div className="flex justify-center mb-5 sm:mb-6">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20">
              <svg className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: "3s" }} viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="36" fill="none" stroke="hsl(var(--border))" strokeWidth="1.5" opacity="0.3" />
                <circle cx="40" cy="40" r="36" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5"
                  strokeDasharray="60 166" strokeLinecap="round" />
              </svg>
              <svg className="absolute inset-1.5 w-[calc(100%-12px)] h-[calc(100%-12px)] animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }} viewBox="0 0 68 68">
                <circle cx="34" cy="34" r="30" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5"
                  strokeDasharray="30 159" strokeLinecap="round" opacity="0.5" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
                  <current.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center mb-4 sm:mb-5">
            <h2 className="text-base sm:text-lg font-extrabold text-foreground mb-1 tracking-tight">{current.label}</h2>
            <p className="text-[11px] sm:text-[12px] text-muted-foreground/80">{current.sub}</p>
          </div>

          {/* Progress bar */}
          <div className="mb-4 sm:mb-5 px-1">
            <div className="flex justify-between text-[10px] font-semibold mb-2">
              <span className="text-muted-foreground/70 tracking-wider uppercase">Processing</span>
              <span className="text-primary font-mono">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 sm:h-2 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg, hsl(var(--warm-dim)), hsl(var(--primary)), hsl(var(--warm-light)))" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>

          {/* Step checklist */}
          <div className="space-y-1 px-1">
            {analyzeSteps.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-500 ${
                    active ? "bg-white/[0.04] border border-primary/20" : done ? "opacity-60" : "opacity-25"
                  }`}
                >
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                    done ? "bg-primary/90 shadow-md shadow-primary/20" : active ? "bg-primary/10 border-2 border-primary/50" : "bg-white/[0.04]"
                  }`}>
                    {done ? (
                      <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary-foreground" />
                    ) : active ? (
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse" />
                    ) : (
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-muted-foreground/20" />
                    )}
                  </div>
                  <span className={`text-[11px] sm:text-[12px] font-semibold transition-colors duration-500 ${
                    active ? "text-foreground" : done ? "text-muted-foreground" : "text-muted-foreground/50"
                  }`}>{s.label}</span>
                  {active && <Zap className="w-3 h-3 text-primary ml-auto animate-pulse" />}
                  {done && <CheckCircle className="w-3 h-3 text-primary/60 ml-auto" />}
                </div>
              );
            })}
          </div>

          {/* File tag */}
          <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2 px-3 py-1.5 sm:py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mx-auto w-fit">
            <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary/60" />
            <span className="text-[10px] sm:text-[11px] text-muted-foreground/70 truncate max-w-[160px] sm:max-w-[180px] font-medium">{fileName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ResumeAnalysisPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedType, setSelectedType] = useState("general");

  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [roleSearch, setRoleSearch] = useState("");
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const [jdText, setJdText] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchRoles()
      .then((data) => setRoles([...data.roles].sort((a, b) => a.title.localeCompare(b.title))))
      .catch(() => {});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pending = (window as any).__pendingResumeFile as File | undefined;
    if (pending) {
      setFile(pending);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).__pendingResumeFile;
    } else {
      const pendingName = sessionStorage.getItem("pending_resume_name");
      const pendingData = sessionStorage.getItem("pending_resume_data");
      if (pendingName && pendingData) {
        try {
          const byteString = atob(pendingData.split(",")[1]);
          const mimeMatch = pendingData.match(/^data:(.*?);/);
          const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
          const restored = new File([ab], pendingName, { type: mime });
          setFile(restored);
        } catch {
          const dummy = new File([""], pendingName, { type: "application/pdf" });
          setFile(dummy);
        } finally {
          sessionStorage.removeItem("pending_resume_name");
          sessionStorage.removeItem("pending_resume_data");
        }
      }
    }
  }, []);

  const handleFile = (f: File) => {
    const ext = f.name.toLowerCase();
    if (!ext.endsWith(".pdf") && !ext.endsWith(".docx") && !ext.endsWith(".doc")) {
      setError("Only PDF or DOCX files are accepted");
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      setError("File must be under 2 MB");
      return;
    }
    setError(null);
    setFile(f);
  };

  const handleAnalyze = async () => {
    if (!file) { setError("Please upload a resume first"); return; }
    if (selectedType === "role" && selectedRoleId === null) { setError("Please select a job role"); return; }
    if (selectedType === "jd" && !jdText.trim()) { setError("Please paste a job description"); return; }

    setLoading(true);
    setError(null);
    try {
      let result;
      if (selectedType === "general") {
        result = await analyzeGeneral(file);
      } else if (selectedType === "role") {
        result = await analyzeWithRole(file, selectedRoleId!);
      } else {
        result = await analyzeWithJD(file, jdText, selectedRoleId ?? undefined);
      }
      sessionStorage.setItem("ats_analysis", JSON.stringify(result));

      const reader = new FileReader();
      reader.onload = () => {
        sessionStorage.setItem("resume_file_name", file.name);
        sessionStorage.setItem("resume_file_data", reader.result as string);
        if (selectedType === "role" && selectedRoleId) {
          sessionStorage.setItem("resume_analysis_role", selectedRoleId);
        }
        if (selectedType === "jd" && jdText.trim()) {
          sessionStorage.setItem("resume_analysis_jd", jdText);
        }
        sessionStorage.setItem("resume_analysis_type", selectedType);
        router.push("/dashboard");
      };
      reader.onerror = () => router.push("/dashboard");
      reader.readAsDataURL(file);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Request timed out. The server took too long to respond. Please try again.");
      } else {
        setError(err instanceof Error ? err.message : "Analysis failed. Please check if the backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = roles.filter((r) => r.title.toLowerCase().includes(roleSearch.toLowerCase()));

  const analysisTypes = [
    { id: "general", icon: FileText,  title: "General ATS",  desc: "Standard scan for keyword density and formatting." },
    { id: "role",    icon: Briefcase, title: "With Role",     desc: "Analyze compatibility for a specific job title." },
    { id: "jd",      icon: Search,    title: "With JD",       desc: "Deep-dive match against a job description." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {loading && <AnalyzingOverlay fileName={file?.name ?? "resume"} file={file} />}
      <Header />

      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/hero-bg.jpg" alt="" className="absolute inset-0 w-full h-[520px] object-cover opacity-30" loading="eager" />
        <div className="absolute inset-0 h-[520px] bg-gradient-to-b from-background/20 via-background/60 to-background" />

        <main className="relative z-10 pt-20 pb-16 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/[0.08] border border-primary/15 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary/80">AI-Powered Analysis</span>
              </div>
              <h1
                className="text-3xl md:text-[38px] font-bold text-foreground leading-[1.1] mb-3 tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Optimize Your Resume for{" "}
                <span className="warm-text">Success.</span>
              </h1>
              <p className="text-[14px] text-muted-foreground/80 max-w-md mx-auto leading-relaxed">
                Upload your resume and let our AI analyze your compatibility with modern ATS systems and specific job roles.
              </p>
            </div>

            {/* Main card container */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5 md:p-6 shadow-2xl shadow-black/30">

              {/* Step 1 — Upload */}
              <div className="mb-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary">1</span>
                  </div>
                  <span className="text-[13px] font-bold text-foreground tracking-tight">Upload Resume</span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                />

                <div
                  className={`relative rounded-xl transition-all duration-300 border-2 border-dashed cursor-pointer group ${
                    isDragging
                      ? "border-primary bg-primary/[0.06] scale-[1.01]"
                      : file
                      ? "border-primary/25 bg-primary/[0.03]"
                      : "border-white/[0.08] hover:border-primary/30 hover:bg-white/[0.02]"
                  } ${file ? "p-4" : "p-5"}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                  onClick={() => { if (!file) fileInputRef.current?.click(); }}
                >
                  {file ? (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-foreground truncate">{file.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[11px] text-muted-foreground/60 font-medium">
                            {formatFileSize(file.size)}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-primary/80 font-semibold">
                            <CheckCircle className="w-3 h-3" /> Ready
                          </span>
                        </div>
                      </div>
                      <button
                        className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-all"
                        onClick={(e) => { e.stopPropagation(); setFile(null); setError(null); }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isDragging ? "border-primary bg-primary/10 scale-110" : "border-white/[0.08] bg-white/[0.03] group-hover:border-primary/30 group-hover:bg-primary/[0.05]"
                      }`}>
                        <Upload className={`w-4 h-4 transition-all duration-300 ${isDragging ? "text-primary scale-110" : "text-muted-foreground/60 group-hover:text-primary/70"}`} />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-foreground/90">Click to upload or drag and drop</p>
                        <p className="text-[11px] text-muted-foreground/50 mt-0.5">PDF, DOC, DOCX &middot; max 2 MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Subtle divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-5" />

              {/* Step 2 — Analysis Type */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary">2</span>
                  </div>
                  <span className="text-[13px] font-bold text-foreground tracking-tight">Choose Analysis Type</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {analysisTypes.map((type) => {
                    const isActive = selectedType === type.id;
                    return (
                      <button
                        key={type.id}
                        className={`relative text-left p-3 rounded-xl transition-all duration-300 border overflow-hidden group/card ${
                          isActive
                            ? "border-primary/40 bg-primary/[0.07]"
                            : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
                        }`}
                        onClick={() => setSelectedType(type.id)}
                      >
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-transparent pointer-events-none" />
                        )}
                        <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-all duration-300 ${
                          isActive ? "bg-primary/20 border border-primary/30" : "bg-white/[0.04] border border-white/[0.06] group-hover/card:bg-white/[0.06]"
                        }`}>
                          <type.icon className={`w-3.5 h-3.5 transition-colors duration-300 ${isActive ? "text-primary" : "text-muted-foreground/60 group-hover/card:text-muted-foreground"}`} />
                        </div>
                        <p className={`relative text-[12px] font-bold mb-0.5 transition-colors duration-300 ${isActive ? "text-primary" : "text-foreground/80"}`}>
                          {type.title}
                        </p>
                        <p className="relative text-[10px] text-muted-foreground/60 leading-relaxed">{type.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Role + JD inputs */}
              {(selectedType === "role" || selectedType === "jd") && (
                <div className="mb-4 animate-fade-in" ref={roleDropdownRef}>
                  {/* Role Selector */}
                  {selectedType === "role" && (
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground/70 mb-1.5 block tracking-[0.15em] uppercase">
                      Target Role
                    </label>
                    <div className="relative">
                      <div
                        className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border text-[12px] cursor-pointer transition-all ${
                          roleDropdownOpen ? "border-primary/40 bg-white/[0.05]" : "border-white/[0.08] hover:border-white/[0.15]"
                        }`}
                        onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                      >
                        <Search className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                        {roleDropdownOpen ? (
                          <input
                            autoFocus
                            value={roleSearch}
                            onChange={(e) => setRoleSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Search roles..."
                            className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground/30 text-[12px]"
                          />
                        ) : (
                          <span className={`truncate ${selectedRoleId !== null ? "text-foreground flex-1" : "text-muted-foreground/50 flex-1"}`}>
                            {selectedRoleId !== null
                              ? roles.find((r) => r.id === selectedRoleId)?.title ?? "Select role"
                              : "Search & select a role…"}
                          </span>
                        )}
                        {selectedRoleId !== null && !roleDropdownOpen ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedRoleId(null); setRoleSearch(""); }}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground/50 shrink-0 transition-transform duration-200 ${roleDropdownOpen ? "rotate-180" : ""}`} />
                        )}
                      </div>

                      {roleDropdownOpen && (
                        <div className="absolute z-50 top-full left-0 right-0 mt-1.5 max-h-52 overflow-y-auto rounded-lg bg-card/95 backdrop-blur-md border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.6)] custom-scrollbar">
                          {filteredRoles.map((r) => (
                            <button
                              key={r.id}
                              className={`w-full text-left px-3 py-2 text-[12px] transition-colors ${
                                selectedRoleId === r.id
                                  ? "bg-primary/10 text-primary"
                                  : "text-foreground/70 hover:bg-white/[0.04] hover:text-foreground"
                              }`}
                              onClick={() => { setSelectedRoleId(r.id); setRoleSearch(""); setRoleDropdownOpen(false); }}
                            >
                              {r.title}
                            </button>
                          ))}
                          {filteredRoles.length === 0 && (
                            <div className="px-3 py-4 text-center text-[12px] text-muted-foreground/60">
                              No roles found for &ldquo;{roleSearch}&rdquo;
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  )}

                  {/* JD Text Area */}
                  {selectedType === "jd" && (
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground/70 mb-1.5 block tracking-[0.15em] uppercase">
                        Job Description
                      </label>
                      <textarea
                        value={jdText}
                        onChange={(e) => setJdText(e.target.value)}
                        rows={3}
                        placeholder="Paste the full job description here…"
                        className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-foreground text-[12px] outline-none resize-y leading-relaxed placeholder:text-muted-foreground/30 focus:border-primary/40 focus:bg-white/[0.05] transition-all"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mb-4 px-4 py-2.5 rounded-xl bg-destructive/[0.08] border border-destructive/20 text-destructive text-[12px] flex items-center gap-2.5 animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Analyze Button */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
                <p className="text-[11px] text-muted-foreground/40 flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  Login required to save progress.
                </p>
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !file}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-300 ${
                    loading
                      ? "bg-white/[0.06] text-muted-foreground cursor-not-allowed border border-white/[0.08]"
                      : file
                      ? "bg-primary text-primary-foreground hover:opacity-90 hover:shadow-[0_4px_20px_hsl(25_55%_58%/0.3)] active:scale-[0.98]"
                      : "bg-white/[0.06] text-muted-foreground/40 cursor-not-allowed border border-white/[0.08]"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      Start Analysis
                      <TrendingUp className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Feature highlights */}
            <div className="mt-10">
              <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-8" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { icon: Search,    title: "Keyword Analysis",   desc: "Find missing industry terms." },
                  { icon: BarChart3, title: "ATS Compatibility",  desc: "Verify your format is ATS-safe." },
                  { icon: Target,    title: "Role Matching",      desc: "Score against market demands." },
                  { icon: Sparkles,  title: "Smart Suggestions",  desc: "AI-driven improvement tips." },
                ].map((f, i) => (
                  <div key={i} className="text-center group">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/[0.08] group-hover:border-primary/20 transition-all duration-300">
                      <f.icon className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors duration-300" />
                    </div>
                    <p className="text-[12px] font-bold text-foreground/80 mb-1">{f.title}</p>
                    <p className="text-[11px] text-muted-foreground/50 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="border-t border-white/[0.04] px-6 py-5">
        <div className="max-w-3xl mx-auto flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-5 text-[11px] text-muted-foreground/40">
            <span>&copy; 2026 JOBRA Intelligence</span>
            <Link href="#" className="hover:text-muted-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-muted-foreground transition-colors">Terms</Link>
          </div>
          <span className="text-[11px] text-muted-foreground/25 font-mono">v2.43</span>
        </div>
      </footer>
    </div>
  );
}
