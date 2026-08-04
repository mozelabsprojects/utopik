"use client";

import { useState } from "react";
import { SECTOR_LABELS } from "@/lib/types";
import type { Sector } from "@/lib/types";

const SECTOR_ICONS: Record<Sector, string> = {
  military: "⚔️",
  health: "🏥",
  education: "📚",
  environment: "🌿",
  stability: "🏛️",
  foreignRelations: "🌍",
};

const SECTOR_COLORS: Record<Sector, string> = {
  military: "#f97316",
  health: "#ef4444",
  education: "#a78bfa",
  environment: "#22c55e",
  stability: "#6366f1",
  foreignRelations: "#06b6d4",
};

interface InvestmentPanelProps {
  budget: number;
  onInvest: (sector: Sector, amount: number) => void;
  onNextTurn: () => void;
  disabled?: boolean;
  gameData?: any;
  onProjectedGainsChange?: (gains: Record<string, number>) => void;
}

export default function InvestmentPanel({
  budget,
  onInvest,
  onNextTurn,
  disabled,
  gameData,
  onProjectedGainsChange,
}: InvestmentPanelProps) {
  const [investments, setInvestments] = useState<Record<Sector, number>>({
    military: 0,
    health: 0,
    education: 0,
    environment: 0,
    stability: 0,
    foreignRelations: 0,
  });

  const totalInvested = Object.values(investments).reduce((a, b) => a + b, 0);
  const remainingBudget = budget - totalInvested;
  const maxPerSector = Math.max(0, budget);

  const handleSliderChange = (sector: Sector, value: number) => {
    const otherTotal = totalInvested - investments[sector];
    const maxForThis = Math.max(0, budget - otherTotal);
    const clampedValue = Math.min(value, maxForThis);

    const newInvestments = { ...investments, [sector]: clampedValue };
    setInvestments(newInvestments);

    if (gameData && onProjectedGainsChange) {
      const efficiencyMultiplier = 1 + (gameData.education > 50 ? (gameData.education - 50) / 100 : 0);
      const gains: Record<string, number> = {};
      
      for (const [sec, amount] of Object.entries(newInvestments)) {
        if (amount <= 0) continue;
        const effectiveAmount = amount * efficiencyMultiplier;
        let currentStat = 50;
        switch(sec) {
          case "military": currentStat = gameData.military; break;
          case "health": currentStat = gameData.health; break;
          case "education": currentStat = gameData.education; break;
          case "environment": currentStat = gameData.environment; break;
          case "stability": currentStat = gameData.stability; break;
          case "foreignRelations": currentStat = gameData.foreignRelations; break;
        }
        const costPerPoint = 100 + Math.pow(currentStat, 1.2) * 4;
        gains[sec] = Math.round(effectiveAmount / costPerPoint);
      }
      onProjectedGainsChange(gains);
    }
  };

  const handleInvestAll = async () => {
    for (const [sector, amount] of Object.entries(investments)) {
      if (amount > 0) {
        await onInvest(sector as Sector, amount);
      }
    }
    setInvestments({
      military: 0,
      health: 0,
      education: 0,
      environment: 0,
      stability: 0,
      foreignRelations: 0,
    });
    if (onProjectedGainsChange) onProjectedGainsChange({});
  };

  const sectors = Object.keys(SECTOR_LABELS) as Sector[];

  return (
    <div className="tutorial-invest glass-strong rounded-2xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <h3 className="text-lg font-[family-name:var(--font-display)] font-bold text-[var(--color-neon-cyan)]">
            Yatırım Paneli
          </h3>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Kalan Bütçe</div>
          <div
            className={`text-lg font-bold ${
              remainingBudget < 0
                ? "text-red-400"
                : remainingBudget < 500
                ? "text-yellow-400"
                : "text-[var(--color-gold)]"
            }`}
          >
            ${Math.round(remainingBudget)}
          </div>
        </div>
      </div>

      {/* Sector sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
        {sectors.map((sector) => (
          <div key={sector} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{SECTOR_ICONS[sector]}</span>
                <span className="text-xs font-semibold text-gray-300">
                  {SECTOR_LABELS[sector]}
                </span>
              </div>
              <span
                className="text-sm font-bold"
                style={{ color: SECTOR_COLORS[sector] }}
              >
                ${investments[sector]}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.min(2000, maxPerSector)}
              step={50}
              value={investments[sector]}
              onChange={(e) =>
                handleSliderChange(sector, parseInt(e.target.value))
              }
              disabled={disabled}
              className="w-full"
              style={
                {
                  "--tw-ring-color": SECTOR_COLORS[sector],
                } as React.CSSProperties
              }
            />
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        {totalInvested > 0 && (
          <button
            onClick={handleInvestAll}
            disabled={disabled || remainingBudget < 0}
            className="btn-primary flex-1 text-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💎 Yatırımları Onayla (${totalInvested})
          </button>
        )}
        <button
          onClick={onNextTurn}
          disabled={disabled}
          className={`${
            totalInvested > 0 ? "flex-1" : "w-full"
          } bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-purple-500/20 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          ⏭️ Tur Atla
        </button>
      </div>
    </div>
  );
}
