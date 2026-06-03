"use client";

import { useState, useEffect } from "react";
import {
  FileText, CheckCircle2, Star, TrendingUp,
  BarChart3, Sparkles, X, Upload, Briefcase,
  Users, MessageSquare, ArrowRight
} from "lucide-react";

type Scene = "problem" | "upload" | "processing" | "transform" | "results" | "cta";

const SCENE_DURATIONS: Record<Scene, number> = {
  problem: 3500,
  upload: 3500,
  processing: 3000,
  transform: 4000,
  results: 3500,
  cta: 4000,
};

const SCENES: Scene[] = ["problem", "upload", "processing", "transform", "results", "cta"];

export function HeroResumeAnimation() {
  const [scene, setScene] = useState<Scene>("problem");
  const [loopKey, setLoopKey] = useState(0);

  useEffect(() => {
    let idx = 0;
    let timer: ReturnType<typeof setTimeout>;

    const advance = () => {
      idx++;
      if (idx >= SCENES.length) {
        idx = 0;
        setLoopKey((k) => k + 1);
      }
      setScene(SCENES[idx]);
      timer = setTimeout(advance, SCENE_DURATIONS[SCENES[idx]]);
    };

    timer = setTimeout(advance, SCENE_DURATIONS[SCENES[0]]);
    return () => clearTimeout(timer);
  }, [loopKey]);

  return (
    <div className="relative w-full max-w-[480px] min-h-[460px] mx-auto" key={loopKey}>
      <div className="absolute -inset-6 bg-primary/[0.02] rounded-[32px] blur-2xl" />

      <div
        className="relative rounded-2xl border border-border/40 overflow-hidden min-h-[380px]"
        style={{ background: "linear-gradient(145deg, hsl(var(--card)) 0%, hsl(0 0% 5%) 100%)" }}
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <SceneHeader scene={scene} />

        <div className="h-px w-full bg-border/30" />

        <div className="relative">
          {scene === "problem" && <ProblemScene />}
          {scene === "upload" && <UploadScene />}
          {scene === "processing" && <ProcessingScene />}
          {scene === "transform" && <TransformScene />}
          {scene === "results" && <ResultsScene />}
          {scene === "cta" && <CTAScene />}
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="flex items-center justify-center gap-2 mt-4">
        {SCENES.map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              s === scene ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function SceneHeader({ scene }: { scene: Scene }) {
  const config: Record<Scene, { label: string; status: string; statusColor: string }> = {
    problem: { label: "My_Resume.pdf", status: "Low Score", statusColor: "bg-destructive" },
    upload: { label: "Jobra AI Studio", status: "Uploading", statusColor: "bg-primary animate-pulse" },
    processing: { label: "AI Engine", status: "Analyzing", statusColor: "bg-primary animate-pulse" },
    transform: { label: "Optimization", status: "Transforming", statusColor: "bg-primary animate-pulse" },
    results: { label: "Results Ready", status: "Complete", statusColor: "bg-green-500" },
    cta: { label: "Jobra AI", status: "Ready", statusColor: "bg-green-500" },
  };

  const { label, status, statusColor } = config[scene];

  return (
    <div className="px-5 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
          <FileText className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-foreground">{label}</p>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${statusColor}`} />
            {status}
          </p>
        </div>
      </div>
      <span className="text-[9px] font-medium text-primary/60 uppercase tracking-widest">Jobra AI</span>
    </div>
  );
}

function ProblemScene() {
  const [showWarnings, setShowWarnings] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowWarnings(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="px-4 py-4 animate-fade-up">
      <div className="relative rounded-lg overflow-hidden border border-destructive/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/resume-low-ats.webp"
          alt="Low ATS resume"
          className="w-full h-[220px] object-cover object-top opacity-70"
          style={{ filter: "grayscale(0.4) brightness(0.8)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, hsl(0 72% 55% / 0.1) 0%, hsl(var(--card) / 0.7) 70%, hsl(var(--card) / 0.95) 100%)",
          }}
        />

        <div className="absolute top-3 right-3 animate-fade-up">
          <LowScoreRing />
        </div>

        {showWarnings && (
          <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1.5 animate-fade-up">
            <WarningPill text="Missing keywords" delay={0} />
            <WarningPill text="Poor formatting" delay={200} />
            <WarningPill text="Weak impact verbs" delay={400} />
          </div>
        )}
      </div>

      <div className="mt-4 text-center animate-fade-up">
        <p className="text-sm font-semibold text-foreground">Struggling to get shortlisted?</p>
        <p className="text-[11px] text-muted-foreground mt-1">Your resume isn&apos;t making it past ATS filters</p>
      </div>
    </div>
  );
}

function LowScoreRing() {
  const [score, setScore] = useState(0);
  const target = 32;

  useEffect(() => {
    let c = 0;
    const iv = setInterval(() => {
      c += 1;
      if (c >= target) { setScore(target); clearInterval(iv); } else setScore(c);
    }, 30);
    return () => clearInterval(iv);
  }, []);

  const r = 24;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="relative w-16 h-16 flex items-center justify-center bg-card/80 backdrop-blur-sm rounded-xl border border-destructive/30">
      <svg width="48" height="48" className="transform -rotate-90">
        <circle cx="24" cy="24" r={r} stroke="hsl(var(--secondary))" strokeWidth="3" fill="none" opacity="0.5" />
        <circle
          cx="24" cy="24" r={r}
          stroke="hsl(var(--destructive))"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.08s ease-out", filter: "drop-shadow(0 0 6px hsl(0 72% 55% / 0.6))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-destructive">{score}%</span>
      </div>
    </div>
  );
}

function WarningPill({ text, delay }: { text: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!visible) return null;

  return (
    <div className="flex items-center gap-1.5 bg-destructive/10 backdrop-blur-sm rounded-full px-2.5 py-1 border border-destructive/20 animate-fade-up w-fit">
      <X className="w-3 h-3 text-destructive" />
      <span className="text-[10px] font-medium text-destructive">{text}</span>
    </div>
  );
}

function UploadScene() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 600),
      setTimeout(() => setStep(2), 1400),
      setTimeout(() => setStep(3), 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="px-5 py-5 animate-fade-up">
      <div className={`border-2 border-dashed rounded-xl p-5 text-center transition-all duration-500 mb-4 ${
        step >= 1 ? "border-primary/50 bg-primary/5" : "border-border/40"
      }`}>
        <Upload className={`w-6 h-6 mx-auto mb-2 transition-all duration-500 ${
          step >= 1 ? "text-primary scale-110" : "text-muted-foreground"
        }`} />
        <p className="text-[11px] text-muted-foreground">
          {step >= 1 ? "Resume uploaded ✓" : "Drop your resume here"}
        </p>
      </div>

      <div className="space-y-3">
        <SettingField
          label="Target Role"
          value="Frontend Developer"
          visible={step >= 2}
          icon={<Briefcase className="w-3.5 h-3.5 text-primary" />}
        />
        <SettingField
          label="Key Skills"
          value="React, Java, AWS"
          visible={step >= 3}
          icon={<Sparkles className="w-3.5 h-3.5 text-primary" />}
        />
        <SettingField
          label="Experience"
          value="3+ Years"
          visible={step >= 3}
          icon={<TrendingUp className="w-3.5 h-3.5 text-primary" />}
        />
      </div>
    </div>
  );
}

