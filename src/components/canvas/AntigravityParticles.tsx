import React, { useEffect, useRef } from 'react';
import { useSystem } from '../../context/SystemContext';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
  baseOpacity: number;
  isBlue: boolean;
}

export const AntigravityParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { physicsConfig, mousePos } = useSystem();
  const mouseRef = useRef(mousePos);

  useEffect(() => {
    mouseRef.current = mousePos;
  }, [mousePos]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const count = Math.min(physicsConfig.particleCount, window.innerWidth < 768 ? 25 : 75);
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: 0.3 + Math.random() * 1.5,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.2 - Math.random() * 0.4,
        size: 0.8 + Math.random() * 1.8,
        baseOpacity: 0.15 + Math.random() * 0.35,
        isBlue: Math.random() > 0.65
      });
    }

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const parallaxX = mouseRef.current.normalizedX * 15 * physicsConfig.parallaxIntensity;
      const parallaxY = mouseRef.current.normalizedY * 15 * physicsConfig.parallaxIntensity;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx * physicsConfig.floatSpeed;
        p.y += p.vy * physicsConfig.floatSpeed * physicsConfig.gravityScale;

        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140 && dist > 0) {
          const force = (140 - dist) / 140;
          p.x += (dx / dist) * force * 1.2;
          p.y += (dy / dist) * force * 1.2;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const screenX = p.x - parallaxX * p.z;
        const screenY = p.y - parallaxY * p.z;
        const renderSize = p.size * p.z;

        if (p.isBlue) {
          ctx.fillStyle = `rgba(0, 229, 255, ${p.baseOpacity * 1.2})`;
          ctx.shadowColor = '#00E5FF';
          ctx.shadowBlur = 4;
        } else {
          ctx.fillStyle = `rgba(30, 30, 30, ${p.baseOpacity * 0.7})`;
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(screenX, screenY, renderSize, 0, Math.PI * 2);
        ctx.fill();

        // Technical connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cdist < 85) {
            const lineOpacity = (1 - cdist / 85) * 0.08;
            ctx.strokeStyle = p.isBlue || p2.isBlue ? `rgba(0, 229, 255, ${lineOpacity * 2})` : `rgba(0, 0, 0, ${lineOpacity})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(screenX, screenY);
            ctx.lineTo(p2.x - parallaxX * p2.z, p2.y - parallaxY * p2.z);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [physicsConfig]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1] w-full h-full"
    />
  );
};
