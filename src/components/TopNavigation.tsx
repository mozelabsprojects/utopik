"use client";

import React from "react";

import { calculateTaxIncome, calculateMaintenanceCost } from "@/lib/game-engine";
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
  
  if (gameData) {
    let factions = INITIAL_FACTIONS;
    try {
      factions = JSON.parse(gameData.factions);
    } catch {}
    
    let unlockedTechs: string[] = [];
    try {
      unlockedTechs = JSON.parse(gameData.unlockedTechs || "[]");
    } catch {}

    const tax = calculateTaxIncome(
      gameData.education, gameData.health, gameData.environment, 
      gameData.military, gameData.stability, gameData.happiness, 
      factions.capitalists?.support || 50, [], "Orta"
    );
    const maintenance = calculateMaintenanceCost(
      gameData.military, gameData.health, gameData.education, 
      gameData.environment, gameData.stability, [], 
      gameData.budget, "Orta", unlockedTechs
    );
    netIncome = tax - maintenance;
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
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
          <span className="text-xl">📅</span>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">TUR</p>
            <p className="font-[family-name:var(--font-display)] font-bold text-lg leading-none">{turn}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-lg border border-green-500/20 text-green-400">
          <span className="text-xl">💰</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider">BÜTÇE</p>
            <p className="font-[family-name:var(--font-display)] font-bold text-lg leading-none">${budget.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 rounded-lg border border-purple-500/20 text-purple-400">
          <span className="text-xl">📜</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider">POLİTİK SERMAYE</p>
            <p className="font-[family-name:var(--font-display)] font-bold text-lg leading-none">{politicalCapital}</p>
          </div>
        </div>

        {/* MİNİ DASHBOARD: Net Gelir & RP */}
        {gameData && (
          <div className="flex gap-2 ml-0 md:ml-4 border-t md:border-t-0 md:border-l border-white/10 pt-2 md:pt-0 md:pl-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${netIncome >= 0 ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
              <span className="text-xl">{netIncome >= 0 ? "📈" : "📉"}</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">NET BÜTÇE</p>
                <p className="font-[family-name:var(--font-display)] font-bold text-md leading-none">
                  {netIncome > 0 ? "+" : ""}${netIncome.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 rounded-lg border border-cyan-500/30 text-cyan-400">
              <span className="text-xl">🔬</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">AR-GE</p>
                <p className="font-[family-name:var(--font-display)] font-bold text-md leading-none">
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
