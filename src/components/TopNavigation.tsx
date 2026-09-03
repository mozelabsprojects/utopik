"use client";

import React, { useState } from "react";

import { GameState } from "@/lib/types";
import { calculateNetBudget, BudgetBreakdown } from "@/lib/game-engine";
import { INITIAL_FACTIONS } from "@/lib/factions";
import ResourceDetailsModal from "./ResourceDetailsModal";
import BudgetDetailsModal from "./BudgetDetailsModal";

interface TopNavigationProps {
  turn: number;
  budget: number;
  politicalCapital: number;
  gameData?: import("@/lib/types").GameState;
  onOpenTutorial?: () => void;
  onOpenSettings?: () => void;
  onOpenAchievements?: () => void;
  projectedInvestments?: Record<string, number>;
}

export default function TopNavigation({ turn, budget, politicalCapital, gameData, onOpenTutorial, onOpenSettings, onOpenAchievements, projectedInvestments }: TopNavigationProps) {
  let netIncome = 0;
  let rpGain = 0;
  let budgetBreakdown: BudgetBreakdown | null = null;
  const [showBudgetTooltip, setShowBudgetTooltip] = useState(false); // Can be removed later
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<"energy" | "food" | "materials" | "popularity" | "politicalCapital" | null>(null);
  
  let leaderProfile = { name: "Dengeli", icon: "👤", color: "text-slate-400 border-slate-600/30" };
  
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

    if (eventFlags.includes("LEADER_TECHNOCRAT")) leaderProfile = { name: "Teknokrat", icon: "🧠", color: "text-blue-400 border-blue-500/30" };
    else if (eventFlags.includes("LEADER_GENERAL")) leaderProfile = { name: "General", icon: "🎖️", color: "text-orange-400 border-orange-500/30" };
    else if (eventFlags.includes("LEADER_ECONOMIST")) leaderProfile = { name: "Ekonomist", icon: "💼", color: "text-yellow-400 border-yellow-500/30" };
    else if (eventFlags.includes("LEADER_POPULIST")) leaderProfile = { name: "Halk Adamı", icon: "🤝", color: "text-pink-400 border-pink-500/30" };

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
    <div className="hud-panel-strong rounded-none mb-4 flex flex-col gap-3 animate-slide-in relative z-30">
      
      {/* Üst Sıra: Yönetim & Ekonomi */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-white/5 pb-3">
        
        {/* Sol: Yönetim & Siyaset */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className={`flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg border shadow-inner ${leaderProfile.color}`}>
            <span className="text-xl">{leaderProfile.icon}</span>
            <div>
              <p className="hidden md:block text-[9px] font-bold uppercase tracking-wider opacity-70">LİDER DOKTRİNİ</p>
              <p className="font-[family-name:var(--font-display)] font-bold text-sm leading-none">{leaderProfile.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg border border-white/10 shadow-inner">
            <span className="text-xl">📅</span>
            <div>
              <p className="hidden md:block text-[9px] text-gray-400 font-bold uppercase tracking-wider">TUR</p>
              <p className="font-[family-name:var(--font-display)] font-bold text-lg leading-none text-white">{turn}</p>
            </div>
          </div>

          <div 
            onClick={() => setSelectedResource("politicalCapital")}
            className="group relative flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg border border-white/10 text-[var(--color-accent-secondary)] shadow-inner cursor-pointer transition-colors hover:bg-white/5"
          >
            <span className="text-xl">📜</span>
            <div>
              <p className="hidden md:block text-[9px] font-bold uppercase tracking-wider opacity-70">POLİTİK SERMAYE</p>
              <p className="font-[family-name:var(--font-display)] font-bold text-lg leading-none">{politicalCapital}</p>
            </div>
          </div>

          {gameData && (
            <div 
              onClick={() => setSelectedResource("popularity")}
              className={`flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg border shadow-inner cursor-pointer hover:bg-white/5 transition-colors ${gameData.popularity >= 80 ? 'border-yellow-500/50 text-yellow-400' : (gameData.popularity < 30 ? 'border-red-500/50 text-red-500' : 'border-white/10 text-white')}`}
            >
              <span className="text-xl">👑</span>
              <div>
                <p className="hidden md:block text-[9px] font-bold uppercase tracking-wider opacity-70">POPÜLARİTE</p>
                <p className="font-[family-name:var(--font-display)] font-bold text-lg leading-none">%{gameData.popularity}</p>
              </div>
            </div>
          )}

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
              className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-black/40 cursor-pointer transition-all shadow-inner ${netIncome >= 0 ? 'border-green-500/30 text-green-400 hover:bg-green-500/10' : 'border-red-500/30 text-red-400 hover:bg-red-500/10'}`}
              onClick={() => setIsBudgetModalOpen(true)}
            >
              <span className="text-xl">{netIncome >= 0 ? "📈" : "📉"}</span>
              <div>
                <p className="hidden md:block text-[9px] font-bold uppercase tracking-wider opacity-70">NET BÜTÇE</p>
                <p className="font-[family-name:var(--font-display)] font-bold text-lg leading-none">
                  {netIncome > 0 ? "+" : ""}${netIncome.toLocaleString()}
                </p>
              </div>
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
              <div 
                onClick={() => setSelectedResource("energy")}
                className={`group relative flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg border cursor-pointer shadow-inner transition-colors ${(gameData.energy || 100) < 20 ? 'border-red-500/50 text-red-500 bg-red-950/30' : 'border-white/10 text-yellow-400 hover:bg-white/5'}`}
              >
                <span className="text-xl">⚡</span>
                <div>
                  <p className="hidden md:block text-[9px] font-bold uppercase tracking-wider opacity-70">ENERJİ</p>
                  <p className="font-[family-name:var(--font-display)] font-bold text-lg leading-none">{(gameData.energy || 100).toFixed(0)}</p>
                </div>
              </div>

              <div 
                onClick={() => setSelectedResource("food")}
                className={`group relative flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg border cursor-pointer shadow-inner transition-colors ${(gameData.food || 100) < 20 ? 'border-red-500/50 text-red-500 bg-red-950/30' : 'border-white/10 text-green-400 hover:bg-white/5'}`}
              >
                <span className="text-xl">🌾</span>
                <div>
                  <p className="hidden md:block text-[9px] font-bold uppercase tracking-wider opacity-70">GIDA</p>
                  <p className="font-[family-name:var(--font-display)] font-bold text-lg leading-none">{(gameData.food || 100).toFixed(0)}</p>
                </div>
              </div>

              <div 
                onClick={() => setSelectedResource("materials")}
                className={`group relative flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg border cursor-pointer shadow-inner transition-colors ${(gameData.materials || 100) < 20 ? 'border-red-500/50 text-red-500 bg-red-950/30' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
              >
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
            onClick={onOpenAchievements}
            className="px-3 py-2 rounded-lg font-bold text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 transition-all flex items-center justify-center text-sm shadow-sm"
            title="Zafer Karnesi (Başarımlar)"
          >
            <span className="text-lg">🏆</span>
          </button>
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
      
      {/* Detay Modalı */}
      <ResourceDetailsModal
        isOpen={selectedResource !== null}
        onClose={() => setSelectedResource(null)}
        resourceId={selectedResource}
        value={
          selectedResource === "politicalCapital" ? politicalCapital :
          selectedResource === "popularity" ? (gameData?.popularity || 0) :
          selectedResource === "energy" ? (gameData?.energy || 100) :
          selectedResource === "food" ? (gameData?.food || 100) :
          selectedResource === "materials" ? (gameData?.materials || 100) : 0
        }
      />
      
      {/* Bütçe Detay Modalı */}
      <BudgetDetailsModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        budgetBreakdown={budgetBreakdown}
        netIncome={netIncome}
        projectedInvestments={projectedInvestments}
      />
    </div>
  );
}
