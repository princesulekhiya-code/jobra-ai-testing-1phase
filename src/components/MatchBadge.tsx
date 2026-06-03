"use client";

import React from "react";

type MatchBadgeProps = {
  match: number;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
};

export default function MatchBadge({ match, onClick, className }: MatchBadgeProps) {
  // Normalize input: accept number or string, fallback to 0 when invalid
  let raw = typeof match === "number" ? match : Number(match);
  if (!Number.isFinite(raw)) raw = 0;
  const pct = Math.max(0, Math.min(100, Math.round(raw)));
  const color = pct >= 80 ? "#34d399" : pct >= 60 ? "var(--primary)" : "#facc15";
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct / 100);

  const content = (
    <>
      <svg width={28} height={28} viewBox="0 0 28 28" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="14" cy="14" r={radius} stroke="rgba(0,0,0,0.08)" strokeWidth="3" fill="none" />
        <circle cx="14" cy="14" r={radius} stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={String(offset)} />
      </svg>
      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)" }}>{pct}%</span>
      <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Match</span>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 transition-colors hover:border-primary/30 hover:bg-secondary/60 ${className ?? ""}`}
        aria-label={`${pct}% match score. View why this job matches.`}
      >
        {content}
      </button>
    );
  }

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }} aria-hidden className={className}>
      {content}
    </div>
  );
}
