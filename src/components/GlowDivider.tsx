"use client";

import { useEffect, useRef } from "react";

export function GlowDivider() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: { x: number; y: number; size: number; opacity: number; speed: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.3 + 0.1,
      });
    }

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(152, 168, 246, ${p.opacity * (0.5 + 0.5 * Math.sin(Date.now() * 0.001 * p.speed))})`;
        ctx.fill();
        p.y -= p.speed * 0.3;
        if (p.y < -5) {
          p.y = h + 5;
          p.x = Math.random() * w;
        }
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative h-32 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-[60%] h-[1px]">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent blur-sm" />
        <div className="absolute -inset-y-2 inset-x-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-md" />
        <div className="absolute -inset-y-4 inset-x-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-xl" />
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[80px] bg-primary/8 rounded-full blur-[60px]" />
    </div>
  );
}
