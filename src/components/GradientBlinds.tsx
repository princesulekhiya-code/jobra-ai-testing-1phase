"use client";

import { useEffect, useRef, useCallback } from "react";

interface GradientBlindsProps {
  gradientColors?: string[];
  angle?: number;
  noise?: number;
  blindCount?: number;
  blindMinWidth?: number;
  mouseDampening?: number;
  mirrorGradient?: boolean;
  spotlightRadius?: number;
  spotlightSoftness?: number;
  spotlightOpacity?: number;
  distortAmount?: number;
  shineDirection?: "left" | "right";
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return [r, g, b];
}

export default function GradientBlinds({
  gradientColors = ["#7c5ef0", "#4d35b8"],
  angle = 20,
  noise = 0.5,
  blindCount = 16,
  blindMinWidth = 60,
  mouseDampening = 0.15,
  mirrorGradient = false,
  spotlightRadius = 0.5,
  spotlightSoftness = 1,
  spotlightOpacity = 1,
  distortAmount = 0,
  shineDirection = "left",
}: GradientBlindsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const noiseRef = useRef<Float32Array | null>(null);

  // simple pseudo-random noise texture
  const buildNoise = useCallback((w: number, h: number) => {
    const arr = new Float32Array(w * h);
    for (let i = 0; i < arr.length; i++) arr[i] = Math.random();
    noiseRef.current = arr;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      buildNoise(canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = (e.clientX - rect.left) / rect.width;
      mouseRef.current.targetY = (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener("mousemove", onMouseMove);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;

      // smooth mouse
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * mouseDampening;
      m.y += (m.targetY - m.y) * mouseDampening;

      ctx.clearRect(0, 0, W, H);

      const angleRad = (angle * Math.PI) / 180;
      const blindW = Math.max(blindMinWidth, W / blindCount);
      const totalBlinds = Math.ceil(W / blindW) + 1;

      for (let bi = 0; bi < totalBlinds; bi++) {
        const xStart = bi * blindW;
        const xEnd = xStart + blindW;

        // gradient progress for this blind (0..1)
        const t = mirrorGradient
          ? bi % 2 === 0 ? bi / totalBlinds : 1 - bi / totalBlinds
          : bi / totalBlinds;

        // interpolate between gradient colors
        const colorCount = gradientColors.length;
        const colorPos = t * (colorCount - 1);
        const colorIdx = Math.min(Math.floor(colorPos), colorCount - 2);
        const colorFrac = colorPos - colorIdx;
        const c1 = hexToRgb(gradientColors[colorIdx]);
        const c2 = hexToRgb(gradientColors[colorIdx + 1]);
        const r = Math.round(c1[0] + (c2[0] - c1[0]) * colorFrac);
        const g = Math.round(c1[1] + (c2[1] - c1[1]) * colorFrac);
        const b = Math.round(c1[2] + (c2[2] - c1[2]) * colorFrac);

        // Save and clip to blind strip (with angle)
        ctx.save();
        ctx.beginPath();

        const angleOffset = Math.tan(angleRad) * H;
        ctx.moveTo(xStart - angleOffset, 0);
        ctx.lineTo(xEnd - angleOffset, 0);
        ctx.lineTo(xEnd + angleOffset, H);
        ctx.lineTo(xStart + angleOffset, H);
        ctx.closePath();
        ctx.clip();

        // Distort effect
        const distortX = distortAmount > 0
          ? (m.x - 0.5) * distortAmount * blindW * 0.3 * Math.sin(bi * 0.8)
          : 0;

        // Blind base fill
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(xStart + distortX, 0, blindW, H);

        // Shine — highlight from one side
        const shineX = shineDirection === "left" ? xStart + distortX : xEnd + distortX;
        const shineGrad = ctx.createLinearGradient(shineX, 0, shineX + blindW * (shineDirection === "left" ? 1 : -1), 0);
        shineGrad.addColorStop(0, "rgba(255,255,255,0.18)");
        shineGrad.addColorStop(0.4, "rgba(255,255,255,0.04)");
        shineGrad.addColorStop(1, "rgba(0,0,0,0.22)");
        ctx.fillStyle = shineGrad;
        ctx.fillRect(xStart + distortX, 0, blindW, H);

        // Noise texture overlay
        if (noise > 0 && noiseRef.current) {
          const clampedX = Math.max(0, xStart);
          const clampedW = Math.min(blindW, W - clampedX);
          if (clampedW <= 0 || clampedX >= W) { ctx.restore(); continue; }
          const imgData = ctx.getImageData(clampedX, 0, clampedW, H);
          const d = imgData.data;
          for (let i = 0; i < d.length; i += 4) {
            const px = Math.floor((i / 4) % imgData.width) + clampedX;
            const py = Math.floor((i / 4) / imgData.width);
            const ni = py * W + px;
            const n = (noiseRef.current[ni] ?? 0.5) * 2 - 1;
            const nv = Math.round(n * noise * 40);
            d[i] = Math.max(0, Math.min(255, d[i] + nv));
            d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + nv));
            d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + nv));
          }
          ctx.putImageData(imgData, clampedX, 0);
        }

        ctx.restore();
      }

      // Spotlight overlay (follows mouse)
      if (spotlightOpacity > 0) {
        const sx = m.x * W;
        const sy = m.y * H;
        const radius = Math.max(W, H) * spotlightRadius;
        const spotGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius);
        spotGrad.addColorStop(0, `rgba(255,255,255,${spotlightOpacity * 0.12})`);
        spotGrad.addColorStop(Math.min(1, spotlightSoftness * 0.6), `rgba(255,255,255,${spotlightOpacity * 0.03})`);
        spotGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = spotGrad;
        ctx.fillRect(0, 0, W, H);

        // Dark vignette outside spotlight
        const vigGrad = ctx.createRadialGradient(sx, sy, radius * 0.3, sx, sy, radius * 1.2);
        vigGrad.addColorStop(0, "rgba(0,0,0,0)");
        vigGrad.addColorStop(1, `rgba(0,0,0,${0.55 * spotlightOpacity})`);
        ctx.fillStyle = vigGrad;
        ctx.fillRect(0, 0, W, H);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [gradientColors, angle, noise, blindCount, blindMinWidth, mouseDampening,
      mirrorGradient, spotlightRadius, spotlightSoftness, spotlightOpacity,
      distortAmount, shineDirection, buildNoise]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
}
