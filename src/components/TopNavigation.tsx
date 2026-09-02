"use client";

import React, { useState } from "react";

import { calculateNetBudget, BudgetBreakdown } from "@/lib/game-engine";
import { INITIAL_FACTIONS } from "@/lib/factions";

interface TopNavigationProps {
  turn: number;
  budget: number;
  politicalCapital: number;
  gameData?: import("@/lib/types").GameState;
  onOpenTutorial?: () => void;
  onOpenSettings?: () => void;
}

export default function TopNavigation({ turn, budget, politicalCapital, gameData, onOpenTutorial, onOpenSettings }: TopNavigationProps) {
  let netIncome = 0;
  let rpGain = 0;
  let budgetBreakdown: BudgetBreakdown | null = null;
  const [showBudgetTooltip, setShowBudgetTooltip] = useState(false);
  
  if (gameData) {
    let factions = INITIAL_FACTIONS;
    try {
      factions = JSON.parse(gameData.factions);
    } catch {}
    
    let unlockedTechs: string[] = [];
    try {
      unlockedTechs = JSON.parse(gameData.unlockedTechs || "[]");
    } catch {}

    let activeLaws: string[] = [];
    try { activeLaws = JSON.parse(gameData.activeLaws || "[]"); } catch {}

    let ministers: Record<string, string> = {};
    try { ministers = JSON.parse(gameData.ministers || "{}"); } catch {}

    let activeCrises: string[] = [];
    try { activeCrises = JSON.parse(gameData.activeCrises || "[]"); } catch {}

    let eventFlags: string[] = [];
    try { eventFlags = JSON.parse(gameData.eventFlags || "[]"); } catch {}

    budgetBreakdown = calculateNetBudget(gameData, factions, activeLaws, unlockedTechs, ministers, activeCrises, eventFlags);
    netIncome = budgetBreakdown.totalNet;

    let baseRP = 2;
    if (gameData.education > 60) {
      baseRP += Math.round((gameData.education - 60) / 3);
    } else if (gameData.education < 40) {
      baseRP = Math.max(0, baseRP - 1);
    }
    if (unlockedTechs.includes("quantum_computing")) {
      baseRP = Math.round(baseRP * 1.5);
    }
    rpGain = baseRP;
  }

  return (
    <div className="glass-strong rounded-xl p-3 mb-4 flex flex-col md:flex-row justify-between items-center gap-4 animate-slide-in shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-white/5 relative z-30">
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 items-center">
        <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 bg-[var(--color-bg-main)] rounded-lg border border-[var(--color-border)]">
          <span className="text-lg md:text-xl">📅</span>
          <div>
            <p className="hidden md:block text-[10px] text-gray-400 font-bold uppercase tracking-wider">TUR</p>
            <p className="font-[family-name:var(--font-display)] font-bold text-md md:text-lg leading-none">{turn}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 bg-[var(--color-bg-main)] rounded-lg border border-[var(--color-border)] text-[var(--color-success)]">
          <span className="text-lg md:text-xl">💰</span>
          <div>
            <p className="hidden md:block text-[10px] font-bold uppercase tracking-wider">BÜTÇE</p>
            <p className="font-[family-name:var(--font-display)] font-bold text-md md:text-lg leading-none">${budget.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 bg-[var(--color-bg-main)] rounded-lg border border-[var(--color-border)] text-[var(--color-accent-secondary)]">
          <span className="text-lg md:text-xl">📜</span>
          <div>
            <p className="hidden md:block text-[10px] font-bold uppercase tracking-wider">POLİTİK SERMAYE</p>
            <p className="font-[family-name:var(--font-display)] font-bold text-md md:text-lg leading-none">{politicalCapital}</p>
          </div>
        </div>

        {/* MİNİ DASHBOARD: Net Gelir & RP */}
        {gameData && (
          <div className="flex gap-2 ml-0 md:ml-4 border-t md:border-t-0 md:border-l border-[var(--color-border)] pt-2 md:pt-0 md:pl-4">
            <div 
              className={`relative flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-lg border bg-[var(--color-bg-main)] cursor-help transition-colors ${netIncome >= 0 ? 'border-[var(--color-success)] text-[var(--color-success)] hover:bg-[var(--color-success)]/10' : 'border-[var(--color-danger)] text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10'}`}
              onMouseEnter={() => setShowBudgetTooltip(true)}
              onMouseLeave={() => setShowBudgetTooltip(false)}
            >
              <span className="text-lg md:text-xl">{netIncome >= 0 ? "📈" : "📉"}</span>
              <div>
                <p className="hidden md:block text-[10px] font-bold uppercase tracking-wider text-gray-400">NET BÜTÇE</p>
                <p className="font-[family-name:var(--font-display)] font-bold text-md md:text-lg leading-none">
                  {netIncome > 0 ? "+" : ""}${netIncome.toLocaleString()}
                </p>
              </div>

              {/* Bütçe Kırılımı Tooltip */}
              {showBudgetTooltip && budgetBreakdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-[#111827] border border-gray-700 rounded-lg p-3 shadow-2xl z-50 animate-fade-in pointer-events-none">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider border-b border-gray-700 pb-2 mb-2">Net Bütçe Dağılımı</p>
                  <div className="space-y-1.5 text-sm font-medium">
                    <div className="flex justify-between items-center text-green-400">
                      <span>Vergiler</span>
                      <span>+${budgetBreakdown.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-red-400">
                      <span>Kamu Masrafları</span>
                      <span>-${budgetBreakdown.maintenance.toLocaleString()}</span>
                    </div>
                    {budgetBreakdown.laws !== 0 && (
                      <div className={`flex justify-between items-center ${budgetBreakdown.laws > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        <span>Yasalar</span>
                        <span>{budgetBreakdown.laws > 0 ? '+' : '-'}${Math.abs(budgetBreakdown.laws).toLocaleString()}</span>
                      </div>
                    )}
                    {budgetBreakdown.techs !== 0 && (
                      <div className={`flex justify-between items-center ${budgetBreakdown.techs > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        <span>Teknolojiler</span>
                        <span>{budgetBreakdown.techs > 0 ? '+' : '-'}${Math.abs(budgetBreakdown.techs).toLocaleString()}</span>
                      </div>
                    )}
                    {budgetBreakdown.ministers !== 0 && (
                      <div className={`flex justify-between items-center ${budgetBreakdown.ministers > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        <span>Bakanlar</span>
                        <span>{budgetBreakdown.ministers > 0 ? '+' : '-'}${Math.abs(budgetBreakdown.ministers).toLocaleString()}</span>
                      </div>
                    )}
                    {budgetBreakdown.crises !== 0 && (
                      <div className="flex justify-between items-center text-red-400">
                        <span>Aktif Krizler</span>
                        <span>-${Math.abs(budgetBreakdown.crises).toLocaleString()}</span>
                      </div>
                    )}
                    {budgetBreakdown.special !== 0 && (
                      <div className="flex justify-between items-center text-purple-400">
                        <span>Özel (Juche vs)</span>
                        <span>+${budgetBreakdown.special.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-700 flex justify-between items-center font-bold text-white">
                    <span>Toplam Net</span>
                    <span className={netIncome >= 0 ? "text-green-400" : "text-red-400"}>
                      {netIncome > 0 ? "+" : ""}${netIncome.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 bg-[var(--color-bg-main)] rounded-lg border border-[var(--color-border)] text-[var(--color-education)]">
              <span className="text-lg md:text-xl">🔬</span>
              <div>
                <p className="hidden md:block text-[10px] font-bold uppercase tracking-wider text-gray-400">AR-GE</p>
                <p className="font-[family-name:var(--font-display)] font-bold text-md md:text-lg leading-none">
                  +{rpGain} RP
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onOpenSettings}
          className="px-3 py-2 rounded-lg font-bold text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 transition-all flex items-center justify-center text-sm shadow-sm"
          title="Ayarlar"
        >
          <span className="text-lg">⚙️</span>
        </button>
        <button
          onClick={onOpenTutorial}
          className="px-4 py-2 rounded-lg font-bold text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(0,240,255,0.15)]"
          title="Eğiticiyi Başlat"
        >
          <span className="text-lg">ℹ️</span> Rehber
        </button>
      </div>
    </div>
  );
}