function SettingField({ label, value, visible, icon }: { label: string; value: string; visible: boolean; icon: React.ReactNode }) {
  if (!visible) return <div className="h-9" />;

  return (
    <div className="flex items-center gap-3 bg-secondary/40 rounded-lg px-3 py-2 animate-fade-up">
      {icon}
      <div className="flex-1">
        <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-[12px] text-foreground font-medium">{value}</p>
      </div>
      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
    </div>
  );
}

function ProcessingScene() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(iv); return 100; }
        return p + 2;
      });
    }, 50);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="px-5 py-8 flex flex-col items-center gap-6 animate-fade-up">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/15">
          <BarChart3 className="w-7 h-7 text-primary" />
        </div>
        <div className="absolute -inset-1 rounded-2xl border border-primary/10 animate-pulse" style={{ animationDuration: "2s" }} />
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">Analyzing & Optimizing</p>
        <p className="text-[11px] text-muted-foreground mt-1">AI is enhancing your resume…</p>
      </div>

      <div className="w-full">
        <div className="w-full h-1.5 bg-secondary/60 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, hsl(var(--warm-dim)), hsl(var(--primary)), hsl(var(--warm-light)))",
            }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">{Math.min(progress, 100)}% complete</p>
      </div>

      <ScanPulse />
    </div>
  );
}

