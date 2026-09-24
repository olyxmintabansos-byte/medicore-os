"use client";

import React, { useEffect, useRef } from "react";

export function ECGWaveform({
  heartRate = 78,
  spo2 = 98,
  systolic = 120,
  diastolic = 80,
}: {
  heartRate?: number;
  spo2?: number;
  systolic?: number;
  diastolic?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let x = 0;
    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    // Grid Background
    const drawGrid = () => {
      ctx.strokeStyle = "rgba(16, 185, 129, 0.08)";
      ctx.lineWidth = 1;

      for (let i = 0; i < width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let j = 0; j < height; j += 20) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
        ctx.stroke();
      }
    };

    drawGrid();

    // ECG rhythm simulator (P-Q-R-S-T wave)
    let cycle = 0;
    const render = () => {
      ctx.fillStyle = "rgba(3, 7, 18, 0.04)";
      ctx.fillRect(x, 0, 8, height);

      let y = midY;
      const progress = cycle % 50;

      if (progress === 10) y = midY - 6; // P wave
      else if (progress === 18) y = midY + 4; // Q dip
      else if (progress === 20) y = midY - 32; // R peak
      else if (progress === 22) y = midY + 12; // S dip
      else if (progress === 32) y = midY - 10; // T wave
      else y = midY + (Math.random() * 2 - 1); // baseline noise

      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#10b981";
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.moveTo(x === 0 ? width - 1 : x - 1, midY);
      ctx.lineTo(x, y);
      ctx.stroke();

      x = (x + 2) % width;
      cycle++;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [heartRate]);

  return (
    <div className="bg-[#050914] border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between space-y-3 font-mono neon-glow-emerald">
      <div className="flex items-center justify-between border-b border-emerald-950/60 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-black text-xs">LEAD II ECG TELEMETRY (LIVE 60Hz)</span>
        </div>
        <span className="text-[10px] text-slate-500">FILTER: 0.5 - 40 Hz</span>
      </div>

      <div className="relative w-full h-24 overflow-hidden rounded-xl bg-[#02050d]">
        <canvas
          ref={canvasRef}
          width={600}
          height={96}
          className="w-full h-full block"
        />
      </div>

      {/* Vital Numbers HUD */}
      <div className="grid grid-cols-3 gap-2 pt-1 text-center">
        <div className="bg-[#091222] border border-emerald-900/50 p-2 rounded-xl">
          <span className="text-[10px] text-slate-400 block">HEART RATE</span>
          <strong className="text-emerald-400 text-lg font-black">{heartRate} <span className="text-[10px] text-slate-400">bpm</span></strong>
        </div>

        <div className="bg-[#091222] border border-cyan-900/50 p-2 rounded-xl">
          <span className="text-[10px] text-slate-400 block">SpO2 PULSE</span>
          <strong className="text-cyan-400 text-lg font-black">{spo2}%</strong>
        </div>

        <div className="bg-[#091222] border border-amber-900/50 p-2 rounded-xl">
          <span className="text-[10px] text-slate-400 block">NIBP (BP)</span>
          <strong className="text-amber-400 text-lg font-black">{systolic}/{diastolic}</strong>
        </div>
      </div>
    </div>
  );
}
