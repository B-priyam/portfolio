"use client";

import { useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
  radius: number;
};

interface CanvasRevealEffectProps {
  animationSpeed?: number;
  containerClassName?: string;
  dotSize?: number;
  colors?: string[];
}

export function CanvasRevealEffect({
  animationSpeed = 0.4,
  containerClassName = "",
  dotSize = 2,
  colors = ["#38bdf8", "#818cf8", "#c084fc"],
}: CanvasRevealEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createPoints();
    };

    const createPoints = () => {
      const spacing = 40;
      pointsRef.current = [];

      for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
          pointsRef.current.push({
            x,
            y,
            radius: Math.random() * 1.5 + dotSize,
          });
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const point of pointsRef.current) {
        const dx = mouseRef.current.x - point.x;
        const dy = mouseRef.current.y - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const maxDistance = 150;
        const opacity = Math.max(0, 1 - distance / maxDistance);

        if (opacity <= 0) continue;

        ctx.beginPath();
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.globalAlpha = opacity;
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    resize();
    animate();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [animationSpeed, dotSize, colors]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${containerClassName}`}
    />
  );
}
