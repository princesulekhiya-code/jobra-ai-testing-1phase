"use client";

import { ScrollReveal } from "./ScrollReveal";
import { AmbientGlow } from "./AmbientGlow";

export function DemoVideoSection() {
  return (
    <section className="py-14 px-4 relative overflow-hidden">
      <AmbientGlow position="top-left" />
      <AmbientGlow position="bottom-right" />
      <ScrollReveal>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 px-6">
            <span className="text-[11px] tracking-[0.3em] uppercase text-primary/70 font-medium">✦ Product Preview</span>
            <h2 className="section-heading mt-4">
              Inside JOBRA
            </h2>
            <p className="text-muted-foreground mt-4 text-base max-w-lg mx-auto">
              A glimpse into the resume analysis experience.
            </p>
          </div>

          {/* Laptop frame built with CSS */}
          <div className="relative mx-auto" style={{ maxWidth: 900 }}>
            {/* Screen bezel */}
            <div
              className="relative rounded-xl overflow-hidden border border-[hsl(25_20%_22%)] shadow-2xl"
              style={{
                background: "linear-gradient(180deg, hsl(25 10% 14%) 0%, hsl(25 10% 10%) 100%)",
                padding: "12px 12px 8px 12px",
              }}
            >
              {/* Top bar with dots */}
              <div className="flex items-center gap-2 mb-2 px-2">
                <div className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]" />
                <div className="w-[10px] h-[10px] rounded-full bg-[#febc2e]" />
                <div className="w-[10px] h-[10px] rounded-full bg-[#28c840]" />
                <div className="flex-1 mx-4">
                  <div className="h-5 rounded-md bg-[hsl(25_8%_18%)] border border-[hsl(25_10%_22%)] flex items-center justify-center">
                    <span className="text-[10px] text-muted-foreground/50 font-mono">localhost:3000</span>
                  </div>
                </div>
              </div>

              {/* Screen / video area */}
              <div className="relative w-full rounded-md overflow-hidden bg-black" style={{ aspectRatio: "16/10" }}>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  src="/images/demo-video.mp4"
                />
              </div>
            </div>

            {/* Laptop base / hinge */}
            <div className="relative mx-auto" style={{ width: "60%", height: 14 }}>
              <div
                className="w-full h-full rounded-b-xl"
                style={{
                  background: "linear-gradient(180deg, hsl(25 15% 16%) 0%, hsl(25 12% 12%) 100%)",
                  borderLeft: "1px solid hsl(25 20% 20%)",
                  borderRight: "1px solid hsl(25 20% 20%)",
                  borderBottom: "1px solid hsl(25 20% 20%)",
                }}
              />
            </div>
            <div className="relative mx-auto" style={{ width: "75%", height: 5 }}>
              <div
                className="w-full h-full rounded-b-lg"
                style={{
                  background: "linear-gradient(180deg, hsl(25 12% 14%) 0%, hsl(25 10% 10%) 100%)",
                  borderLeft: "1px solid hsl(25 18% 18%)",
                  borderRight: "1px solid hsl(25 18% 18%)",
                  borderBottom: "1px solid hsl(25 18% 18%)",
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-6 pointer-events-none">
            <span className="rounded-full border border-border/50 bg-background/70 px-3 py-1 text-[11px] text-foreground/80 backdrop-blur-sm">
              Resume Analysis
            </span>
            <span className="rounded-full border border-border/50 bg-background/70 px-3 py-1 text-[11px] text-foreground/80 backdrop-blur-sm">
              ATS Score
            </span>
            <span className="rounded-full border border-border/50 bg-background/70 px-3 py-1 text-[11px] text-foreground/80 backdrop-blur-sm">
              AI Suggestions
            </span>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

export default DemoVideoSection;
