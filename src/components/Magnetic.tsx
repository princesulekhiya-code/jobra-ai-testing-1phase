"use client";

import { useRef, useState, useCallback, type ReactNode, type MouseEvent } from "react";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  scale?: number;
  glow?: boolean;
}

export function Magnetic({
  children,
  className = "",
  strength = 6,
  scale = 1,
  glow = false,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const handleMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      setStyle({
        transform: `translate(${dx * strength}px, ${dy * strength}px) scale(${scale})`,
        boxShadow: glow
          ? `0 8px 30px hsl(var(--primary) / 0.15), 0 0 0 1px hsl(var(--primary) / 0.1)`
          : undefined,
      });
    },
    [strength, scale, glow]
  );

  const handleLeave = useCallback(() => {
    setStyle({
      transform: "translate(0px, 0px) scale(1)",
      boxShadow: undefined,
    });
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        ...style,
        transition: "transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.35s ease",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

export default Magnetic;
