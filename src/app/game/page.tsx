"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import Dashboard from "@/components/Dashboard";
import EventCard from "@/components/EventCard";
import InvestmentPanel from "@/components/InvestmentPanel";
import TurnTransition from "@/components/TurnTransition";
import GameOverModal from "@/components/GameOverModal";
import TopNavigation from "@/components/TopNavigation";
import WorldMap from "@/components/WorldMap";
import TurnReportModal from "@/components/TurnReportModal";
import FactionsPanel from "@/components/FactionsPanel";
import PoliciesPanel from "@/components/PoliciesPanel";
import CrisesAndQuests from "@/components/CrisesAndQuests";
import MinistersPanel from "@/components/MinistersPanel";
import MegaProjectsPanel from "@/components/MegaProjectsPanel";
import DiplomacyPanel from "@/components/DiplomacyPanel";
import PetitionsModal from "@/components/PetitionsModal";
import GameTutorial from "@/components/GameTutorial";
import GlobalMarketPanel from "@/components/GlobalMarketPanel";
import SettingsModal from "@/components/SettingsModal";
import Sidebar, { SidebarTab } from "@/components/Sidebar";
import { GameEvent, DominoEffect, Sector, GameState, WorldCountryState } from "@/lib/types";
import { playClickSound, playTurnSound, playAlertSound } from "@/lib/audio";