function ScanPulse() {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-2xl">
      <div
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/80 to-transparent"
        style={{ animation: "scanMove 1.8s ease-in-out infinite" }}
      />
      <style>{`
        @keyframes scanMove {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function TransformScene() {
  const [phase, setPhase] = useState<"old" | "transitioning" | "new">("old");
  const [score, setScore] = useState(32);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("transitioning"), 800);
    const t2 = setTimeout(() => setPhase("new"), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (phase !== "new") return;
    let c = 32;
    const iv = setInterval(() => {
      c += 1;
      if (c >= 94) { setScore(94); clearInterval(iv); } else setScore(c);
    }, 25);
    return () => clearInterval(iv);
  }, [phase]);

  return (
    <div className="px-4 py-4 animate-fade-up">
      <div className="relative h-[220px] rounded-lg overflow-hidden border border-border/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/resume-low-ats.webp"
          alt="Before"
          className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-1000"
          style={{
            opacity: phase === "old" ? 0.7 : 0,
            filter: "grayscale(0.4) brightness(0.7)",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/resume-sample.webp"
          alt="After"
          className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-1000"
          style={{
            opacity: phase === "new" ? 0.9 : 0,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, transparent 0%, hsl(var(--card) / 0.5) 60%, hsl(var(--card) / 0.9) 100%)",
          }}
        />

        {phase === "transitioning" && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse" />
        )}

        <div className="absolute top-3 right-3">
          <TransformScoreRing score={score} />
        </div>
      </div>

      {phase === "new" && (
        <div className="mt-3 space-y-2 animate-fade-up">
          <ImprovementLine label="Keywords optimized" delay={200} />
          <ImprovementLine label="Format restructured" delay={400} />
          <ImprovementLine label="Impact verbs added" delay={600} />
        </div>
      )}
    </div>
  );
}

function TransformScoreRing({ score }: { score: number }) {
  const r = 24;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const isHigh = score >= 80;

  return (
    <div className={`relative w-16 h-16 flex items-center justify-center bg-card/80 backdrop-blur-sm rounded-xl border ${
      isHigh ? "border-primary/30" : "border-destructive/30"
    }`}>
      <svg width="48" height="48" className="transform -rotate-90">
        <circle cx="24" cy="24" r={r} stroke="hsl(var(--secondary))" strokeWidth="3" fill="none" opacity="0.5" />
        <circle
          cx="24" cy="24" r={r}
          stroke={isHigh ? "url(#transformGrad)" : "hsl(var(--destructive))"}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.06s ease-out" }}
        />
        <defs>
          <linearGradient id="transformGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--warm-light))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-sm font-bold ${isHigh ? "text-primary" : "text-destructive"}`}>
          {score}%
        </span>
      </div>
    </div>
  );
}

function ImprovementLine({ label, delay }: { label: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!visible) return null;

  return (
    <div className="flex items-center gap-2 animate-fade-up">
      <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
      <span className="text-[11px] text-foreground/70">{label}</span>
    </div>
  );
}

function ResultsScene() {
  return (
    <div className="px-5 py-5 animate-fade-up">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="flex items-center gap-1 bg-primary/10 rounded-full px-3 py-1.5 border border-primary/20">
          <Star className="w-3.5 h-3.5 text-primary fill-primary" />
          <span className="text-[11px] font-semibold text-primary">ATS Score: 94%</span>
        </div>
      </div>

      <div className="space-y-2.5">
        <ResultCard
          icon={<Briefcase className="w-4 h-4 text-primary" />}
          title="Job Recommendations"
          desc="12 matching roles found"
          delay={400}
        />
        <ResultCard
          icon={<MessageSquare className="w-4 h-4 text-primary" />}
          title="Mock Interview Prep"
          desc="AI-powered practice sessions"
          delay={800}
        />
        <ResultCard
          icon={<Users className="w-4 h-4 text-primary" />}
          title="Mentor Support"
          desc="Connect with industry experts"
          delay={1200}
        />
      </div>
    </div>
  );
}

function ResultCard({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!visible) return <div className="h-14" />;

  return (
    <div className="flex items-center gap-3 bg-secondary/30 rounded-xl px-4 py-3 border border-border/20 animate-fade-up hover:border-primary/20 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[12px] font-semibold text-foreground">{title}</p>
        <p className="text-[10px] text-muted-foreground">{desc}</p>
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
    </div>
  );
}

function CTAScene() {
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowCTA(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="px-5 py-8 flex flex-col items-center gap-5 animate-fade-up">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
        <CheckCircle2 className="w-8 h-8 text-primary" />
      </div>

      <div className="text-center">
        <p className="text-base font-semibold text-foreground">Resume Optimized!</p>
        <p className="text-[12px] text-muted-foreground mt-1.5 leading-relaxed max-w-[260px]">
          Land your dream job with <span className="text-primary font-semibold">Jobra AI</span>
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">94%</p>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider">ATS Score</p>
        </div>
        <div className="w-px h-8 bg-border/30" />
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">12</p>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Job Matches</p>
        </div>
        <div className="w-px h-8 bg-border/30" />
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">3x</p>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider">More Views</p>
        </div>
      </div>

      {showCTA && (
        <div className="w-full animate-fade-up">
          <div
            className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 cursor-pointer border border-primary/30 hover:border-primary/50 transition-all"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))",
            }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[12px] font-semibold text-primary tracking-wide">Get Started Free</span>
            <ArrowRight className="w-3.5 h-3.5 text-primary" />
          </div>
        </div>
      )}
    </div>
  );
}

export default HeroResumeAnimation;
