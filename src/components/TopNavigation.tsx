"use client";

import React from "react";

interface TopNavigationProps {
  turn: number;
  budget: number;
  politicalCapital: number;
  onOpenTutorial?: () => void;
  onOpenSettings?: () => void;
}

export default function TopNavigation({ turn, budget, politicalCapital, onOpenTutorial, onOpenSettings }: TopNavigationProps) {
  return (
    <div className="glass-strong rounded-xl p-3 mb-4 flex justify-between items-center animate-slide-in shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-white/5 relative z-30">
      <div className="flex gap-6 items-center">
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
