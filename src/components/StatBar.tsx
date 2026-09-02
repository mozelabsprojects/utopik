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
}

export default function StatBar({ label, value, icon, color, previousValue, projectedGain, pressures }: StatBarProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const isCritical = value < 30;
  const diff = previousValue !== undefined ? value - previousValue : 0;

  const getBarColor = () => {
    if (value >= 70) return "bg-green-400";
    if (value >= 40) return "bg-yellow-400";
    return "bg-red-500";
  };

  const getGradient = () => {
    if (value >= 70) return `linear-gradient(90deg, ${color}, #34d399)`;
    if (value >= 40) return `linear-gradient(90deg, ${color}, #fbbf24)`;
    return `linear-gradient(90deg, #ff2d55, #ff6b6b)`;
  };

  // Hesaplamalar: Pozitif/Negatif toplam pasif etki
  const totalPressure = pressures?.reduce((acc, p) => acc + p.value, 0) || 0;

  return (
    <div 
      className={`relative animate-slide-in ${isCritical ? "animate-pulse-danger rounded-lg" : ""}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex items-center justify-between mb-1.5 cursor-help">
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
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-[#111827] border border-gray-700 rounded-lg p-3 shadow-2xl z-50 animate-fade-in pointer-events-none">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider border-b border-gray-700 pb-2 mb-2">
            Pasif Etkiler ({label})
          </p>
          <div className="space-y-1.5 text-sm font-medium">
            {pressures.map((p, i) => (
              <div key={i} className={`flex justify-between items-center ${p.value > 0 ? 'text-green-400' : 'text-red-400'}`}>
                <span className="truncate pr-2">{p.source}</span>
                <span className="shrink-0">{p.value > 0 ? "+" : ""}{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
