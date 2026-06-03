"use client";

import { useState } from "react";
import { SiGoogle, SiMeta, SiApple, SiNetflix, SiSpotify, SiUber, SiAirbnb, SiTesla, SiSlack, SiSalesforce } from "react-icons/si";
import { FaMicrosoft, FaAmazon } from "react-icons/fa";
import { ScrollReveal } from "./ScrollReveal";
import type { IconType } from "react-icons";

interface Brand {
  name: string;
  icon: IconType;
  color: string;
}

const BRANDS: Brand[] = [
  { name: "Google",     icon: SiGoogle,     color: "#4285F4" },
  { name: "Microsoft",  icon: FaMicrosoft,  color: "#00A4EF" },
  { name: "Amazon",     icon: FaAmazon,     color: "#FF9900" },
  { name: "Meta",       icon: SiMeta,       color: "#0081FB" },
  { name: "Apple",      icon: SiApple,      color: "#A2AAAD" },
  { name: "Netflix",    icon: SiNetflix,     color: "#E50914" },
  { name: "Spotify",    icon: SiSpotify,    color: "#1DB954" },
  { name: "Uber",       icon: SiUber,       color: "#FFFFFF" },
  { name: "Airbnb",     icon: SiAirbnb,     color: "#FF5A5F" },
  { name: "Tesla",      icon: SiTesla,      color: "#CC0000" },
  { name: "Slack",      icon: SiSlack,      color: "#4A154B" },
  { name: "Salesforce", icon: SiSalesforce, color: "#00A1E0" },
];

function BrandItem({ brand }: { brand: Brand }) {
  const [hovered, setHovered] = useState(false);
  const Icon = brand.icon;

  return (
    <div
      className="flex items-center gap-3 whitespace-nowrap select-none cursor-default transition-all duration-500"
      style={{ opacity: hovered ? 1 : 0.55, transform: hovered ? "scale(1.12)" : "scale(1)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon
        className="w-9 h-9 transition-all duration-500"
        style={{
          color: hovered ? brand.color : "hsl(var(--foreground))",
          filter: hovered ? `drop-shadow(0 0 12px ${brand.color}80)` : "none",
        }}
      />
      <span
        className="text-[15px] font-semibold tracking-wide transition-all duration-500"
        style={{ color: hovered ? "hsl(var(--foreground))" : "hsl(var(--foreground))" }}
      >
        {brand.name}
      </span>
    </div>
  );
}

export function TrustedBySection() {
  return (
    <section className="py-8 border-y border-border/30 overflow-hidden">
      <ScrollReveal direction="up" delay={0}>
        <p className="text-center text-[13px] text-primary/70 tracking-[0.3em] uppercase mb-10 font-semibold">
          ✦ Trusted by professionals at
        </p>
      </ScrollReveal>
      <ScrollReveal direction="up" delay={150}>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="flex gap-8 sm:gap-14 items-center animate-[marquee-scroll_40s_linear_infinite] w-max">
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <BrandItem key={i} brand={brand} />
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

export default TrustedBySection;
