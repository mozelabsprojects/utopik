"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Dashboard from "@/components/Dashboard";
import EventCard from "@/components/EventCard";
import InvestmentPanel from "@/components/InvestmentPanel";
import TurnSummaryModal from "@/components/TurnSummaryModal";
import GameOverModal from "@/components/GameOverModal";
import TopNavigation from "@/components/TopNavigation";
import WorldMap from "@/components/WorldMap";
import FactionsPanel from "@/components/FactionsPanel";
import PoliciesPanel from "@/components/PoliciesPanel";
import CrisesAndQuests from "@/components/CrisesAndQuests";
import MinistersPanel from "@/components/MinistersPanel";
import MegaProjectsPanel from "@/components/MegaProjectsPanel";
import DiplomacyPanel from "@/components/DiplomacyPanel";
import PetitionsModal from "@/components/PetitionsModal";
import GameTutorial from "@/components/GameTutorial";
import GlobalMarketPanel from "@/components/GlobalMarketPanel";
import CentralBankPanel from "@/components/CentralBankPanel";
import SettingsModal from "@/components/SettingsModal";
import Sidebar, { SidebarTab } from "@/components/Sidebar";
import TechTreePanel from "@/components/TechTreePanel";
import AnalyticsPanel from "@/components/AnalyticsPanel";
import ElectionModal from "@/components/ElectionModal";
import VictoryScreen from "@/components/VictoryScreen";
import AchievementsModal from "@/components/AchievementsModal";
import NewsTicker from "@/components/NewsTicker";
import { GameEvent, DominoEffect, Sector, GameState, WorldCountryState } from "@/lib/types";
import { playClickSound, playTurnSound, playAlertSound } from "@/lib/audio";
import { generateAdvisorHints, AdvisorHint } from "@/lib/advisor";
import { COUNTRIES } from "@/lib/countries-data";
import { calculateEra } from "@/lib/game-engine";

