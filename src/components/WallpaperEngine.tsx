import React, { useEffect, useRef } from 'react';
import { WallpaperType } from '../types';

interface WallpaperEngineProps {
  type: WallpaperType;
  blurAmount?: number;
  speed?: number;
  brightness?: number;
}

export const WallpaperEngine: React.FC<WallpaperEngineProps> = ({
  type,
  blurAmount = 0,
  speed = 1,
  brightness = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    // Particle / Drop Data Init
    let particles: any[] = [];

    if (type === 'rain_drops') {
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          length: Math.random() * 20 + 10,
          speed: Math.random() * 6 + 4,
          opacity: Math.random() * 0.4 + 0.1,
          size: Math.random() * 2 + 1
        });
      }
    } else if (type === 'aurora_stars') {
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random(),
          speed: Math.random() * 0.02 + 0.005
        });
      }
    } else if (type === 'fireplace_glow') {
      for (let i = 0; i < 60; i++) {
        particles.push({
          x: Math.random() * width,
          y: height + Math.random() * 50,
          radius: Math.random() * 3 + 1,
          speedY: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.8,
          alpha: Math.random() * 0.8 + 0.2
        });
      }
    }

    let time = 0;

    const render = () => {
      time += 0.015 * speed;
      ctx.clearRect(0, 0, width, height);

      if (type === 'rain_drops') {
        // Dark rainy glass background gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#0c1220');
        bgGrad.addColorStop(1, '#05070c');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Rain streak render
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        particles.forEach((drop) => {
          ctx.strokeStyle = `rgba(180, 220, 255, ${drop.opacity * brightness})`;
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x, drop.y + drop.length);
          ctx.stroke();

          drop.y += drop.speed * speed;
          if (drop.y > height) {
            drop.y = -drop.length;
            drop.x = Math.random() * width;
          }
        });
      } else if (type === 'aurora_stars') {
        // Deep space background
        const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.8);
        bgGrad.addColorStop(0, '#131b2e');
        bgGrad.addColorStop(1, '#07090e');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Aurora Wave Gradient
        const waveY = Math.sin(time) * 40 + height * 0.35;
        const auroraGrad = ctx.createLinearGradient(0, waveY - 80, width, waveY + 80);
        auroraGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        auroraGrad.addColorStop(0.5, `rgba(52, 211, 153, ${0.15 * brightness})`);
        auroraGrad.addColorStop(1, `rgba(168, 85, 247, 0)`);
        ctx.fillStyle = auroraGrad;
        ctx.beginPath();
        ctx.moveTo(0, waveY);
        for (let x = 0; x < width; x += 30) {
          ctx.lineTo(x, waveY + Math.sin(x * 0.005 + time) * 30);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fill();

        // Stars render
        particles.forEach((star) => {
          star.alpha += star.speed;
          const a = (Math.sin(star.alpha) + 1) / 2;
          ctx.fillStyle = `rgba(255, 255, 255, ${a * 0.8 * brightness})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (type === 'fireplace_glow') {
        // Warm hearth background
        const bgGrad = ctx.createRadialGradient(width / 2, height, 0, width / 2, height, height);
        bgGrad.addColorStop(0, '#2d140e');
        bgGrad.addColorStop(1, '#090b10');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Embers render
        particles.forEach((p) => {
          p.y -= p.speedY * speed;
          p.x += p.speedX;
          if (p.y < 0) {
            p.y = height + 20;
            p.x = Math.random() * width;
          }
          ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha * brightness})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (type === 'cyber_grid') {
        ctx.fillStyle = '#080a11';
        ctx.fillRect(0, 0, width, height);

        // Cyber Grid Lines
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 * brightness})`;
        ctx.lineWidth = 1;
        const gridStep = 40;
        const offset = (time * 20) % gridStep;

        for (let x = 0; x < width; x += gridStep) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = offset; y < height; y += gridStep) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, [type, blurAmount, speed, brightness]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none'
      }}
    />
  );
};
