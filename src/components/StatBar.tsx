"use client";

import React, { useState } from "react";
import { StatPressure } from "@/lib/game-engine";

interface StatBarProps {
  label: string;
  value: number;
  icon: string;
  color: string;
  previousValue?: number;
  projectedGain?: number;
  pressures?: StatPressure[];
  onClick?: () => void;
}

export default function StatBar({ label, value, icon, color, previousValue, projectedGain, pressures, onClick }: StatBarProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const isCritical = value < 30;
  const isExcellent = value >= 90;
  const diff = previousValue !== undefined ? value - previousValue : 0;

  const getBarColor = () => {
    if (value >= 70) return "bg-green-400";
    if (value >= 40) return "bg-yellow-400";
    return "bg-red-500";
  };

  const getGradient = () => {
    if (value >= 90) return `linear-gradient(90deg, ${color}, #fbbf24, #fcd34d)`;
    if (value >= 70) return `linear-gradient(90deg, ${color}, #34d399)`;
    if (value >= 40) return `linear-gradient(90deg, ${color}, #fbbf24)`;
    return `linear-gradient(90deg, #ff2d55, #ff6b6b)`;
  };

  // Hesaplamalar: Pozitif/Negatif toplam pasif etki
  const totalPressure = pressures?.reduce((acc, p) => acc + p.value, 0) || 0;

  return (
    <div 
      className={`relative animate-slide-in ${
        isCritical ? "animate-pulse border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)] bg-red-950/20" : 
        isExcellent ? "shadow-[0_0_20px_rgba(251,191,36,0.15)] border border-yellow-500/30" : 
        "border border-transparent"
      } rounded-xl ${onClick ? 'cursor-pointer hover:bg-white/5 p-2 transition-all' : 'p-2'}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">{icon}</span>
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {diff !== 0 && (
            <span
              className={`text-xs font-bold ${
                diff > 0 ? "text-green-400" : "text-red-400"
              } animate-fade-in`}
            >
              {diff > 0 ? `+${diff}` : diff}
            </span>
          )}
          {projectedGain !== undefined && projectedGain > 0 && (
            <span className="text-xs font-bold text-green-300 animate-pulse drop-shadow-md">
              +{projectedGain}
            </span>
          )}
          {totalPressure !== 0 && (
            <span className={`text-[10px] px-1 rounded bg-black/50 ${totalPressure > 0 ? 'text-green-400' : 'text-red-400'}`}>
              ({totalPressure > 0 ? '+' : ''}{totalPressure}/tur)
            </span>
          )}
          <span
            className={`text-sm font-bold ${
              isCritical ? "text-red-400" : "text-white"
            }`}
          >
            {Math.round(value)}%
          </span>
        </div>
      </div>
      <div className="stat-bar-track h-2.5 relative bg-slate-800 rounded overflow-hidden">
        {projectedGain !== undefined && projectedGain > 0 && (
          <div
            className="absolute top-0 bottom-0 left-0 bg-white/20 animate-pulse"
            style={{
              width: `${Math.max(0, Math.min(100, value + projectedGain))}%`,
            }}
          />
        )}
        <div
          className="stat-bar-fill relative z-10 h-full transition-all duration-500 ease-out"
          style={{
            width: `${Math.max(0, Math.min(100, value))}%`,
            background: getGradient(),
          }}
        />
      </div>

      {/* Tooltip */}
      {showTooltip && pressures && pressures.length > 0 && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-[9999] animate-slide-up pointer-events-none">
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black/95 border-b border-r border-white/20 transform rotate-45"></div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest border-b border-white/10 pb-2 mb-3 flex items-center gap-2">
            <span className="text-sm">⚡</span> Aktif Etkiler ({label})
          </p>
          <div className="space-y-2 text-xs font-medium relative z-10">
            {pressures.map((p, i) => (
              <div key={i} className={`flex justify-between items-center bg-white/5 px-3 py-2 rounded-lg border ${p.value > 0 ? 'border-green-500/20 text-green-300' : 'border-red-500/20 text-red-300'}`}>
                <span className="truncate pr-2 font-semibold">{p.source}</span>
                <span className="shrink-0 bg-black/50 px-2 py-1 rounded text-[10px] font-black">{p.value > 0 ? "+" : ""}{p.value}/tur</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
