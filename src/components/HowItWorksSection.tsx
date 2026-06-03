"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { ScrollFade } from "./ScrollFade";
import { AmbientGlow } from "./AmbientGlow";

function useSwipe(onLeft: () => void, onRight: () => void) {
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);
  const minSwipe = 50;

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) return;
    const dist = touchStart.current - touchEnd.current;
    if (Math.abs(dist) >= minSwipe) {
      if (dist > 0) onLeft();
      else onRight();
    }
  }, [onLeft, onRight]);

  return { onTouchStart, onTouchMove, onTouchEnd };
}

const steps = [
  { num: 1, title: "Upload Your Resume", desc: "Upload your resume (PDF/DOCX) with a job description, specific role, or for a general ATS scan.", tags: ["With JD", "With Role", "General Scan"], accent: "#8b5cf6", img: "/images/step-upload.jpg" },
  { num: 2, title: "ATS Score & Suggestions", desc: "AI analyzes your resume against ATS systems with detailed score breakdown for Format, Skills, Experience, Keywords.", tags: ["ATS Score", "Breakdown", "Keywords"], accent: "#3b82f6", img: "/images/step-ats-score.jpg" },
  { num: 3, title: "AI Upgrades Your Resume", desc: "JOBRA AI rewrites your resume by adding quantified achievements, industry keywords, and proper ATS formatting.", tags: ["AI Rewrite", "Keywords", "Achievements"], accent: "#6366f1", img: "/images/step-ai-upgrade.jpg" },
  { num: 4, title: "Choose a Template", desc: "Pick from 22 professional resume templates. Your AI-improved data is auto-filled. Export as PDF.", tags: ["22 Templates", "Auto-Fill", "PDF Export"], accent: "#06b6d4", img: "/images/step-template.jpg" },
  { num: 5, title: "Smart Job Matching", desc: "JOBRA finds matching job listings with compatibility scores based on your optimized resume.", tags: ["Job Matches", "Compatibility", "Apply Direct"], accent: "#f59e0b", img: "/images/step-job-match.jpg" },
  { num: 6, title: "AI Mock Interview", desc: "Practice with our AI interviewer. Get role-specific questions and real-time scoring.", tags: ["AI Interviewer", "Real-Time Scoring"], accent: "#f43f5e", img: "/images/step-interview.jpg" },
  { num: 7, title: "Expert Mentorship", desc: "Connect with industry professionals for 1-on-1 career coaching and personalized guidance.", tags: ["1-on-1 Sessions", "Industry Pros"], accent: "#a855f7", img: "/images/step-mentorship.jpg" },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (!autoplay) return;
    timerRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4500);
    return () => clearInterval(timerRef.current);
  }, [autoplay]);

  const handleClick = (idx: number) => {
    setAutoplay(false);
    setActiveStep(idx);
    clearInterval(timerRef.current);
    setTimeout(() => setAutoplay(true), 14000);
  };

  const step = steps[activeStep];

  const swipeNext = useCallback(() => {
    if (activeStep < steps.length - 1) handleClick(activeStep + 1);
  }, [activeStep, handleClick]);

  const swipePrev = useCallback(() => {
    if (activeStep > 0) handleClick(activeStep - 1);
  }, [activeStep, handleClick]);

  const swipeHandlers = useSwipe(swipeNext, swipePrev);

  return (
    <section className="py-14 px-4 sm:px-6 relative overflow-hidden">
      <AmbientGlow position="top-left" />
      <ScrollReveal>
        <div className="max-w-6xl mx-auto">
          <ScrollFade>
            <div className="text-center mb-10 sm:mb-16">
              <span className="text-xs tracking-widest uppercase text-primary">✦ How It Works</span>
              <h2 className="section-heading mt-4">Your complete career pipeline</h2>
              <p className="section-subheading mx-auto mt-4">From resume upload to dream job, 7 steps, fully guided by AI.</p>
            </div>
          </ScrollFade>

          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            <div className="space-y-2" onMouseEnter={() => setAutoplay(false)} onMouseLeave={() => setAutoplay(true)}>
              {steps.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleClick(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${i === activeStep ? "bg-primary/[0.06] border border-primary/15" : "border border-transparent hover:bg-accent/20"}`}
                >
                  <span className="text-xs font-mono text-muted-foreground w-5">{s.num}</span>
                  <span className={`text-sm ${i === activeStep ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s.title}</span>
                </button>
              ))}
            </div>

            <div className="glass-card rounded-2xl overflow-hidden relative touch-pan-y" {...swipeHandlers}>
              <div className="absolute inset-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={activeStep}
                  src={step.img}
                  alt=""
                  loading="lazy"
                  width={800}
                  height={512}
                  className="w-full h-full object-cover opacity-25 scale-105 animate-fade-in"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/70" />
                <div
                  className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-10 transition-colors duration-700"
                  style={{ background: step.accent }}
                />
              </div>

              <div className="relative z-10 p-5 sm:p-8">
                <div className="text-xs text-muted-foreground mb-2">Step {step.num} of 7</div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg">{step.desc}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {step.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: `${step.accent}15`, color: step.accent }}>{tag}</span>
                  ))}
                </div>
                <div className="flex gap-1">
                  {steps.map((_, i) => (
                    <div key={i} className="h-1 rounded-full flex-1 transition-all duration-500" style={{ background: i <= activeStep ? step.accent : "rgba(255,255,255,0.06)" }} />
                  ))}
                </div>
                {activeStep < steps.length - 1 && (
                  <button onClick={() => handleClick(activeStep + 1)} className="mt-6 text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                    Next: {steps[activeStep + 1].title}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-8 lg:hidden">
            {steps.map((s, i) => (
              <button key={i} onClick={() => handleClick(i)} className="rounded-full transition-all duration-300" style={{ width: i === activeStep ? "20px" : "8px", height: "8px", background: i === activeStep ? s.accent : "rgba(255,255,255,0.08)" }} />
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

export default HowItWorksSection;
