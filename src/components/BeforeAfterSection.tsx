"use client";

import { useState, useEffect, useRef } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { AlertCircle, CheckCircle, ArrowRight, Sparkles, TrendingUp, TrendingDown, Zap } from "lucide-react";

const beforeItems = [
  { label: "Generic keywords", score: 35 },
  { label: "Poor formatting", score: 22 },
  { label: "No metrics", score: 18 },
  { label: "Missing sections", score: 40 },
];
const afterItems = [
  { label: "Targeted keywords", score: 95 },
  { label: "ATS-optimized format", score: 92 },
  { label: "Impact metrics", score: 88 },
  { label: "Complete sections", score: 96 },
];

function AnimatedBar({ score, color, delay = 0 }: { score: number; color: "before" | "after"; delay?: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(score), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [score, delay]);

  return (
    <div ref={ref} className="w-full h-2 bg-secondary/50 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${
          color === "before"
            ? "bg-gradient-to-r from-destructive/80 to-destructive"
            : "bg-gradient-to-r from-primary/80 to-primary"
        }`}
        style={{ width: `${width}%`, transitionDelay: `${delay}ms` }}
      />
    </div>
  );
}

function AnimatedScore({ target, color }: { target: number; color: "before" | "after" }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 1500;
          const steps = 50;
          const inc = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += inc;
            if (current >= target) {
              setValue(target);
              clearInterval(timer);
            } else {
              setValue(Math.floor(current));
            }
          }, duration / steps);
          observer.disconnect();
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center mt-8 pt-6 border-t border-border/30">
      <div className="relative inline-block">
        <div
          className={`absolute -inset-4 rounded-full blur-xl opacity-30 ${
            color === "before" ? "bg-destructive" : "bg-primary"
          }`}
        />
        <span
          className={`relative text-5xl font-bold tabular-nums ${
            color === "before" ? "text-destructive" : "text-primary"
          }`}
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {value}%
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-2">Average ATS Score</p>
    </div>
  );
}

export function BeforeAfterSection() {
  const [isHovered, setIsHovered] = useState<"before" | "after" | null>(null);

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-destructive/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <ScrollReveal>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs tracking-widest uppercase text-primary">✦ Transformation</span>
            <h2 className="section-heading mt-4">Before & After JOBRA</h2>
            <p className="section-subheading mx-auto mt-4">
              See how our AI transforms your resume from overlooked to outstanding.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 relative">
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-14 h-14 rounded-full bg-card border-2 border-primary/40 flex items-center justify-center shadow-xl shadow-primary/20">
                <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
              </div>
            </div>

            <ScrollReveal delay={0} direction="up">
              <div
                onMouseEnter={() => setIsHovered("before")}
                onMouseLeave={() => setIsHovered(null)}
                className={`relative rounded-2xl border overflow-hidden transition-all duration-500 ${
                  isHovered === "before"
                    ? "border-destructive/40 shadow-2xl shadow-destructive/10 scale-[1.01]"
                    : "border-destructive/15"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-card to-card" />

                <div className="relative p-6 pb-0">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-destructive" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-destructive">Before JOBRA</h3>
                        <p className="text-[10px] text-muted-foreground">Unoptimized Resume</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 text-destructive/70 text-xs transition-opacity duration-300 ${isHovered === "before" ? "opacity-100" : "opacity-0"}`}>
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>Low score</span>
                    </div>
                  </div>
                </div>

                <div className="relative px-6 pb-2">
                  {beforeItems.map((item, i) => (
                    <div key={i} className="mb-5 group">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item.label}</span>
                        <span className="text-destructive font-semibold tabular-nums">{item.score}%</span>
                      </div>
                      <AnimatedBar score={item.score} color="before" delay={i * 200} />
                    </div>
                  ))}
                </div>

                <div className="relative px-6 pb-8">
                  <AnimatedScore target={28} color="before" />
                </div>

                <div className="absolute top-6 right-6 w-1.5 h-1.5 rounded-full bg-destructive/30 animate-pulse" />
                <div className="absolute bottom-12 right-10 w-1 h-1 rounded-full bg-destructive/20 animate-pulse" style={{ animationDelay: "1s" }} />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200} direction="up">
              <div
                onMouseEnter={() => setIsHovered("after")}
                onMouseLeave={() => setIsHovered(null)}
                className={`relative rounded-2xl border overflow-hidden transition-all duration-500 ${
                  isHovered === "after"
                    ? "border-primary/40 shadow-2xl shadow-primary/10 scale-[1.01]"
                    : "border-primary/15"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-card to-card" />

                <div
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
                    isHovered === "after" ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    background: "linear-gradient(135deg, transparent 30%, hsl(var(--primary) / 0.06) 50%, transparent 70%)",
                  }}
                />

                <div className="relative p-6 pb-0">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-primary">After JOBRA</h3>
                        <p className="text-[10px] text-muted-foreground">AI-Optimized Resume</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 text-primary/70 text-xs transition-opacity duration-300 ${isHovered === "after" ? "opacity-100" : "opacity-0"}`}>
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+65% boost</span>
                    </div>
                  </div>
                </div>

                <div className="relative px-6 pb-2">
                  {afterItems.map((item, i) => (
                    <div key={i} className="mb-5 group">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-foreground group-hover:text-primary transition-colors">{item.label}</span>
                        <span className="text-primary font-semibold tabular-nums">{item.score}%</span>
                      </div>
                      <AnimatedBar score={item.score} color="after" delay={i * 200 + 400} />
                    </div>
                  ))}
                </div>

                <div className="relative px-6 pb-8">
                  <AnimatedScore target={93} color="after" />
                </div>

                <div className={`absolute top-6 right-6 transition-all duration-500 ${isHovered === "after" ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
                  <Sparkles className="w-4 h-4 text-primary/50" />
                </div>
                <div className={`absolute bottom-16 right-8 transition-all duration-500 delay-100 ${isHovered === "after" ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
                  <Zap className="w-3.5 h-3.5 text-primary/40" />
                </div>
                <div className="absolute top-20 right-4 w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse" />
                <div className="absolute bottom-24 right-14 w-1 h-1 rounded-full bg-primary/20 animate-pulse" style={{ animationDelay: "0.7s" }} />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

export default BeforeAfterSection;
