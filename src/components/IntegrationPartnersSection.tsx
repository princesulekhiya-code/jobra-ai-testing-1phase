"use client";

import { useState } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { FaLinkedinIn } from "react-icons/fa";
import { SiIndeed, SiGlassdoor, SiGoogle, SiMonster } from "react-icons/si";
import { BsBriefcase } from "react-icons/bs";
import type { IconType } from "react-icons";

interface Partner {
  name: string;
  icon: IconType;
  color: string;
}

const partners: Partner[] = [
  { name: "LinkedIn",      icon: FaLinkedinIn, color: "#0A66C2" },
  { name: "Indeed",         icon: SiIndeed,     color: "#2164F3" },
  { name: "Glassdoor",     icon: SiGlassdoor,  color: "#0CAA41" },
  { name: "Google Jobs",   icon: SiGoogle,      color: "#4285F4" },
  { name: "ZipRecruiter",  icon: BsBriefcase,   color: "#5BA71B" },
  { name: "Monster",       icon: SiMonster,     color: "#6E45A5" },
];

function PartnerItem({ partner }: { partner: Partner }) {
  const [hovered, setHovered] = useState(false);
  const Icon = partner.icon;

  return (
    <div
      className="flex flex-col items-center gap-3 cursor-default transition-all duration-500"
      style={{ transform: hovered ? "scale(1.1)" : "scale(1)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-500"
        style={{
          border: `1.5px solid ${hovered ? partner.color + "60" : "hsl(25 15% 20%)"}`,
          background: hovered ? partner.color + "15" : "hsl(25 8% 10% / 0.5)",
          boxShadow: hovered ? `0 0 20px ${partner.color}30` : "none",
        }}
      >
        <Icon
          className="w-7 h-7 transition-all duration-500"
          style={{
            color: hovered ? partner.color : "hsl(var(--foreground))",
            filter: hovered ? `drop-shadow(0 0 8px ${partner.color}80)` : "none",
            opacity: hovered ? 1 : 0.5,
          }}
        />
      </div>
      <span
        className="text-[13px] font-medium transition-all duration-500"
        style={{
          color: hovered ? partner.color : "hsl(var(--muted-foreground))",
        }}
      >
        {partner.name}
      </span>
    </div>
  );
}

export function IntegrationPartnersSection() {
  return (
    <section className="py-14 px-4 sm:px-6">
      <ScrollReveal>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-14">
            <span className="text-[11px] tracking-[0.3em] uppercase text-primary/70 font-medium">
              ✦ Integrations
            </span>
            <h2 className="section-heading mt-4">
              Works With Your Favorite Platforms
            </h2>
            <p className="text-muted-foreground mt-3 text-sm max-w-md mx-auto">
              Seamlessly optimized for top job platforms worldwide.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-14">
            {partners.map((partner, i) => (
              <ScrollReveal key={partner.name} delay={i * 60}>
                <PartnerItem partner={partner} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

export default IntegrationPartnersSection;
