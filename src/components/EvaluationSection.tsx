"use client";

import { ScrollReveal } from "./ScrollReveal";
import { ScrollFade } from "./ScrollFade";
import { Magnetic } from "./Magnetic";

const evaluationItems = [
  {
    title: "Spelling & Grammar",
    description: "Ensure an error-free resume to impress recruiters. Our checker detects mistakes you might miss.",
    image: "/images/eval-spelling.jpg",
  },
  {
    title: "Customization",
    description: "Enter a job title to extract key skills, keywords, and certifications, ensuring your resume aligns with ATS and hiring manager expectations.",
    image: "/images/eval-customization.jpg",
  },
  {
    title: "Summary Statement",
    description: "Highlight your top skills and qualifications in a brief snapshot to capture the hiring manager's attention.",
    image: "/images/eval-summary.jpg",
  },
  {
    title: "Word Choice",
    description: "Use strong action verbs and avoid personal pronouns, fillers, and informal language for a professional tone.",
    image: "/images/eval-wordchoice.jpg",
  },
  {
    title: "Formatting",
    description: "Ensure a polished, visually appealing layout that is ATS-friendly and recruiter-ready.",
    image: "/images/eval-formatting.jpg",
  },
  {
    title: "Optimal Length",
    description: "Keep it concise, one page or ~1,100 characters for easy scanning by employers.",
    image: "/images/eval-length.jpg",
  },
];

export function EvaluationSection() {
  return (
    <section className="py-14 px-4 sm:px-6">
      <ScrollReveal>
        <div className="max-w-6xl mx-auto">
          <ScrollFade>
            <div className="text-center mb-10 sm:mb-16">
              <span className="text-xs tracking-widest uppercase text-primary">✦ Comprehensive Analysis</span>
              <h2 className="section-heading mt-4">What Our ATS Scanner Evaluates</h2>
              <p className="section-subheading mx-auto mt-4">
                Our resume grader analyzes your resume, checking key criteria and providing feedback to optimize it.
              </p>
            </div>
          </ScrollFade>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 lg:row-span-2">
              <BentoCard item={evaluationItems[0]} size="large" delay={0} />
            </div>
            <div>
              <BentoCard item={evaluationItems[1]} size="small" delay={80} />
            </div>
            <div>
              <BentoCard item={evaluationItems[2]} size="small" delay={160} />
            </div>

            <div>
              <BentoCard item={evaluationItems[3]} size="small" delay={240} />
            </div>
            <div>
              <BentoCard item={evaluationItems[4]} size="small" delay={320} />
            </div>
            <div className="lg:col-span-1">
              <BentoCard item={evaluationItems[5]} size="medium" delay={400} />
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

function BentoCard({
  item,
  size,
  delay,
}: {
  item: (typeof evaluationItems)[0];
  size: "large" | "medium" | "small";
  delay: number;
}) {
  const isLarge = size === "large";

  return (
    <ScrollReveal delay={delay} direction="up">
      <Magnetic strength={4} scale={1.05} glow>
        <div
          className={`group relative rounded-2xl overflow-hidden border border-border/40 hover:border-primary/30 transition-all duration-500 cursor-pointer h-full ${
            isLarge ? "min-h-[380px]" : "min-h-[180px]"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            width={640}
            height={512}
            className="absolute inset-0 w-full h-full object-cover opacity-50 transition-all duration-700 group-hover:opacity-65 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-background/20" />
          <div className="relative z-10 h-full flex flex-col justify-end p-6">
            <h3 className={`font-semibold text-foreground mb-2 ${isLarge ? "text-xl" : "text-base"}`}>
              {item.title}
            </h3>
            <p className={`text-muted-foreground leading-relaxed ${isLarge ? "text-sm max-w-md" : "text-xs"}`}>
              {item.description}
            </p>
          </div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
            style={{ background: "radial-gradient(ellipse at bottom, hsl(var(--primary) / 0.06) 0%, transparent 70%)" }}
          />
        </div>
      </Magnetic>
    </ScrollReveal>
  );
}

export default EvaluationSection;
