"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScrollImageRevealProps {
  children: ReactNode;
  className?: string;
}

export function ScrollImageReveal({ children, className = "" }: ScrollImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translate3d(0, 0, 0) scale(1)"
            : "translate3d(0, 30px, 0) scale(1.08)",
          transition: "opacity 1s ease-out, transform 1s ease-out",
          willChange: "opacity, transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default ScrollImageReveal;
