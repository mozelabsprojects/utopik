"use client";

import StatBar from "./StatBar";
import BudgetDisplay from "./BudgetDisplay";
import FinanceAnalysis from "./FinanceAnalysis";
import ImpactGraph from "./ImpactGraph";
import { GameState } from "@/lib/types";
import { generateAdvisorHints } from "@/lib/advisor";

interface GameData extends GameState {
  countryName: string;
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

  return (
    <div className="tutorial-dashboard glass-strong rounded-2xl p-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-[family-name:var(--font-display)] font-bold text-[var(--color-neon-cyan)]">
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
          {/* FİNANSAL ANALİZ PANELİ EKLENDİ */}
          <FinanceAnalysis game={game} />
        </div>

        {/* Stats and Graphs */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
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
              />
            ))}
          </div>

          <ImpactGraph currentGame={game} previousGame={previousGame} />
        </div>
      </div>
    </div>
  );
}
