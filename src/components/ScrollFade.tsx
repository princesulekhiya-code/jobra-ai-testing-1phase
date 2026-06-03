"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScrollFadeProps {
  children: ReactNode;
  className?: string;
}

export function ScrollFade({ children, className = "" }: ScrollFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({ opacity: 0, transform: "scale(0.95)" });

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      const center = rect.top + rect.height / 2;
      const distFromCenter = Math.abs(center - vh / 2);
      const maxDist = vh / 2 + rect.height / 2;

      const ratio = Math.max(0, 1 - distFromCenter / maxDist);

      const eased = ratio < 0.3 ? ratio / 0.3 : 1;
      const fadeOut = ratio < 0.15 ? ratio / 0.15 : 1;

      const opacity = Math.min(eased, fadeOut);
      const scale = 0.95 + 0.05 * opacity;

      setStyle({
        opacity,
        transform: `scale(${scale})`,
      });
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        willChange: "opacity, transform",
        transition: "opacity 0.15s linear, transform 0.15s linear",
      }}
    >
      {children}
    </div>
  );
}

export default ScrollFade;
