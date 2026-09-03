"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

import { GameState } from "@/lib/types";
import { calculateNetBudget, BudgetBreakdown } from "@/lib/game-engine";
import { INITIAL_FACTIONS } from "@/lib/factions";
import { COUNTRIES } from "@/lib/countries-data";
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
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => { setMounted(true); }, []);

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

    budgetBreakdown = calculateNetBudget(gameData, factions, activeLaws, unlockedTechs, ministers, activeCrises, eventFlags, gameData.tradeAgreements || []);
    netIncome = budgetBreakdown.totalNet;

    let baseRP = 8; // Temel üretim
    
    // Teknoloji bonusları
    if (unlockedTechs.includes("modern_agriculture")) baseRP += 1;
    if (unlockedTechs.includes("ai_infrastructure")) baseRP += 1;
    if (unlockedTechs.includes("advanced_robotics")) baseRP += 2;
    if (unlockedTechs.includes("cyber_warfare")) baseRP += 2;
    
    if (unlockedTechs.includes("gene_therapy")) {
      baseRP += 2;
      if (gameData.health >= 90) baseRP += 3;
    }
    
    if (unlockedTechs.includes("quantum_computing")) {
      baseRP += 5;
      if (gameData.inflation <= 2.0) baseRP += 5;
    }
    
    if (unlockedTechs.includes("fusion_power")) {
      baseRP += 5;
      if (gameData.environment >= 90) baseRP += 5;
    }
    
    // 1. Eğitim Katkısı (Eğitim 90 ve üzeri ise +3)
    if (gameData.education >= 90) {
      baseRP += 3;
    }
    
    // 2. Bakan Katkısı (Eğitim Bakanı varsa)
    const hasEduMinister = !!ministers["education"];
    if (hasEduMinister) baseRP += 3;
    
    // 3. Mega Proje Katkısı (Uzay Programı)
    let megaProjects: string[] = [];
    try { megaProjects = JSON.parse(gameData.megaProjects || "[]"); } catch {}
    const hasSpaceProgram = megaProjects.includes("space_program");
    if (hasSpaceProgram) baseRP += 10;
    
    // 4. Eksi Yaptırım (Eğitim düşükse Ar-Ge durur)
    if (gameData.education < 40) baseRP = 0;
    
    // 6. Zorluk çarpanı (game-engine ile senkron)
    const playerDifficulty = COUNTRIES?.find((c: any) => c.name === gameData.countryName)?.difficulty || "Orta";
    let rpDiffMult = 1.0;
    if (playerDifficulty === "Kolay") rpDiffMult = 1.5;
    else if (playerDifficulty === "Zor") rpDiffMult = 0.75;
    else if (playerDifficulty === "Çok Zor") rpDiffMult = 0.5;
    baseRP = Math.floor(baseRP * rpDiffMult);
    
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

      {/* AR-GE (RP) Detay Modalı — createPortal ile body'ye render */}
      {mounted && createPortal(
        <AnimatePresence>
          {isArgeModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsArgeModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-premium border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setIsArgeModalOpen(false)}
                  className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <div className="text-5xl">🔬</div>
                  <div>
                    <h2 className="text-2xl font-black font-[family-name:var(--font-display)] text-white uppercase tracking-widest">
                      Ar-Ge Puanı (RP)
                    </h2>
                    <div className="text-sm font-bold uppercase tracking-widest text-blue-400">
                      Teknoloji Kaynağı
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Toplam RP Kazanımı (Tur Başına)</span>
                    <span className="text-2xl font-black text-blue-400">
                      +{rpGain}
                    </span>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Ar-Ge (Araştırma ve Geliştirme) puanı, Teknoloji Ağacındaki buluşları açmak için kullanılır. RP kazanmak kolay değildir; ülkenizin entelektüel ve bilimsel kapasitesine bağlıdır.
                </p>

                <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/5 space-y-3 mb-6">
                  <h4 className="text-sm font-bold text-slate-100 mb-2 uppercase tracking-widest">Üretim Detayları (Nasıl Kazanılır?)</h4>
                  
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-slate-400">Temel Üretim</span>
                    <span className="font-bold text-green-400">+8 RP</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-slate-400">Bakan (Eğitim)</span>
                    <span className="font-bold text-green-400">+3 RP</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-slate-400">Eğitim Statüsü 90 ve üzeri</span>
                    <span className="font-bold text-green-400">+3 RP</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-slate-400">Modern Tarım & Yapay Zeka</span>
                    <span className="font-bold text-green-400">Her biri +1 RP</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-slate-400">İleri Robotik & Siber Savaş</span>
                    <span className="font-bold text-green-400">Her biri +2 RP</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-slate-400">Gen Terapisi</span>
                    <span className="font-bold text-green-400">+2 RP (Sağlık %90+ ise ekstra +3)</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-slate-400">Kuantum Bilgisayar</span>
                    <span className="font-bold text-green-400">+5 RP (Enflasyon %2 ise ekstra +5)</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Füzyon Enerjisi</span>
                    <span className="font-bold text-green-400">+5 RP (Çevre %90+ ise ekstra +5)</span>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/5 space-y-3 mb-6">
                  <div className="flex gap-3 items-start">
                    <span className="text-blue-400 mt-0.5">💡</span>
                    <p className="text-sm text-slate-300"><strong className="text-slate-100 block mb-0.5">Nasıl Arttırılır?</strong> Eğitim bütçesini yüksek tutun, Eğitim bakanını görevlendirin veya büyük bilimsel Mega Projeleri tamamlayın.</p>
                  </div>
                </div>

                <button
                  onClick={handleInvestScience}
                  disabled={isInvestingScience || (gameData?.budget || 0) < 5000}
                  className="w-full py-4 px-6 rounded-xl font-bold bg-[var(--color-accent-primary)] hover:bg-blue-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-blue-400/30 flex items-center justify-center gap-3"
                >
                  {isInvestingScience ? "Fonlanıyor..." : "🧪 Bilimi Fonla (-$5000) [+5 RP]"}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
