"use client";

import StatBar from "./StatBar";
import BudgetDisplay from "./BudgetDisplay";
import FinanceAnalysis from "./FinanceAnalysis";

interface GameData {
  budget: number;
  military: number;
  happiness: number;
  health: number;
  environment: number;
  education: number;
  stability: number;
  foreignRelations: number;
  turn: number;
  isBankrupt: boolean;
  bankruptTurns: number;
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

        {/* Stats */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
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
      </div>
    </div>
  );
}
