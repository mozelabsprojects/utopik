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
    <div className="glass-strong rounded-xl p-3 mb-4 flex flex-col gap-3 animate-slide-in shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-white/5 relative z-30">
      
      {/* Üst Sıra: Yönetim & Ekonomi */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-white/5 pb-3">
        
        {/* Sol: Yönetim & Siyaset */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg border border-white/10 shadow-inner">
            <span className="text-xl">📅</span>
            <div>
              <p className="hidden md:block text-[9px] text-gray-400 font-bold uppercase tracking-wider">TUR</p>
              <p className="font-[family-name:var(--font-display)] font-bold text-lg leading-none text-white">{turn}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg border border-white/10 text-[var(--color-accent-secondary)] shadow-inner">
            <span className="text-xl">📜</span>
            <div>
              <p className="hidden md:block text-[9px] font-bold uppercase tracking-wider opacity-70">POLİTİK SERMAYE</p>
              <p className="font-[family-name:var(--font-display)] font-bold text-lg leading-none">{politicalCapital}</p>
            </div>
          </div>

          {gameData && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg border border-white/10 text-purple-400 shadow-inner">
              <span className="text-xl">👥</span>
              <div>
                <p className="hidden md:block text-[9px] font-bold uppercase tracking-wider opacity-70">NÜFUS</p>
                <p className="font-[family-name:var(--font-display)] font-bold text-lg leading-none">{gameData.population?.toFixed(1) || "10.0"}M</p>
              </div>
            </div>
          )}
        </div>

        {/* Sağ: Ekonomi & Bütçe */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg border border-white/10 text-[var(--color-success)] shadow-inner">
            <span className="text-xl">💰</span>
            <div>
              <p className="hidden md:block text-[9px] font-bold uppercase tracking-wider opacity-70">BÜTÇE</p>
              <p className="font-[family-name:var(--font-display)] font-bold text-lg leading-none">${budget.toLocaleString()}</p>
            </div>
          </div>

          {gameData && (
            <div className={`flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg border shadow-inner ${gameData.inflation && gameData.inflation > 20 ? 'border-red-500/50 text-red-500' : 'border-white/10 text-cyan-400'}`}>
              <span className="text-xl">💸</span>
              <div>
                <p className="hidden md:block text-[9px] font-bold uppercase tracking-wider opacity-70">ENFLASYON</p>
                <p className="font-[family-name:var(--font-display)] font-bold text-lg leading-none">%{gameData.inflation?.toFixed(1) || "5.0"}</p>
              </div>
            </div>
          )}

          {gameData && (
            <div 
              className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-black/40 cursor-help transition-all shadow-inner ${netIncome >= 0 ? 'border-green-500/30 text-green-400 hover:bg-green-500/10' : 'border-red-500/30 text-red-400 hover:bg-red-500/10'}`}
              onMouseEnter={() => setShowBudgetTooltip(true)}
              onMouseLeave={() => setShowBudgetTooltip(false)}
            >
              <span className="text-xl">{netIncome >= 0 ? "📈" : "📉"}</span>
              <div>
                <p className="hidden md:block text-[9px] font-bold uppercase tracking-wider opacity-70">NET BÜTÇE</p>
                <p className="font-[family-name:var(--font-display)] font-bold text-lg leading-none">
                  {netIncome > 0 ? "+" : ""}${netIncome.toLocaleString()}
                </p>
              </div>

              {/* Bütçe Kırılımı Tooltip */}
              {showBudgetTooltip && budgetBreakdown && (
                <div className="absolute top-full right-0 md:left-1/2 md:-translate-x-1/2 mt-2 w-64 bg-[#111827] border border-gray-700 rounded-lg p-3 shadow-2xl z-50 animate-fade-in pointer-events-none">
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
                        <span>Ülkeye Özel Bonuslar</span>
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
          )}
        </div>
      </div>

      {/* Alt Sıra: Kaynaklar, Ar-Ge & Araçlar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        
        {/* Sol: Stratejik Kaynaklar */}
        <div className="flex flex-wrap items-center gap-2">
          {gameData && (
            <>
              <div className={`flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg border shadow-inner ${(gameData.energy || 100) < 20 ? 'border-red-500/50 text-red-500 bg-red-950/30' : 'border-white/10 text-yellow-400'}`}>
                <span className="text-xl">⚡</span>
                <div>
                  <p className="hidden md:block text-[9px] font-bold uppercase tracking-wider opacity-70">ENERJİ</p>
                  <p className="font-[family-name:var(--font-display)] font-bold text-lg leading-none">{(gameData.energy || 100).toFixed(0)}</p>
                </div>
              </div>

              <div className={`flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg border shadow-inner ${(gameData.food || 100) < 20 ? 'border-red-500/50 text-red-500 bg-red-950/30' : 'border-white/10 text-green-400'}`}>
                <span className="text-xl">🌾</span>
                <div>
                  <p className="hidden md:block text-[9px] font-bold uppercase tracking-wider opacity-70">GIDA</p>
                  <p className="font-[family-name:var(--font-display)] font-bold text-lg leading-none">{(gameData.food || 100).toFixed(0)}</p>
                </div>
              </div>

              <div className={`flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg border shadow-inner ${(gameData.materials || 100) < 20 ? 'border-red-500/50 text-red-500 bg-red-950/30' : 'border-white/10 text-gray-400'}`}>
                <span className="text-xl">⚙️</span>
                <div>
                  <p className="hidden md:block text-[9px] font-bold uppercase tracking-wider opacity-70">MATERYAL</p>
                  <p className="font-[family-name:var(--font-display)] font-bold text-lg leading-none">{(gameData.materials || 100).toFixed(0)}</p>
                </div>
              </div>
            </>
          )}

          {gameData && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg border border-white/10 text-blue-400 shadow-inner md:ml-4">
              <span className="text-xl">🔬</span>
              <div>
                <p className="hidden md:block text-[9px] font-bold uppercase tracking-wider opacity-70">AR-GE</p>
                <p className="font-[family-name:var(--font-display)] font-bold text-lg leading-none">
                  +{rpGain} RP
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sağ: Butonlar */}
        <div className="flex gap-2 w-full md:w-auto justify-end">
          <button
            onClick={onOpenSettings}
            className="px-3 py-2 rounded-lg font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center text-sm shadow-sm"
            title="Ayarlar"
          >
            <span className="text-lg">⚙️</span>
          </button>
          <button
            onClick={onOpenTutorial}
            className="px-4 py-2 rounded-lg font-bold text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(0,240,255,0.15)] whitespace-nowrap"
            title="Eğiticiyi Başlat"
          >
            <span className="text-lg">ℹ️</span> Rehber
          </button>
        </div>
      </div>
    </div>
  );
}