interface GameData extends GameState {
  worldCountries: WorldCountryState[];
}

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const gameId = searchParams.get("id");

  const [game, setGame] = useState<GameData | null>(null);
  const [previousGame, setPreviousGame] = useState<GameState | null>(null);
  const [toasts, setToasts] = useState<{id: number, message: string}[]>([]);

  const addToast = (message: string) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };
  const [currentEvents, setCurrentEvents] = useState<GameEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<SidebarTab>("dashboard");

  // Turn transition state
  const [showTransition, setShowTransition] = useState(false);
  const [isTransitionDataReady, setIsTransitionDataReady] = useState(false);
  const [turnData, setTurnData] = useState({
    turnNumber: 0,
    taxIncome: 0,
    maintenanceCost: 0,
    dominoEffects: [] as DominoEffect[],
    tradeIncome: 0,
    budgetBreakdown: undefined as any,
    reports: [] as string[],
    hints: [] as AdvisorHint[],
  });

  // Phase: "event" | "invest"
  const [phase, setPhase] = useState<"event" | "invest">("event");

  // Projected Investments
  const [projectedInvestments, setProjectedInvestments] = useState<Record<string, number>>({});

  // Tutorial modal state
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // Settings modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // Achievements modal state
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [uiScale, setUiScale] = useState(100);

  useEffect(() => {
    const savedScale = localStorage.getItem("utopik_ui_scale");
    if (savedScale) setUiScale(parseInt(savedScale, 10));
  }, []);

  const fetchGameState = useCallback(async () => {
    if (!gameId) return;
    try {
      const res = await fetch(`/api/game/state?gameId=${gameId}`);
      if (!res.ok) throw new Error("Oyun durumu alınamadı");
      const data = await res.json();
      
      const hasSeenTutorial = localStorage.getItem("utopik_tutorial_seen");
      if (!hasSeenTutorial) {
        setIsTutorialOpen(true);
      }

      setGame(data.game);
      
      // Save state check for Continue feature
      if (!data.game.isGameOver) {
        localStorage.setItem("utopik_save_id", data.game.id);
      } else {
        localStorage.removeItem("utopik_save_id");
      }
      setCurrentEvents(data.currentEvents || []);

      if (data.game.currentEventId) {
        setPhase("event");
      } else {
        setPhase("invest");
      }
      
      // We do NOT show TurnSummaryModal here on initial load, only on Next Turn.
      // However, if there are unread reports, we could optionally show them.
      // To simplify and not spam the user on reload, we'll just auto-clear them or leave them.

    } catch (error) {
      console.error("Hata:", error);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    fetchGameState();
  }, [fetchGameState]);

  const [prevAchievementsCount, setPrevAchievementsCount] = useState(0);

  useEffect(() => {
    if (game && game.achievements) {
      try {
        const arr = JSON.parse(game.achievements);
        if (arr.length > prevAchievementsCount && prevAchievementsCount > 0) {
          alert(`🏆 YENİ BAŞARIM KAZANILDI! Zafer Karnesini kontrol edin!`);
          playAlertSound();
        }
        setPrevAchievementsCount(arr.length);
      } catch (e) {}
    }
  }, [game?.achievements]);

  // CHEAT CODES (GOD MODE) LISTENER
  useEffect(() => {
    let keyBuffer = "";
    
    const triggerCheat = async (code: string) => {
      if (!gameId) return;
      try {
        const res = await fetch("/api/game/cheat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId, code }),
        });
        if (res.ok) {
          const data = await res.json();
          setGame(data.game);
          alert(`GİZLİ HİLE KODU AKTİFLEŞTİRİLDİ: ${code.toUpperCase()} 💥`);
          playAlertSound();
        }
      } catch (e) {
        console.error(e);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return; // Typing in an input field
      }
      
      keyBuffer += e.key.toLowerCase();
      if (keyBuffer.length > 20) keyBuffer = keyBuffer.slice(-20);

      if (keyBuffer.endsWith("hesoyam")) {
        triggerCheat("hesoyam");
        keyBuffer = "";
      } else if (keyBuffer.endsWith("aezakmi")) {
        triggerCheat("aezakmi");
        keyBuffer = "";
      } else if (keyBuffer.endsWith("ozan")) {
        triggerCheat("ozan");
        keyBuffer = "";
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameId]);

  const handleChoice = async (eventId: string, label: string) => {
    if (!game || actionLoading) return;
    playClickSound();
    setActionLoading(true);

    // OPTIMISTIC UI: Anında tepki ver
    const previousEvents = [...currentEvents];
    const previousPhase = phase;
    
    const remainingEvents = currentEvents.filter(e => e.id !== eventId);
    setCurrentEvents(remainingEvents);
    if (remainingEvents.length === 0) setPhase("invest");

    try {
      const res = await fetch("/api/game/choice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: game.id, choiceLabel: label, eventId }),
      });

      if (!res.ok) throw new Error("Seçim uygulanamadı");
      const data = await res.json();

      // Farkları hesapla ve Toast göster
      const diffs: string[] = [];
      const addDiff = (name: string, oldVal: number, newVal: number, prefix: string = "") => {
        if (newVal > oldVal) diffs.push(`✅ ${name} +${prefix}${newVal - oldVal}`);
        else if (newVal < oldVal) diffs.push(`❌ ${name} -${prefix}${oldVal - newVal}`);
      };

      addDiff("Bütçe", game.budget, data.game.budget, "$");
      addDiff("İstikrar", game.stability, data.game.stability);
      addDiff("Halk Desteği", game.popularity, data.game.popularity);
      addDiff("Sağlık", game.health, data.game.health);
      addDiff("Eğitim", game.education, data.game.education);
      addDiff("Çevre", game.environment, data.game.environment);
      addDiff("Askeriye", game.military, data.game.military);
      addDiff("Dış İlişkiler", game.foreignRelations, data.game.foreignRelations);
      addDiff("Siyasi Sermaye", game.politicalCapital, data.game.politicalCapital);

      if (diffs.length > 0) {
        addToast(diffs.join(' | '));
      }

      setPreviousGame(game);
      setGame(data.game);
      // Backend'den currentEventId stringini alıp parse edebiliriz ama optimistic update yeterli.
      // Sadece veritabanından gelen game state'i güncelliyoruz.
      if (!data.game.currentEventId) {
        setPhase("invest");
      }
    } catch (error) {
      console.error("Seçim hatası:", error);
      // HATA DURUMUNDA ARAYÜZÜ GERİ AL (F5 Atmaya gerek kalmaz)
      setCurrentEvents(previousEvents);
      setPhase(previousPhase);
      alert("Seçim işlenirken bir ağ hatası oluştu, lütfen tekrar deneyin.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleInvestBulk = async (investments: Record<string, number>) => {
    if (!game || actionLoading) return;
    playClickSound();
    setActionLoading(true);

    try {
      const res = await fetch("/api/game/invest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: game.id, investments }),
      });

      if (!res.ok) throw new Error("Yatırım yapılamadı");
      const data = await res.json();

      setPreviousGame(game);
      setGame(data.game);
    } catch (error) {
      console.error("Yatırım hatası:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleInvest = async (sector: Sector, amount: number) => {
    await handleInvestBulk({ [sector]: amount });
  };

  const handleNextTurn = async () => {
    if (!game || actionLoading) return;
    setActionLoading(true);

    // OPTIMISTIC UI: Sunucuyu beklemeden geçiş ekranını başlat
    // Data henüz hazır değil.
    setTurnData(prev => ({ ...prev, turnNumber: game.turn }));
    setIsTransitionDataReady(false);
    setShowTransition(true);

    try {
      playTurnSound();
      const res = await fetch("/api/game/next-turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: game.id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Tur atlanamadı");
        setShowTransition(false); // GEÇİŞ EKRANINI KAPAT (Takılmayı önler)
        setActionLoading(false);
        return;
      }

      const data = await res.json();

      // Check for alerts
      const oldCrises = JSON.parse(game.activeCrises || "[]");
      const newCrises = JSON.parse(data.game.activeCrises || "[]");
      if (newCrises.length > oldCrises.length || data.turnResult.newEvent) {
        setTimeout(() => playAlertSound(), 400); // 600'den 400'e çekildi
      }

      // Generate hints for the new state
      const hints = generateAdvisorHints(data.game, data.game.factions);
      let parsedReports: string[] = [];
      try {
        parsedReports = JSON.parse(data.game.turnReports || "[]");
      } catch {}

      // Show turn transition
      setTurnData({
        turnNumber: game.turn, // Gösterilen rapor, bitirdiğimiz tura aittir.
        taxIncome: data.turnResult.taxIncome,
        maintenanceCost: data.turnResult.maintenanceCost,
        dominoEffects: data.turnResult.dominoEffects,
        tradeIncome: data.turnResult.tradeIncome || 0,
        budgetBreakdown: data.turnResult.budgetBreakdown,
        reports: parsedReports,
        hints,
      });
      setIsTransitionDataReady(true);

      // Update game state after transition
      setPreviousGame(game);
      setGame(data.game);
      
      if (!data.game.isGameOver) {
        localStorage.setItem("utopik_save_id", data.game.id);
      } else {
        localStorage.removeItem("utopik_save_id");
      }

      setCurrentEvents(data.turnResult.newEvents || []);
      setPhase("event");
    } catch (error) {
      console.error("Tur hatası:", error);
      setShowTransition(false); // HATA DURUMUNDA GEÇİŞ EKRANINI KAPAT
      alert("Tur atlanırken bir ağ hatası oluştu, lütfen tekrar deneyin.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleTrade = async (partnerName: string, amount: number, isInternal: boolean = false) => {
    if (!game) return;
    const endpoint = isInternal ? "/api/game/internal-trade" : "/api/game/trade";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId: game.id, partnerName, investmentAmount: amount }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error);
    }
    // Update budget locally for instant feedback
    setGame(prev => prev ? { ...prev, budget: data.newBudget !== undefined ? data.newBudget : prev.budget - amount } : null);
    return data;
  };

  const handleReadReports = async () => {
    if (!game) return;
    try {
      await fetch("/api/game/read-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: game.id }),
      });
      // Game state update'ine gerek yok, sadece okundu işaretliyoruz.
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuestAction = async (questId: string, action: "complete" | "fail") => {
    if (!game) return;
    const res = await fetch("/api/game/quest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId: game.id, questId, action }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error);
    }
    await fetchGameState(); // Refresh full state
  };

  const handleRestart = () => {
    router.push("/");
  };

  const getThemeClass = () => {
    if (!game) return { theme: "theme-default", bg: "bg-bureaucracy" };
    
    // SNOWBALL ETKİSİ KONTROLÜ
    let activeSnowballEffectStr = (game as any).activeSnowballEffect;
    if (activeSnowballEffectStr && activeSnowballEffectStr !== "null") {
      try {
        const snowball = JSON.parse(activeSnowballEffectStr);
        if (snowball && snowball.turnsRemaining > 0) {
          if (snowball.themeColor === "red") return { theme: "theme-dystopia", bg: "bg-bureaucracy", glow: "ring-4 ring-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.3)]" };
          if (snowball.themeColor === "purple") return { theme: "theme-cyber", bg: "bg-cyber-scan", glow: "ring-4 ring-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.3)]" };
          if (snowball.themeColor === "orange") return { theme: "theme-crisis", bg: "bg-industrial", glow: "ring-4 ring-orange-500/50 shadow-[0_0_50px_rgba(249,115,22,0.3)]" };
        }
      } catch (e) {}
    }

    // Eğer oyunda bir diktatörlük/baskı eventFlag'i varsa
    const eventFlags = game.eventFlags ? (typeof game.eventFlags === 'string' ? JSON.parse(game.eventFlags) : game.eventFlags) : [];
    if (eventFlags.includes("dictatorship")) return { theme: "theme-dystopia", bg: "bg-bureaucracy", glow: "" };
    if (eventFlags.includes("ai_singularity")) return { theme: "theme-cyber", bg: "bg-cyber-scan", glow: "" };
    
    if (game.isBankrupt) return { theme: "theme-bankrupt", bg: "bg-bureaucracy", glow: "" };
    
    // Duruma göre renkler
    if (game.stability < 30 || game.happiness < 30) return { theme: "theme-crisis", bg: "bg-bureaucracy", glow: "" };
    if (game.military > 80 && game.stability < 50) return { theme: "theme-war", bg: "bg-industrial", glow: "" };
    if (game.budget > 1000000 && game.happiness > 80 && game.stability > 80) return { theme: "theme-utopia", bg: "bg-stars", glow: "" };
    
    const era = calculateEra(game);
    let bg = "bg-blueprint";
    if (era === 2) bg = "bg-industrial";
    if (era === 3) bg = "bg-cyber-scan";
    if (era === 4) bg = "bg-stars";

    return { theme: `theme-era-${era}`, bg, glow: "" };
  };

  if (!gameId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Oyun ID bulunamadı. Ana sayfaya dönün.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-spin-gear">⚙️</div>
          <p className="text-gray-400 font-[family-name:var(--font-display)]">
            Yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Oyun bulunamadı.</p>
      </div>
    );
  }

  const { theme, bg, glow } = getThemeClass();
  
  // Achievement/State overlays
  let overlays = "";
  const eventFlags = game.eventFlags ? (typeof game.eventFlags === 'string' ? JSON.parse(game.eventFlags) : game.eventFlags) : [];
  const megaProjects = game.megaProjects ? (typeof game.megaProjects === 'string' ? JSON.parse(game.megaProjects) : game.megaProjects) : [];
  const unlockedTechs = game.unlockedTechs ? (typeof game.unlockedTechs === 'string' ? JSON.parse(game.unlockedTechs) : game.unlockedTechs) : [];

  if (eventFlags.includes("dictatorship")) overlays += " dictatorship-border";
  if (megaProjects.includes("space_program")) overlays += " space-overlay";
  if (unlockedTechs.includes("quantum_computing")) overlays += " glitch-effect";

  // Active Snowball Effect banner logic
  let activeSnowball = null;
  if ((game as any).activeSnowballEffect && (game as any).activeSnowballEffect !== "null") {
    try {
      activeSnowball = JSON.parse((game as any).activeSnowballEffect);
      if (activeSnowball.turnsRemaining <= 0) activeSnowball = null;
    } catch(e) {}
  }

  return (
    <div 
      className={`min-h-screen transition-colors duration-1000 ${theme} ${bg} ${overlays} text-foreground overflow-hidden flex font-[family-name:var(--font-body)]`}
      style={{ zoom: `${uiScale}%` }}
    >
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0 h-full pb-20 md:pb-4 p-2 md:p-4 max-w-[1600px] mx-auto overflow-hidden relative">
        
        {/* Seçim Ekranı */}
        {(() => {
          const eFlags = game.eventFlags ? (typeof game.eventFlags === 'string' ? JSON.parse(game.eventFlags) : game.eventFlags) : [];
          const isDemocracy = COUNTRIES.find(c => c.name === game.countryName)?.regime === "Demokrasi" && !eFlags.includes("dictatorship");
          return game.turn >= (game.nextElectionTurn || 999) && isDemocracy && !game.isGameOver && (
            <ElectionModal 
              gameId={game.id} 
              turn={game.turn} 
              popularity={game.popularity} 
              politicalCapital={game.politicalCapital}
              onComplete={fetchGameState}
            />
          );
        })()}
        
        <GameTutorial 
          activeTab={activeTab} 
          setActiveTab={setActiveTab as any} 
          isOpen={isTutorialOpen}
          onClose={() => setIsTutorialOpen(false)}
          turn={game.turn}
        />
        
        <TopNavigation 
          turn={game.turn}
          budget={game.budget}
          politicalCapital={game.politicalCapital}
          gameData={game}
          onOpenTutorial={() => setIsTutorialOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          projectedInvestments={projectedInvestments}
          onUpdate={fetchGameState}
        />
        
        {/* AKTİF KARTOPU ETKİSİ BİLDİRİMİ */}
        {activeSnowball && (
          <div className={`mx-4 mt-4 p-4 rounded-xl shadow-lg border-2 flex items-center justify-between font-[family-name:var(--font-display)] animate-pulse ${
            activeSnowball.themeColor === 'red' ? 'bg-red-950/40 border-red-500/50 text-red-100' :
            activeSnowball.themeColor === 'purple' ? 'bg-purple-950/40 border-purple-500/50 text-purple-100' :
            activeSnowball.themeColor === 'orange' ? 'bg-orange-950/40 border-orange-500/50 text-orange-100' :
            'bg-blue-950/40 border-blue-500/50 text-blue-100'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wider">{activeSnowball.name}</h3>
                <p className="text-sm opacity-80">{activeSnowball.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{activeSnowball.turnsRemaining}</div>
              <div className="text-xs uppercase opacity-80">Tur Kaldı</div>
            </div>
          </div>
        )}

        <div className={`flex-1 p-2 sm:p-4 lg:p-6 overflow-y-auto w-full transition-all duration-300 relative z-10 ${glow}`}>
          <PetitionsModal 
            gameId={game.id}
            activePetitionsJson={game.activePetitions} 
            onUpdate={fetchGameState} 
          />

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="animate-fade-in flex flex-col gap-4">
            <Dashboard game={game} previousGame={previousGame || undefined} projectedInvestments={projectedInvestments} />
          </div>
        )}

        {/* DECISIONS (Events & Investments) */}
        {activeTab === "decisions" && (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              {phase === "event" && currentEvents.length > 0 ? (
                <div className="space-y-4">
                  {currentEvents.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onChoice={(label) => handleChoice(event.id, label)}
                      disabled={actionLoading}
                      ministersJson={game.ministers}
                    />
                  ))}
                </div>
              ) : phase === "invest" ? (
                <div className="glass-strong rounded-2xl p-4 animate-slide-up flex flex-col items-center justify-center h-full min-h-[200px]">
                  <div className="text-4xl mb-2">✅</div>
                  <h3 className="text-lg font-[family-name:var(--font-display)] font-bold text-[var(--color-accent-primary)] mb-1">
                    Olay Tamamlandı
                  </h3>
                  <p className="text-gray-400 text-sm text-center">
                    Yatırım yapabilir veya tur atlayabilirsiniz.
                  </p>
                </div>
              ) : null}
            </div>
            <div>
              <InvestmentPanel
                budget={game.budget}
                gameData={game}
                onProjectedGainsChange={setProjectedInvestments}
                onInvestBulk={handleInvestBulk}
                onNextTurn={handleNextTurn}
                disabled={actionLoading || (phase === "event" && currentEvents.length > 0)}
              />
            </div>
          </div>
        )}

        {/* MINISTERS */}
        {activeTab === "ministers" && (
          <div className="animate-fade-in space-y-6">
            <MinistersPanel 
              gameId={game.id} 
              politicalCapital={game.politicalCapital}
              currentMinistersJson={game.ministers}
              factionsJson={game.factions}
              turn={game.turn}
              eventFlagsJson={game.eventFlags || "[]"}
              onUpdate={fetchGameState}
            />
          </div>
        )}

        {/* FACTIONS */}
        {activeTab === "factions" && (
          <div className="animate-fade-in space-y-6">
            <FactionsPanel factionsStr={game.factions} />
          </div>
        )}

        {/* POLICIES */}
        {activeTab === "policies" && (
          <div className="animate-fade-in space-y-6">
            <PoliciesPanel gameState={game} onUpdate={fetchGameState} />
          </div>
        )}

        {/* PROJECTS */}
        {activeTab === "projects" && (
          <div className="animate-fade-in space-y-6">
            <MegaProjectsPanel 
              game={game}
              onUpdate={fetchGameState}
            />
          </div>
        )}

        {/* CRISES */}
        {activeTab === "crises" && (
          <div className="animate-fade-in space-y-6">
            <CrisesAndQuests gameState={game} />
          </div>
        )}

        {/* BANK (Merkez Bankası) */}
        {activeTab === "bank" && (
          <div className="animate-fade-in space-y-6">
            <CentralBankPanel gameState={game} onUpdate={fetchGameState} />
          </div>
        )}

        {/* WORLD MAP */}
        {activeTab === "world" && (
          <div className="space-y-6 animate-fade-in">
            <WorldMap 
              countries={game.worldCountries || []} 
              gameState={game} 
              onTrade={handleTrade}
              onUpdate={fetchGameState}
            />
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-6 animate-fade-in">
            <AnalyticsPanel game={game} />
          </div>
        )}

        {/* DIPLOMACY */}
        {activeTab === "diplomacy" && (
          <div className="space-y-6 animate-fade-in">
            <DiplomacyPanel 
              gameId={game.id} 
              worldCountries={game.worldCountries || []} 
              politicalCapital={game.politicalCapital}
              military={game.military}
              gameState={game}
              onUpdate={fetchGameState}
            />
          </div>
        )}

        {/* MARKET */}
        {activeTab === "market" && (
          <div className="space-y-6 animate-fade-in">
            <GlobalMarketPanel 
              gameId={game.id} 
              budget={game.budget}
              marketStateStr={game.marketState}
              onUpdate={fetchGameState}
            />
          </div>
        )}

        {/* TECH TREE */}
        {activeTab === "tech" && (
          <div className="space-y-6 animate-fade-in">
            <TechTreePanel 
              gameState={game}
              onTechUnlocked={fetchGameState}
            />
          </div>
        )}

      {/* Comprehensive Turn Summary Modal */}
      <TurnSummaryModal
        isVisible={showTransition}
        isDataReady={isTransitionDataReady}
        turnNumber={turnData.turnNumber}
        taxIncome={turnData.taxIncome}
        maintenanceCost={turnData.maintenanceCost}
        budgetBreakdown={turnData.budgetBreakdown}
        dominoEffects={turnData.dominoEffects}
        reports={turnData.reports}
        hints={turnData.hints}
        onComplete={() => {
          setShowTransition(false);
          handleReadReports(); // Clear reports from DB
        }}
      />

        {game.isGameOver && game.gameOverReason && (
          <GameOverModal
            reason={game.gameOverReason}
            turn={game.turn}
            countryName={game.countryName}
            stats={{
              budget: game.budget,
              military: game.military,
              happiness: game.happiness,
              health: game.health,
              environment: game.environment,
              education: game.education,
              stability: game.stability,
              foreignRelations: game.foreignRelations,
            }}
            onRestart={handleRestart}
          />
        )}
        
        {game && !game.isGameOver && calculateEra(game) >= 4 && (
          <VictoryScreen 
            game={game} 
            onRestart={handleRestart} 
          />
        )}
        </div>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        uiScale={uiScale} 
        setUiScale={setUiScale} 
      />
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        unlockedIdsStr={game.achievements}
      />
      {/* TOAST BİLDİRİMLERİ (Sağ Alt Köşe) */}
      <div className="fixed bottom-4 right-4 z-[999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 text-white px-4 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-medium flex items-center shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <NewsTicker gameState={game} />
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4 animate-spin-gear">⚙️</div>
            <p className="text-gray-400 font-[family-name:var(--font-display)]">
              Yükleniyor...
            </p>
          </div>
        </div>
      }
    >
      <GameContent />
    </Suspense>
  );
}
