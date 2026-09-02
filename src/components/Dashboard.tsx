"use client";

import StatBar from "./StatBar";
import BudgetDisplay from "./BudgetDisplay";
import FinanceAnalysis from "./FinanceAnalysis";
import ImpactGraph from "./ImpactGraph";
import { GameState, TradeDeal } from "@/lib/types";
import { generateAdvisorHints } from "@/lib/advisor";
import { TECH_TREE, TechId } from "@/lib/tech-tree";
import { calculateStatPressures, StatPressure } from "@/lib/game-engine";
import React from "react";

interface GameData extends GameState {
  countryName: string;
  tradeAgreements?: TradeDeal[];
}

interface DashboardProps {
  game: GameData;
  previousGame?: GameData;
  projectedInvestments?: Record<string, number>;
}

const STATS = [
  { key: "military", label: "Askeri Güç", icon: "⚔️", color: "#f97316" },
  { key: "happiness", label: "Mutluluk", icon: "😊", color: "#fbbf24" },
  { key: "health", label: "Sağlık", icon: "🏥", color: "#ef4444" },
  { key: "environment", label: "Çevre", icon: "🌿", color: "#22c55e" },
  { key: "education", label: "Eğitim", icon: "📚", color: "#a78bfa" },
  { key: "stability", label: "İstikrar", icon: "🏛️", color: "#6366f1" },
  { key: "foreignRelations", label: "Dış İlişkiler", icon: "🌍", color: "#06b6d4" },
];

export default function Dashboard({ game, previousGame, projectedInvestments }: DashboardProps) {
  const hints = generateAdvisorHints(game, game.factions);

  const unlockedTechsList = React.useMemo(() => {
    if (!game.unlockedTechs) return [];
    try {
      return JSON.parse(game.unlockedTechs) as TechId[];
    } catch {
      return [];
    }
  }, [game.unlockedTechs]);

  const parsedData = React.useMemo(() => {
    let activeLaws: string[] = [];
    let activeCrises: string[] = [];
    let ministers: Record<string, string> = {};
    let eventFlags: string[] = [];
    try { activeLaws = JSON.parse(game.activeLaws || "[]"); } catch {}
    try { activeCrises = JSON.parse(game.activeCrises || "[]"); } catch {}
    try { ministers = JSON.parse(game.ministers || "{}"); } catch {}
    try { eventFlags = JSON.parse(game.eventFlags || "[]"); } catch {}
    return { activeLaws, activeCrises, ministers, eventFlags };
  }, [game]);

  const statPressures = React.useMemo(() => {
    return calculateStatPressures(
      game, 
      parsedData.activeLaws, 
      unlockedTechsList, 
      parsedData.activeCrises, 
      parsedData.ministers, 
      parsedData.eventFlags
    );
  }, [game, parsedData, unlockedTechsList]);

  return (
    <div className="tutorial-dashboard glass-strong rounded-2xl p-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-[family-name:var(--font-display)] font-bold text-[var(--color-accent-primary)]">
            {game.countryName}
          </h2>
          <span className="text-xs font-bold text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
            TUR {game.turn}
          </span>
        </div>
      </div>

      {/* Advisor Hints */}
      {hints.length > 0 && (
        <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          {hints.map((hint, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${
              hint.type === 'danger' ? 'bg-red-500/10 border-red-500/20 text-red-200 shadow-[0_0_10px_rgba(239,68,68,0.1)]' :
              hint.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-200 shadow-[0_0_10px_rgba(234,179,8,0.1)]' :
              hint.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-200' :
              'bg-blue-500/10 border-blue-500/20 text-blue-200'
            }`}>
              <div className="text-xl">
                {hint.type === 'danger' && '🚨'}
                {hint.type === 'warning' && '⚠️'}
                {hint.type === 'success' && '✨'}
                {hint.type === 'info' && 'ℹ️'}
              </div>
              <div className="leading-tight mt-0.5">
                <span className="font-bold opacity-80 uppercase text-[10px] tracking-wider block mb-0.5">
                  Danışman Notu
                </span>
                {hint.text}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Budget + Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Budget */}
        <div className="lg:col-span-1 flex flex-col h-full">
          <BudgetDisplay
            budget={game.budget}
            previousBudget={previousGame?.budget}
            isBankrupt={game.isBankrupt}
            bankruptTurns={game.bankruptTurns}
          />
          {/* FİNANSAL ANALİZ PANELİ */}
          <FinanceAnalysis game={game} />
          
          {/* AKTİF TEKNOLOJİLER (AR-GE) PANELİ */}
          {unlockedTechsList.length > 0 && (
            <div className="mt-4 glass-strong rounded-2xl p-4 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
              <h3 className="text-xs font-bold text-cyan-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
                <span>🔬</span> Ar-Ge ve Teknoloji Merkezi
              </h3>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {unlockedTechsList.map(techId => {
                  const tech = TECH_TREE[techId];
                  if (!tech) return null;
                  return (
                    <div key={tech.id} className="bg-slate-900/60 p-2 rounded-xl border border-white/5 flex gap-2 items-start hover:border-cyan-500/30 transition-colors">
                      <span className="text-xl">{tech.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-200">{tech.name}</div>
                        <div className="text-[10px] text-slate-400 leading-tight line-clamp-2">{tech.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AKTİF TİCARİ ANLAŞMALAR */}
          {game.tradeAgreements && game.tradeAgreements.length > 0 && (
            <div className="mt-4 glass-strong rounded-2xl p-4 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
              <h3 className="text-xs font-bold text-green-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
                <span>🤝</span> Ticari Anlaşmalar
              </h3>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {game.tradeAgreements.map(deal => (
                  <div key={deal.id} className="bg-slate-900/60 p-3 rounded-xl border border-white/5 flex justify-between items-center hover:border-green-500/30 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-200">{deal.partnerName}</span>
                      <span className="text-[10px] text-green-400 font-mono">+{deal.incomePerTurn.toLocaleString()}$ / tur</span>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded text-xs font-bold text-slate-300">
                      <span>⏳</span>
                      <span>{deal.turnsRemaining} Tur</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats and Graphs */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 md:gap-x-6 gap-y-3">
            {STATS.map((stat) => (
              <StatBar
                key={stat.key}
                label={stat.label}
                value={game[stat.key as keyof GameData] as number}
                icon={stat.icon}
                color={stat.color}
                previousValue={
                  previousGame
                    ? (previousGame[stat.key as keyof GameData] as number)
                    : undefined
                }
                projectedGain={projectedInvestments?.[stat.key]}
                pressures={statPressures[stat.key]}
              />
            ))}
          </div>

          <ImpactGraph currentGame={game} previousGame={previousGame} />
        </div>
      </div>
    </div>
  );
}
