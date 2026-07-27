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

    // Particle Data Initialization per Wallpaper Type
    let particles: any[] = [];

    if (type === 'rain_drops') {
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          length: Math.random() * 20 + 10,
          speed: Math.random() * 6 + 4,
          opacity: Math.random() * 0.4 + 0.1
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
    } else if (type === 'cherry_blossoms') {
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 6 + 4,
          speedY: Math.random() * 1.2 + 0.6,
          speedX: Math.random() * 1.5 + 0.5,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.04,
          opacity: Math.random() * 0.6 + 0.3
        });
      }
    } else if (type === 'cyberpunk_matrix') {
      const columns = Math.floor(width / 20);
      for (let i = 0; i < columns; i++) {
        particles.push({
          x: i * 20,
          y: Math.random() * height,
          speed: Math.random() * 4 + 3,
          length: Math.floor(Math.random() * 12 + 6)
        });
      }
    } else if (type === 'ocean_waves') {
      for (let i = 0; i < 70; i++) {
        particles.push({
          x: Math.random() * width,
          y: height * 0.5 + Math.random() * (height * 0.5),
          radius: Math.random() * 2 + 1,
          alpha: Math.random() * 0.7 + 0.3,
          speedX: (Math.random() - 0.5) * 0.6
        });
      }
    } else if (type === 'zen_nebula') {
      for (let i = 0; i < 90; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * (width * 0.4);
        particles.push({
          angle,
          dist,
          radius: Math.random() * 3 + 1,
          speed: Math.random() * 0.002 + 0.001,
          color: Math.random() > 0.4 ? 'rgba(168, 85, 247,' : 'rgba(251, 191, 36,'
        });
      }
    } else if (type === 'fireflies_garden') {
      for (let i = 0; i < 70; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.5 + 1.5,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.03 + 0.015,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          isCyan: Math.random() > 0.65
        });
      }
    } else if (type === 'sunset_synthwave') {
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.7),
          radius: Math.random() * 2 + 1,
          speedY: Math.random() * 0.4 + 0.2,
          alpha: Math.random() * 0.8 + 0.2
        });
      }
    } else if (type === 'autumn_leaves') {
      const colors = ['#f59e0b', '#d97706', '#dc2626', '#b45309', '#fbbf24'];
      for (let i = 0; i < 55; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 7 + 5,
          speedY: Math.random() * 1.2 + 0.6,
          speedX: Math.random() * 0.8 + 0.3,
          swayFreq: Math.random() * 0.02 + 0.01,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.03,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.5 + 0.45
        });
      }
    } else if (type === 'hyperdrive_warp') {
      for (let i = 0; i < 120; i++) {
        particles.push({
          x: (Math.random() - 0.5) * width * 2,
          y: (Math.random() - 0.5) * height * 2,
          z: Math.random() * 1000 + 1,
          prevZ: 1000,
          color: Math.random() > 0.3 ? 'rgba(56, 189, 248,' : Math.random() > 0.5 ? 'rgba(192, 132, 252,' : 'rgba(255, 255, 255,'
        });
      }
    }

    let time = 0;

    const render = () => {
      time += 0.015 * speed;
      ctx.clearRect(0, 0, width, height);

      if (type === 'rain_drops') {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#0c1220');
        bgGrad.addColorStop(1, '#05070c');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        particles.forEach((drop) => {
          ctx.strokeStyle = `rgba(180, 220, 255, ${drop.opacity})`;
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
        const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.8);
        bgGrad.addColorStop(0, '#0f172a');
        bgGrad.addColorStop(0.6, '#090d16');
        bgGrad.addColorStop(1, '#030508');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        const wave1Y = height * 0.38 + Math.sin(time * 0.8) * 35;
        const grad1 = ctx.createLinearGradient(0, wave1Y - 110, 0, wave1Y + 110);
        grad1.addColorStop(0, 'rgba(56, 189, 248, 0)');
        grad1.addColorStop(0.5, 'rgba(52, 211, 153, 0.28)');
        grad1.addColorStop(1, 'rgba(168, 85, 247, 0)');

        ctx.fillStyle = grad1;
        ctx.beginPath();
        ctx.moveTo(0, wave1Y);
        for (let x = 0; x <= width; x += 15) {
          const y = wave1Y + Math.sin(x * 0.004 + time * 1.2) * 45 + Math.cos(x * 0.008 - time * 0.6) * 25;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fill();

        particles.forEach((star) => {
          star.alpha += star.speed * speed;
          star.y -= star.speed * 0.3 * speed;
          star.x += Math.sin(star.alpha) * 0.4;
          if (star.y < 0) {
            star.y = height;
            star.x = Math.random() * width;
          }
          const a = (Math.sin(star.alpha) + 1) / 2;
          ctx.fillStyle = `rgba(255, 255, 255, ${a * 0.85})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (type === 'fireplace_glow') {
        const bgGrad = ctx.createRadialGradient(width / 2, height, 0, width / 2, height, height);
        bgGrad.addColorStop(0, '#2d140e');
        bgGrad.addColorStop(1, '#090b10');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        particles.forEach((p) => {
          p.y -= p.speedY * speed;
          p.x += p.speedX;
          if (p.y < 0) {
            p.y = height + 20;
            p.x = Math.random() * width;
          }
          ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (type === 'cyber_grid') {
        ctx.fillStyle = '#080a11';
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
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
      } else if (type === 'cherry_blossoms') {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#1a0b1e');
        bgGrad.addColorStop(1, '#09050d');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        particles.forEach((p) => {
          p.y += p.speedY * speed;
          p.x += Math.sin(time + p.rotation) * p.speedX;
          p.rotation += p.rotSpeed * speed;

          if (p.y > height + 20 || p.x > width + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = `rgba(244, 114, 182, ${p.opacity})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      } else if (type === 'cyberpunk_matrix') {
        ctx.fillStyle = 'rgba(5, 10, 8, 0.3)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#4ade80';
        ctx.font = '14px monospace';

        particles.forEach((col) => {
          col.y += col.speed * speed;
          if (col.y > height) {
            col.y = -col.length * 20;
          }

          for (let i = 0; i < col.length; i++) {
            const charY = col.y - i * 18;
            if (charY > 0 && charY < height) {
              const alpha = (1 - i / col.length);
              ctx.fillStyle = i === 0 ? '#ffffff' : `rgba(74, 222, 128, ${alpha})`;
              ctx.fillText(String.fromCharCode(0x30a0 + (i % 96)), col.x, charY);
            }
          }
        });
      } else if (type === 'ocean_waves') {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#061325');
        bgGrad.addColorStop(1, '#020710');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Bioluminescent Wave Layers
        for (let wave = 0; wave < 3; wave++) {
          const waveY = height * (0.55 + wave * 0.12) + Math.sin(time + wave) * 20;
          ctx.fillStyle = wave === 0 ? 'rgba(14, 165, 233, 0.15)' : wave === 1 ? 'rgba(20, 184, 166, 0.2)' : 'rgba(56, 189, 248, 0.25)';
          ctx.beginPath();
          ctx.moveTo(0, waveY);
          for (let x = 0; x <= width; x += 20) {
            const y = waveY + Math.sin(x * 0.006 + time * (1 + wave * 0.3)) * (25 + wave * 10);
            ctx.lineTo(x, y);
          }
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.fill();
        }

        particles.forEach((p) => {
          p.x += p.speedX;
          p.y += Math.sin(time + p.x * 0.01) * 0.5;
          if (p.x < 0 || p.x > width) p.x = Math.random() * width;
          ctx.fillStyle = `rgba(45, 212, 191, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (type === 'zen_nebula') {
        const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.7);
        bgGrad.addColorStop(0, '#1e102d');
        bgGrad.addColorStop(1, '#050308');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        particles.forEach((p) => {
          p.angle += p.speed * speed;
          const x = width / 2 + Math.cos(p.angle) * p.dist;
          const y = height / 2 + Math.sin(p.angle) * (p.dist * 0.6);
          ctx.fillStyle = `${p.color} 0.6)`;
          ctx.beginPath();
          ctx.arc(x, y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (type === 'fireflies_garden') {
        const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.85);
        bgGrad.addColorStop(0, '#06201b');
        bgGrad.addColorStop(0.6, '#03110e');
        bgGrad.addColorStop(1, '#010605');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        for (let b = 0; b < 5; b++) {
          const bx = (width * 0.2) + Math.sin(time * 0.5 + b) * 80 + b * (width * 0.18);
          const by = (height * 0.3) + Math.cos(time * 0.3 + b) * 50 + b * (height * 0.12);
          const bGrad = ctx.createRadialGradient(bx, by, 0, bx, by, 120 + b * 40);
          bGrad.addColorStop(0, b % 2 === 0 ? 'rgba(52, 211, 153, 0.06)' : 'rgba(251, 191, 36, 0.05)');
          bGrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = bGrad;
          ctx.beginPath();
          ctx.arc(bx, by, 120 + b * 40, 0, Math.PI * 2);
          ctx.fill();
        }

        particles.forEach((p) => {
          p.x += p.vx * speed;
          p.y += p.vy * speed;
          p.pulse += p.pulseSpeed * speed;

          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;

          const alpha = (Math.sin(p.pulse) + 1) / 2 * 0.85 + 0.15;
          const glowRadius = p.radius * 4;

          const fGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
          const baseColor = p.isCyan ? '52, 211, 153' : '251, 191, 36';
          fGrad.addColorStop(0, `rgba(${baseColor}, ${alpha})`);
          fGrad.addColorStop(0.4, `rgba(${baseColor}, ${alpha * 0.4})`);
          fGrad.addColorStop(1, `rgba(${baseColor}, 0)`);

          ctx.fillStyle = fGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (type === 'sunset_synthwave') {
        // Serene Misty Twilight Dusk Gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#0a0d18');
        bgGrad.addColorStop(0.5, '#141a2e');
        bgGrad.addColorStop(0.8, '#261b2c');
        bgGrad.addColorStop(1, '#130c17');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Soft distant ambient dusk horizon glow
        const horizonY = height * 0.65;
        const horizonGrad = ctx.createRadialGradient(width / 2, horizonY, 0, width / 2, horizonY, width * 0.7);
        horizonGrad.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
        horizonGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.08)');
        horizonGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = horizonGrad;
        ctx.fillRect(0, 0, width, height);

        // Layered Silhouette Mountain Ridges
        const ridge1Y = height * 0.62;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
        ctx.beginPath();
        ctx.moveTo(0, ridge1Y);
        for (let x = 0; x <= width; x += 40) {
          const y = ridge1Y + Math.sin(x * 0.003 + 1) * 35 + Math.cos(x * 0.007) * 20;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fill();

        const ridge2Y = height * 0.72;
        ctx.fillStyle = '#080c14';
        ctx.beginPath();
        ctx.moveTo(0, ridge2Y);
        for (let x = 0; x <= width; x += 30) {
          const y = ridge2Y + Math.sin(x * 0.005 + 2) * 25 + Math.cos(x * 0.009) * 15;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fill();

        // Slow drifting fog / mist layer across horizon
        const fogY = horizonY + Math.sin(time * 0.5) * 15;
        const fogGrad = ctx.createLinearGradient(0, fogY - 40, 0, fogY + 50);
        fogGrad.addColorStop(0, 'rgba(148, 163, 184, 0)');
        fogGrad.addColorStop(0.5, 'rgba(148, 163, 184, 0.12)');
        fogGrad.addColorStop(1, 'rgba(148, 163, 184, 0)');
        ctx.fillStyle = fogGrad;
        ctx.beginPath();
        ctx.moveTo(0, fogY);
        for (let x = 0; x <= width; x += 30) {
          const y = fogY + Math.sin(x * 0.004 + time) * 15;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fill();

        // Floating twilight ambient dust particles
        particles.forEach((p) => {
          p.y -= p.speedY * speed;
          if (p.y < 0) {
            p.y = height;
            p.x = Math.random() * width;
          }
          ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (type === 'autumn_leaves') {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#1c0f0a');
        bgGrad.addColorStop(0.7, '#0f0704');
        bgGrad.addColorStop(1, '#050201');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        const rayGrad = ctx.createRadialGradient(width * 0.8, 0, 0, width * 0.8, 0, width * 0.7);
        rayGrad.addColorStop(0, 'rgba(245, 158, 11, 0.15)');
        rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = rayGrad;
        ctx.fillRect(0, 0, width, height);

        particles.forEach((p) => {
          p.y += p.speedY * speed;
          p.x += Math.sin(time * 2 + p.x * p.swayFreq) * p.speedX;
          p.rotation += p.rotSpeed * speed;

          if (p.y > height + 30) {
            p.y = -30;
            p.x = Math.random() * width;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;

          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.quadraticCurveTo(p.size * 0.8, -p.size * 0.3, p.size * 0.5, p.size * 0.5);
          ctx.quadraticCurveTo(0, p.size * 0.8, 0, p.size);
          ctx.quadraticCurveTo(0, p.size * 0.8, -p.size * 0.5, p.size * 0.5);
          ctx.quadraticCurveTo(-p.size * 0.8, -p.size * 0.3, 0, -p.size);
          ctx.fill();

          ctx.restore();
        });
      } else if (type === 'hyperdrive_warp') {
        const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * 0.75);
        bgGrad.addColorStop(0, '#060b1e');
        bgGrad.addColorStop(0.6, '#03050c');
        bgGrad.addColorStop(1, '#010204');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;
        const fov = 350;

        particles.forEach((p) => {
          p.prevZ = p.z;
          p.z -= 18 * speed;

          if (p.z <= 1) {
            p.z = 1000;
            p.prevZ = 1000;
            p.x = (Math.random() - 0.5) * width * 2;
            p.y = (Math.random() - 0.5) * height * 2;
          }

          const k = fov / p.z;
          const px = p.x * k + cx;
          const py = p.y * k + cy;

          const prevK = fov / p.prevZ;
          const ppx = p.x * prevK + cx;
          const ppy = p.y * prevK + cy;

          if (px >= 0 && px <= width && py >= 0 && py <= height) {
            const alpha = Math.min(1, (1000 - p.z) / 700);
            const lineWidth = Math.max(0.8, (1 - p.z / 1000) * 3);

            ctx.strokeStyle = `${p.color}${alpha})`;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(ppx, ppy);
            ctx.lineTo(px, py);
            ctx.stroke();
          }
        });
      }

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, [type, blurAmount, speed, brightness]);

  const calcFilter = () => {
    const blur = blurAmount > 0 ? `blur(${blurAmount}px)` : '';
    const bright = `brightness(${Math.max(0.01, brightness) * 100}%)`;
    return `${blur} ${bright}`.trim();
  };

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
        filter: calcFilter()
      }}
    />
  );
};

export function generateWallpaperSnapshot(
  type: WallpaperType,
  brightness: number = 1.0,
  width: number = 1920,
  height: number = 1080,
  format: 'image/png' | 'image/jpeg' = 'image/jpeg'
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const time = Math.random() * 10;

  if (type === 'rain_drops') {
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#0c1220');
    bgGrad.addColorStop(1, '#05070c');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    for (let i = 0; i < 160; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const length = Math.random() * 30 + 15;
      const opacity = Math.random() * 0.45 + 0.15;
      ctx.strokeStyle = `rgba(180, 220, 255, ${opacity * brightness})`;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + length);
      ctx.stroke();
    }
  } else if (type === 'aurora_stars') {
    const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.8);
    bgGrad.addColorStop(0, '#131b2e');
    bgGrad.addColorStop(1, '#07090e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const waveY = height * 0.35;
    const auroraGrad = ctx.createLinearGradient(0, waveY - 120, width, waveY + 120);
    auroraGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
    auroraGrad.addColorStop(0.5, `rgba(52, 211, 153, ${0.25 * brightness})`);
    auroraGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');
    ctx.fillStyle = auroraGrad;
    ctx.beginPath();
    ctx.moveTo(0, waveY);
    for (let x = 0; x < width; x += 30) {
      ctx.lineTo(x, waveY + Math.sin(x * 0.005 + time) * 50);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.fill();

    for (let i = 0; i < 200; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 2 + 0.5;
      const alpha = Math.random() * 0.8 + 0.2;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * brightness})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'fireplace_glow') {
    const bgGrad = ctx.createRadialGradient(width / 2, height, 0, width / 2, height, height);
    bgGrad.addColorStop(0, '#2d140e');
    bgGrad.addColorStop(1, '#090b10');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 120; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 4 + 1;
      const alpha = Math.random() * 0.85 + 0.15;
      ctx.fillStyle = `rgba(251, 191, 36, ${alpha * brightness})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'cyber_grid') {
    ctx.fillStyle = '#080a11';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = `rgba(56, 189, 248, ${0.25 * brightness})`;
    ctx.lineWidth = 1.5;
    const gridStep = 40;

    for (let x = 0; x < width; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  } else if (type === 'cherry_blossoms') {
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#1a0b1e');
    bgGrad.addColorStop(1, '#09050d');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 80; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 7 + 4;
      ctx.fillStyle = `rgba(244, 114, 182, ${(Math.random() * 0.6 + 0.3) * brightness})`;
      ctx.beginPath();
      ctx.ellipse(x, y, size, size * 0.5, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'cyberpunk_matrix') {
    ctx.fillStyle = '#050a08';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#4ade80';
    ctx.font = '16px monospace';

    for (let x = 0; x < width; x += 22) {
      const length = Math.floor(Math.random() * 15 + 5);
      const startY = Math.random() * height;
      for (let i = 0; i < length; i++) {
        const y = startY + i * 20;
        if (y < height) {
          ctx.fillStyle = i === 0 ? '#ffffff' : `rgba(74, 222, 128, ${(1 - i / length) * brightness})`;
          ctx.fillText(String.fromCharCode(0x30a0 + (i % 96)), x, y);
        }
      }
    }
  } else if (type === 'ocean_waves') {
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#061325');
    bgGrad.addColorStop(1, '#020710');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    for (let wave = 0; wave < 3; wave++) {
      const waveY = height * (0.55 + wave * 0.12);
      ctx.fillStyle = wave === 0 ? 'rgba(14, 165, 233, 0.2)' : 'rgba(20, 184, 166, 0.25)';
      ctx.beginPath();
      ctx.moveTo(0, waveY);
      for (let x = 0; x <= width; x += 20) {
        ctx.lineTo(x, waveY + Math.sin(x * 0.006 + wave) * 30);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fill();
    }
  } else if (type === 'zen_nebula') {
    const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.7);
    bgGrad.addColorStop(0, '#1e102d');
    bgGrad.addColorStop(1, '#050308');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * (width * 0.4);
      const x = width / 2 + Math.cos(angle) * dist;
      const y = height / 2 + Math.sin(angle) * (dist * 0.6);
      ctx.fillStyle = `rgba(168, 85, 247, ${(Math.random() * 0.7 + 0.2) * brightness})`;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 3 + 1, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'fireflies_garden') {
    const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.85);
    bgGrad.addColorStop(0, '#06201b');
    bgGrad.addColorStop(0.6, '#03110e');
    bgGrad.addColorStop(1, '#010605');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 110; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 3 + 1.5;
      const isCyan = Math.random() > 0.65;
      const alpha = (Math.random() * 0.75 + 0.25) * brightness;
      const glowRadius = radius * 4.5;
      const fGrad = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
      const baseColor = isCyan ? '52, 211, 153' : '251, 191, 36';
      fGrad.addColorStop(0, `rgba(${baseColor}, ${alpha})`);
      fGrad.addColorStop(0.4, `rgba(${baseColor}, ${alpha * 0.4})`);
      fGrad.addColorStop(1, `rgba(${baseColor}, 0)`);
      ctx.fillStyle = fGrad;
      ctx.beginPath();
      ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'sunset_synthwave') {
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#0a0d18');
    bgGrad.addColorStop(0.5, '#141a2e');
    bgGrad.addColorStop(0.8, '#261b2c');
    bgGrad.addColorStop(1, '#130c17');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const horizonY = height * 0.65;
    const horizonGrad = ctx.createRadialGradient(width / 2, horizonY, 0, width / 2, horizonY, width * 0.7);
    horizonGrad.addColorStop(0, `rgba(245, 158, 11, ${0.2 * brightness})`);
    horizonGrad.addColorStop(0.5, `rgba(236, 72, 153, ${0.1 * brightness})`);
    horizonGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = horizonGrad;
    ctx.fillRect(0, 0, width, height);

    const ridge1Y = height * 0.62;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
    ctx.beginPath();
    ctx.moveTo(0, ridge1Y);
    for (let x = 0; x <= width; x += 40) {
      const y = ridge1Y + Math.sin(x * 0.003 + 1) * 35 + Math.cos(x * 0.007) * 20;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.fill();

    const ridge2Y = height * 0.72;
    ctx.fillStyle = '#080c14';
    ctx.beginPath();
    ctx.moveTo(0, ridge2Y);
    for (let x = 0; x <= width; x += 30) {
      const y = ridge2Y + Math.sin(x * 0.005 + 2) * 25 + Math.cos(x * 0.009) * 15;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.fill();

    for (let i = 0; i < 90; i++) {
      ctx.fillStyle = `rgba(251, 191, 36, ${(Math.random() * 0.5 + 0.15) * brightness})`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2 + 1, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'autumn_leaves') {
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#1c0f0a');
    bgGrad.addColorStop(0.7, '#0f0704');
    bgGrad.addColorStop(1, '#050201');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const colors = ['#f59e0b', '#d97706', '#dc2626', '#b45309', '#fbbf24'];
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 8 + 5;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.random() * Math.PI * 2);
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.globalAlpha = (Math.random() * 0.5 + 0.45) * brightness;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(size * 0.8, -size * 0.3, size * 0.5, size * 0.5);
      ctx.quadraticCurveTo(0, size * 0.8, 0, size);
      ctx.quadraticCurveTo(0, size * 0.8, -size * 0.5, size * 0.5);
      ctx.quadraticCurveTo(-size * 0.8, -size * 0.3, 0, -size);
      ctx.fill();
      ctx.restore();
    }
  } else if (type === 'hyperdrive_warp') {
    const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * 0.75);
    bgGrad.addColorStop(0, '#060b1e');
    bgGrad.addColorStop(0.6, '#03050c');
    bgGrad.addColorStop(1, '#010204');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const fov = 350;
    const colors = ['rgba(56, 189, 248,', 'rgba(192, 132, 252,', 'rgba(255, 255, 255,'];

    for (let i = 0; i < 160; i++) {
      const x = (Math.random() - 0.5) * width * 2;
      const y = (Math.random() - 0.5) * height * 2;
      const z = Math.random() * 900 + 50;
      const prevZ = z + 120;
      const k = fov / z;
      const px = x * k + cx;
      const py = y * k + cy;
      const prevK = fov / prevZ;
      const ppx = x * prevK + cx;
      const ppy = y * prevK + cy;

      if (px >= 0 && px <= width && py >= 0 && py <= height) {
        const alpha = Math.min(1, (1000 - z) / 700) * brightness;
        const color = colors[Math.floor(Math.random() * colors.length)];
        ctx.strokeStyle = `${color}${alpha})`;
        ctx.lineWidth = Math.max(1, (1 - z / 1000) * 3.5);
        ctx.beginPath();
        ctx.moveTo(ppx, ppy);
        ctx.lineTo(px, py);
        ctx.stroke();
      }
    }
  }

  return canvas.toDataURL(format, 0.95);
}
