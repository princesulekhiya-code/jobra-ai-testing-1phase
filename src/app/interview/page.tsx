"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { MessageSquare, Video, Mic, Play, Clock, CheckCircle, TrendingUp, Target, Zap, ArrowRight } from "lucide-react";

const MODES = [
  {
    icon: MessageSquare,
    title: "Behavioral Questions",
    desc: "Master the STAR method with common behavioral questions asked at top companies.",
    count: "50+ questions",
  },
  {
    icon: Target,
    title: "Technical Interview",
    desc: "Prepare for role-specific technical questions tailored to your target job.",
    count: "200+ questions",
  },
  {
    icon: Video,
    title: "Video Interview",
    desc: "Practice with video recording and get AI analysis on delivery and confidence.",
    count: "AI feedback",
  },
];

const SESSIONS = [
  { type: "Behavioral", date: "2 days ago", duration: "25 min", score: 87, questions: 8 },
  { type: "Technical - Product Design", date: "5 days ago", duration: "35 min", score: 92, questions: 12 },
  { type: "Video Interview", date: "1 week ago", duration: "20 min", score: 79, questions: 6 },
];

function ScoreBadge({ score }: { score: number }) {
  return (
    <div className="text-center px-4 py-2 rounded-xl border border-border bg-secondary">
      <div className="text-xl font-extrabold tabular-nums text-primary">{score}</div>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Score</div>
    </div>
  );
}

export default function InterviewPage() {
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="mb-10">
          <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-muted-foreground/60 mb-2">✦ AI Interview Prep</p>
          <h1 className="text-2xl font-extrabold text-foreground leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Practice &amp;{" "}
            <span className="warm-text">Ace Your Interview</span>
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1 max-w-lg">AI-powered mock interviews with instant feedback on content, communication and confidence.</p>
        </div>

        {/* Practice Modes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {MODES.map((mode) => (
            <div key={mode.title} className="bg-card rounded-2xl border border-border p-6 transition-all duration-200 hover:border-primary/30 group cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center mb-4">
                <mode.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-secondary text-muted-foreground mb-3">{mode.count}</span>
              <h3 className="text-[15px] font-bold text-foreground mb-2">{mode.title}</h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed mb-5">{mode.desc}</p>
              <button className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold text-primary-foreground bg-primary transition-all duration-200 hover:opacity-90 shadow-[0_4px_16px_hsl(25_55%_58%/0.25)]">
                <Play className="w-3.5 h-3.5" /> Start Practice
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
              </button>
            </div>
          ))}
        </div>

        {/* Recent Sessions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[15px] font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Recent Practice Sessions</h2>
            <button className="text-[12px] font-semibold text-primary hover:opacity-80 transition-opacity">View all →</button>
          </div>
          <div className="space-y-3">
            {SESSIONS.map((session, index) => (
              <div key={index} className="bg-card rounded-2xl border border-border p-5 flex items-center gap-5 hover:border-primary/20 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mic className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-bold text-foreground mb-1">{session.type}</h3>
                  <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-medium">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{session.date}</span>
                    <span className="flex items-center gap-1"><Mic className="w-3.5 h-3.5" />{session.duration}</span>
                    <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />{session.questions} questions</span>
                  </div>
                </div>
                <ScoreBadge score={session.score} />
                <button className="px-4 py-2 rounded-xl border border-border text-[12px] font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors duration-200 shrink-0">
                  View Report
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Tip */}
        <div className="bg-card rounded-2xl border border-border p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-[0_4px_12px_hsl(25_55%_58%/0.25)]">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-[14px] font-bold text-foreground">Pro Tip</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/15 px-2 py-0.5 rounded-lg">AI Insight</span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Practice regularly to build confidence. Our AI analyzes your responses for content quality, communication style, and delivery. Focus on the <span className="font-semibold text-foreground">STAR method</span> (Situation, Task, Action, Result) for behavioral questions.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-primary">
                <TrendingUp className="w-3.5 h-3.5" /> 87% avg improvement after 5 sessions
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
