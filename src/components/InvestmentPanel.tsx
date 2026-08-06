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
  onInvest?: (sector: Sector, amount: number) => void;
  onNextTurn: () => void;
  disabled?: boolean;
  gameData?: import("@/lib/types").GameState;
  onProjectedGainsChange?: (gains: Record<string, number>) => void;
  onInvestBulk?: (investments: Record<string, number>) => void;
}

export default function InvestmentPanel({
  budget,
  onInvest,
  onNextTurn,
  disabled,
  gameData,
  onProjectedGainsChange,
  onInvestBulk,
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
        const costPerPoint = 250 * Math.pow(1.045, currentStat);
        gains[sec] = Math.round(effectiveAmount / costPerPoint);
      }
      onProjectedGainsChange(gains);
    }
  };

  const handleInvestAll = async () => {
    if (onInvestBulk) {
      await onInvestBulk(investments);
    } else {
      for (const [sector, amount] of Object.entries(investments)) {
        if (amount > 0 && onInvest) {
          await onInvest(sector as Sector, amount);
        }
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
        {sectors.map((sector) => {
          let currentStat = 50;
          if (gameData) {
            switch(sector) {
              case "military": currentStat = gameData.military; break;
              case "health": currentStat = gameData.health; break;
              case "education": currentStat = gameData.education; break;
              case "environment": currentStat = gameData.environment; break;
              case "stability": currentStat = gameData.stability; break;
              case "foreignRelations": currentStat = gameData.foreignRelations; break;
            }
          }
          
          const isMax = currentStat >= 100;
          
          let projectedGain = 0;
          let isLessThanOne = false;
          if (gameData && investments[sector] > 0) {
            const efficiencyMultiplier = 1 + (gameData.education > 50 ? (gameData.education - 50) / 100 : 0);
            const effectiveAmount = investments[sector] * efficiencyMultiplier;
            const costPerPoint = 250 * Math.pow(1.045, currentStat);
            const rawGain = effectiveAmount / costPerPoint;
            projectedGain = Math.round(rawGain);
            if (projectedGain === 0 && rawGain > 0) {
              isLessThanOne = true;
            }
          }

          return (
            <div key={sector} className={`space-y-1 ${isMax ? "opacity-50 grayscale" : ""}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{SECTOR_ICONS[sector]}</span>
                  <span className="text-xs font-semibold text-gray-300">
                    {SECTOR_LABELS[sector]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {projectedGain > 0 ? (
                    <span className="text-xs font-bold text-green-400">+{projectedGain}</span>
                  ) : isLessThanOne ? (
                    <span className="text-xs font-bold text-green-400">+&lt;1</span>
                  ) : null}
                  {isMax ? (
                    <span className="text-sm font-bold text-gray-400">MAX</span>
                  ) : (
                    <span
                      className="text-sm font-bold"
                      style={{ color: SECTOR_COLORS[sector] }}
                    >
                      ${investments[sector]}
                    </span>
                  )}
                </div>
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
                disabled={disabled || isMax}
                className={`w-full ${isMax ? "cursor-not-allowed" : ""}`}
                style={
                  {
                    "--tw-ring-color": SECTOR_COLORS[sector],
                  } as React.CSSProperties
                }
              />
            </div>
          );
        })}
      </div>

      {/* Siyasi & Sosyal Fonlar (Kuyu) */}
      <div className="mb-4 pt-3 border-t border-slate-700/50">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bütçe Fazlası Fonları</h4>
        <div className="flex gap-2">
          <button
            onClick={() => onInvestBulk && onInvestBulk({ popularityFund: 5000 })}
            disabled={disabled || budget < 5000}
            className="flex-1 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 hover:bg-yellow-500/30 text-yellow-300 text-xs font-bold py-2 px-3 rounded-lg disabled:opacity-30 transition-all flex flex-col items-center justify-center gap-1"
          >
            <span className="text-lg">👑</span>
            <span>Halkla İlişkiler ($5k)</span>
            <span className="text-[9px] text-yellow-500/80">+1 Popülarite</span>
          </button>
          <button
            onClick={() => onInvestBulk && onInvestBulk({ politicalFund: 4000 })}
            disabled={disabled || budget < 4000}
            className="flex-1 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:bg-purple-500/30 text-purple-300 text-xs font-bold py-2 px-3 rounded-lg disabled:opacity-30 transition-all flex flex-col items-center justify-center gap-1"
          >
            <span className="text-lg">📜</span>
            <span>Siyasi Lobi ($4k)</span>
            <span className="text-[9px] text-purple-500/80">+10 Siyasi Sermaye</span>
          </button>
        </div>
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
