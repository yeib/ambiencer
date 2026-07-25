import React, { useEffect, useRef } from 'react';
import { audioEngine } from '../audio/WebAudioEngine';

interface VisualizerCanvasProps {
  isPlaying: boolean;
  accentColor?: string;
}

export const VisualizerCanvas: React.FC<VisualizerCanvasProps> = ({ isPlaying, accentColor = '#38bdf8' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animFrame: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = audioEngine.getAnalyser();
    const dataArray = new Uint8Array(analyser ? analyser.frequencyBinCount : 32);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;

      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        // Idle ambient pulse wave
        dataArray.fill(0);
      }

      const barCount = 24;
      const barWidth = width / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        let val = isPlaying ? dataArray[i] || 0 : Math.sin((Date.now() / 300) + i) * 10 + 12;
        const barHeight = Math.max(3, (val / 255) * height);
        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, accentColor);
        gradient.addColorStop(1, 'rgba(56, 189, 248, 0.1)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, [isPlaying, accentColor]);

  return (
    <canvas 
      ref={canvasRef} 
      width={140} 
      height={32} 
      style={{ opacity: isPlaying ? 1 : 0.4, transition: 'opacity 0.3s' }}
    />
  );
};
