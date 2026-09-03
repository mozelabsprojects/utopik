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
  gameData?: any;
  onOpenTutorial?: () => void;
  onOpenSettings?: () => void;
  onOpenAchievements?: () => void;
  projectedInvestments?: Record<string, number>;
  onUpdate?: () => void;
}

export default function TopNavigation({ turn, budget, politicalCapital, gameData, onOpenTutorial, onOpenSettings, onOpenAchievements, projectedInvestments, onUpdate }: TopNavigationProps) {
  let netIncome = 0;
  let rpGain = 0;
  let budgetBreakdown: BudgetBreakdown | null = null;
  const [showBudgetTooltip, setShowBudgetTooltip] = useState(false); // Can be removed later
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isArgeModalOpen, setIsArgeModalOpen] = useState(false);
  const [isInvestingScience, setIsInvestingScience] = useState(false);
  const [selectedResource, setSelectedResource] = useState<"energy" | "food" | "materials" | "popularity" | "politicalCapital" | null>(null);

  const handleInvestScience = async () => {
    if (!gameData || gameData.budget < 5000) return;
    setIsInvestingScience(true);
    try {
      const res = await fetch("/api/game/invest-science", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: gameData.id }),
      });
      if (res.ok && onUpdate) {
        onUpdate();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsInvestingScience(false);
    }
  };
  
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

    let baseRP = 1; // Artık temel üretim 1 (tamamen durmasın diye)
    
    // 1. Eğitim Katkısı (Eğitim 75'i geçerse)
    const eduContribution = gameData.education >= 75 ? Math.floor((gameData.education - 70) / 10) : 0;
    baseRP += eduContribution;
    
    // 2. Bakan Katkısı (Eğitim Bakanı varsa)
    const hasEduMinister = Object.values(ministers).includes("min_edu");
    if (hasEduMinister) baseRP += 1;
    
    // 3. Mega Proje Katkısı (Uzay Programı)
    let megaProjects: string[] = [];
    try { megaProjects = JSON.parse(gameData.megaProjects || "[]"); } catch {}
    const hasSpaceProgram = megaProjects.includes("space_program");
    if (hasSpaceProgram) baseRP += 2;
    
    // 4. Eksi Yaptırım (Eğitim düşükse veya bütçe eksi ise Ar-Ge durur)
    if (gameData.education < 40) baseRP = 0;
    if (netIncome < 0) baseRP = Math.max(0, baseRP - 1);
    
    // 5. Kuantum Çarpanı
    if (unlockedTechs.includes("quantum_computing")) {
      baseRP = Math.round(baseRP * 1.5);
    }
    
    // Güvenlik: Asla sıfırın altına inmesin
    rpGain = Math.max(0, baseRP);
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
            <div 
              onClick={() => setIsArgeModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg border border-blue-500/30 text-blue-400 shadow-inner cursor-pointer hover:bg-blue-950/40 transition-colors md:ml-4"
            >
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

      {/* AR-GE (RP) Detay Modalı */}
      {isArgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-6 max-w-sm w-full shadow-[0_0_40px_rgba(59,130,246,0.2)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-[family-name:var(--font-display)] font-bold text-blue-400 flex items-center gap-2">
                <span className="text-2xl">🔬</span> Ar-Ge Puanı (RP)
              </h3>
              <button onClick={() => setIsArgeModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <p className="text-sm text-slate-300 mb-4 border-b border-white/10 pb-4">
              Ar-Ge (Araştırma ve Geliştirme) puanı, Teknoloji Ağacındaki buluşları açmak için kullanılır. RP kazanmak kolay değildir; ülkenizin entelektüel ve bilimsel kapasitesine bağlıdır.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Temel Üretim</span>
                <span className="font-bold text-white">1</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400" title="Eğitim 75'i geçtiğinde bonus verir">Eğitim Seviyesi ({gameData?.education})</span>
                <span className={`font-bold ${gameData && gameData.education >= 75 ? 'text-green-400' : 'text-slate-500'}`}>
                  {gameData && gameData.education >= 75 ? `+${Math.floor((gameData.education - 70) / 10)}` : '0'}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400" title="Eğitim Bakanı ekstra 1 puan sağlar">Bakan (Eğitim)</span>
                <span className={`font-bold ${gameData && Object.values(JSON.parse(gameData.ministers || "{}")).includes("min_edu") ? 'text-green-400' : 'text-slate-500'}`}>
                  {gameData && Object.values(JSON.parse(gameData.ministers || "{}")).includes("min_edu") ? '+1' : '0'}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400" title="Uzay Programı mega projesi +2 RP sağlar">Uzay Programı (Mega Proje)</span>
                <span className={`font-bold ${gameData && JSON.parse(gameData.megaProjects || "[]").includes("space_program") ? 'text-green-400' : 'text-slate-500'}`}>
                  {gameData && JSON.parse(gameData.megaProjects || "[]").includes("space_program") ? '+2' : '0'}
                </span>
              </div>

              {netIncome < 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-red-400" title="Bütçe açığı Ar-Ge yatırımlarını yavaşlatır">Bütçe Açığı Cezası</span>
                  <span className="font-bold text-red-400">-1</span>
                </div>
              )}
              {gameData && gameData.education < 40 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-red-400" title="Eğitim 40'ın altındayken bilim yapılamaz">Eğitim Çöküşü</span>
                  <span className="font-bold text-red-400">Üretim Durdu</span>
                </div>
              )}

              <div className="border-t border-white/10 my-2 pt-2 flex justify-between items-center">
                <span className="font-bold text-blue-400">Net Tur Kazanımı</span>
                <span className="font-bold text-xl text-blue-400">+{rpGain}</span>
              </div>
            </div>

            <div className="text-xs text-blue-300/70 bg-blue-900/20 p-3 rounded-lg border border-blue-500/20 mb-4">
              <strong>Nasıl Arttırılır?</strong><br/>
              Eğitim bütçesini yüksek tutun, Eğitim bakanını görevlendirin veya büyük bilimsel Mega Projeleri tamamlayın.
            </div>

            <button
              onClick={handleInvestScience}
              disabled={isInvestingScience || (gameData?.budget || 0) < 5000}
              className="w-full py-3 px-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            >
              {isInvestingScience ? "Fonlanıyor..." : "🧪 Bilimi Fonla (-$5000) [+5 RP]"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
