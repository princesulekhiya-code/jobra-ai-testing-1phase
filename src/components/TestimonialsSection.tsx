"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { ScrollFade } from "./ScrollFade";
import { AmbientGlow } from "./AmbientGlow";

const testimonials = [
  { text: "JOBRA completely changed my job search. The ATS analysis showed exactly what recruiters were looking for. I landed my dream role within 2 weeks.", author: "Sarah Jackson", role: "Product Manager", company: "Google", rating: 5, scoreJump: "58% → 94%" },
  { text: "The insightful direction not only guided my job search but also sharpened my interview skills. A must-have for any professional.", author: "Emily Wilson", role: "Marketing Director", company: "Meta", rating: 5, scoreJump: "45% → 89%" },
  { text: "The interview simulator walked me through real challenges. I felt so prepared that the actual interview felt easy. Absolutely recommend!", author: "Michael Brown", role: "Software Engineer", company: "Microsoft", rating: 5, scoreJump: "62% → 97%" },
  { text: "The ATS score analysis revealed gaps I never knew existed. Within 3 weeks of optimizing, I landed 4 interviews at top-tier companies.", author: "David Kim", role: "UX Designer", company: "Apple", rating: 5, scoreJump: "41% → 92%" },
  { text: "As a career switcher, JOBRA helped me identify transferable skills I didn't know I had. My resume score jumped significantly.", author: "Priya Sharma", role: "Data Analyst", company: "Netflix", rating: 4, scoreJump: "42% → 91%" },
  { text: "The resume builder crafted a version that passed every ATS I submitted to. Multiple offers in one month, impressive results.", author: "James Rodriguez", role: "Frontend Developer", company: "Spotify", rating: 5, scoreJump: "55% → 96%" },
];

function TestimonialCard({ testimonial, onHover }: { testimonial: typeof testimonials[0]; onHover: (h: boolean) => void }) {
  return (
    <div className="w-[260px] sm:w-80 shrink-0 mx-2 sm:mx-3">
      <div className="glass-card rounded-2xl p-6 h-full" onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>
        <div className="flex gap-0.5 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i < testimonial.rating ? "text-primary fill-primary" : "text-muted-foreground"}`} />
          ))}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">&quot;{testimonial.text}&quot;</p>
        {testimonial.scoreJump && (
          <div className="mb-4">
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">ATS Score: {testimonial.scoreJump}</span>
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-accent-foreground">
            {testimonial.author.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{testimonial.author}</p>
            <p className="text-xs text-muted-foreground">{testimonial.role} · {testimonial.company}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const [paused, setPaused] = useState(false);
  const doubledTestimonials = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-14 overflow-hidden relative">
      <AmbientGlow position="bottom-right" />
      <ScrollReveal>
        <ScrollFade>
          <div className="text-center mb-12 px-6">
            <span className="text-xs tracking-widest uppercase text-primary">✦ Success Stories</span>
            <h2 className="section-heading mt-4">Wall of Success</h2>
            <p className="section-subheading mx-auto mt-4">Real professionals, real results. See how JOBRA transformed their careers.</p>
          </div>
        </ScrollFade>

        <div className="relative">
          <div
            className={`flex ${paused ? "" : "animate-[marquee-scroll_40s_linear_infinite]"} w-max cursor-grab active:cursor-grabbing`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => { setTimeout(() => setPaused(false), 2000); }}
          >
            {doubledTestimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} onHover={setPaused} />
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

export default TestimonialsSection;
