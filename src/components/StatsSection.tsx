"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollReveal } from "./ScrollReveal";

const stats = [
  { value: 50000, suffix: "+", label: "Resumes Analyzed" },
  { value: 95, suffix: "%", label: "ATS Pass Rate" },
  { value: 22, suffix: "", label: "Pro Templates" },
  { value: 12000, suffix: "+", label: "Jobs Matched" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          let c = 0;
          const step = Math.ceil(target / 50);
          const iv = setInterval(() => {
            c += step;
            if (c >= target) {
              setCount(target);
              clearInterval(iv);
            } else {
              setCount(c);
            }
          }, 30);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  const formatted = target >= 1000 ? `${Math.floor(count / 1000)}K` : count;
  const displayTarget = target >= 1000 ? `${Math.floor(target / 1000)}K` : target;

  return (
    <span ref={ref} className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
      {count >= target ? displayTarget : formatted}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-12 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
      <ScrollReveal>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <Counter target={stat.value} suffix={stat.suffix} />
                <p className="text-xs md:text-sm text-muted-foreground mt-2 tracking-wide">{stat.label}</p>
                <div className="w-8 h-px bg-primary/20 mx-auto mt-3 group-hover:w-12 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

export default StatsSection;
