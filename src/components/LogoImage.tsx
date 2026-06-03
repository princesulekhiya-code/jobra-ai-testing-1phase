"use client";

import { useEffect, useRef } from "react";

interface LogoImageProps {
  size?: number;
  className?: string;
}

export function LogoImage({ size = 48, className = "" }: LogoImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;

      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        // Remove near-white pixels (background)
        if (r > 220 && g > 220 && b > 220) {
          d[i + 3] = 0; // fully transparent
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };
    img.src = "/logo.png";
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ height: size, width: "auto", maxWidth: 200 }}
    />
  );
}