interface GameData extends GameState {
  worldCountries: WorldCountryState[];
}

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const gameId = searchParams.get("id");

  const [game, setGame] = useState<GameData | null>(null);
  const [previousGame, setPreviousGame] = useState<GameData | null>(null);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<SidebarTab>("dashboard");

  // Turn transition state
  const [showTransition, setShowTransition] = useState(false);
  const [turnData, setTurnData] = useState({
    turnNumber: 0,
    taxIncome: 0,
    maintenanceCost: 0,
    dominoEffects: [] as DominoEffect[],
    tradeIncome: 0,
  });

  const [showTurnReports, setShowTurnReports] = useState(false);
  const [turnReportsData, setTurnReportsData] = useState<string[]>([]);

  // Phase: "event" | "invest"
  const [phase, setPhase] = useState<"event" | "invest">("event");

  // Projected Investments
  const [projectedInvestments, setProjectedInvestments] = useState<Record<string, number>>({});

  // Tutorial modal state
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // Settings modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
      setCurrentEvent(data.currentEvent);

      if (data.game.currentEventId) {
        setPhase("event");
      } else {
        setPhase("invest");
      }
      
      // Check for unread turn reports
      try {
        const reports = JSON.parse(data.game.turnReports || "[]");
        if (reports.length > 0) {
          setTurnReportsData(reports);
          setShowTurnReports(true);
        }
      } catch {}

    } catch (error) {
      console.error("Hata:", error);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    fetchGameState();
  }, [fetchGameState]);

  const handleChoice = async (label: string) => {
    if (!game || actionLoading) return;
    playClickSound();
    setActionLoading(true);

    // OPTIMISTIC UI: Anında tepki ver
    const previousEvent = currentEvent;
    const previousPhase = phase;
    setCurrentEvent(null);
    setPhase("invest");

    try {
      const res = await fetch("/api/game/choice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: game.id, choiceLabel: label }),
      });

      if (!res.ok) throw new Error("Seçim uygulanamadı");
      const data = await res.json();

      setPreviousGame(game);
      setGame(data.game);
      setCurrentEvent(null);
      setPhase("invest");
    } catch (error) {
      console.error("Seçim hatası:", error);
      // HATA DURUMUNDA ARAYÜZÜ GERİ AL (F5 Atmaya gerek kalmaz)
      setCurrentEvent(previousEvent);
      setPhase(previousPhase);
      alert("Seçim işlenirken bir ağ hatası oluştu, lütfen tekrar deneyin.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleInvest = async (sector: Sector, amount: number) => {
    if (!game || actionLoading) return;
    playClickSound();
    setActionLoading(true);

    try {
      const res = await fetch("/api/game/invest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: game.id, sector, amount }),
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

  const handleNextTurn = async () => {
    if (!game || actionLoading) return;
    setActionLoading(true);

    // OPTIMISTIC UI: Sunucuyu beklemeden geçiş ekranını başlat
    setTurnData({
      turnNumber: game.turn + 1,
      taxIncome: 0,
      maintenanceCost: 0,
      dominoEffects: [],
      tradeIncome: 0,
    });
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
        setTimeout(() => playAlertSound(), 600);
      }

      // Show turn transition
      setTurnData({
        turnNumber: data.game.turn,
        taxIncome: data.turnResult.taxIncome,
        maintenanceCost: data.turnResult.maintenanceCost,
        dominoEffects: data.turnResult.dominoEffects,
        tradeIncome: data.turnResult.tradeIncome || 0,
      });
      setShowTransition(true);

      // Update game state after transition
      setPreviousGame(game);
      setGame(data.game);
      
      if (!data.game.isGameOver) {
        localStorage.setItem("utopik_save_id", data.game.id);
      } else {
        localStorage.removeItem("utopik_save_id");
      }

      setCurrentEvent(data.turnResult.newEvent);
      setPhase("event");

      try {
        const reports = JSON.parse(data.game.turnReports || "[]");
        if (reports.length > 0) {
          setTurnReportsData(reports);
          setShowTurnReports(true);
        }
      } catch {}
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
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error);
    }
    // Update budget locally for instant feedback
    setGame(prev => prev ? { ...prev, budget: prev.budget - amount } : null);
  };

  const handleReadReports = async () => {
    if (!game) return;
    setShowTurnReports(false);
    setTurnReportsData([]);
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

  return (
    <div 
      className="min-h-screen flex h-screen overflow-hidden bg-slate-950"
      style={{ zoom: uiScale / 100 } as React.CSSProperties}
    >
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0 h-full p-2 md:p-4 max-w-[1600px] mx-auto overflow-hidden relative">
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
          onOpenTutorial={() => setIsTutorialOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4 custom-scrollbar">
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
              {phase === "event" && currentEvent ? (
                <EventCard
                  event={currentEvent}
                  onChoice={handleChoice}
                  disabled={actionLoading}
                />
              ) : phase === "invest" ? (
                <div className="glass-strong rounded-2xl p-4 animate-slide-up flex flex-col items-center justify-center h-full min-h-[200px]">
                  <div className="text-4xl mb-2">✅</div>
                  <h3 className="text-lg font-[family-name:var(--font-display)] font-bold text-[var(--color-neon-cyan)] mb-1">
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
                onInvest={handleInvest}
                onNextTurn={handleNextTurn}
                disabled={actionLoading || (phase === "event" && !!currentEvent)}
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
              gameId={game.id} 
              turn={game.turn}
              budget={game.budget}
              completedProjectsJson={game.megaProjects}
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

        {/* DIPLOMACY */}
        {activeTab === "diplomacy" && (
          <div className="space-y-6 animate-fade-in">
            <DiplomacyPanel 
              gameId={game.id} 
              worldCountries={game.worldCountries || []} 
              politicalCapital={game.politicalCapital}
              military={game.military}
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

      {/* Turn Reports Modal */}
      {showTurnReports && !isTutorialOpen && (
        <TurnReportModal 
          reports={turnReportsData} 
          onClose={handleReadReports} 
        />
      )}

      {/* Turn transition overlay */}
      <TurnTransition
        isVisible={showTransition}
        turnNumber={turnData.turnNumber}
        taxIncome={turnData.taxIncome}
        maintenanceCost={turnData.maintenanceCost}
        dominoEffects={turnData.dominoEffects}
        onComplete={() => setShowTransition(false)}
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
        </div>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        uiScale={uiScale} 
        setUiScale={setUiScale} 
      />
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
