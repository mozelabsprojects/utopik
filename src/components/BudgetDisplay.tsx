"use client";

interface BudgetDisplayProps {
  budget: number;
  previousBudget?: number;
  isBankrupt: boolean;
  bankruptTurns: number;
}

export default function BudgetDisplay({
  budget,
  previousBudget,
  isBankrupt,
  bankruptTurns,
}: BudgetDisplayProps) {
  const diff =
    previousBudget !== undefined ? Math.round(budget - previousBudget) : 0;
  const isNegative = budget < 0;

  const formatBudget = (val: number) => {
    const absVal = Math.abs(val);
    if (absVal >= 1000) {
      return `${(val / 1000).toFixed(1)}K`;
    }
    return val.toFixed(0);
  };

  return (
    <div
      className={`glass rounded-xl p-4 ${
        isBankrupt ? "animate-pulse-danger border-red-500/50" : "animate-border-glow"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">💰</span>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Bütçe
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className={`text-3xl font-[family-name:var(--font-display)] font-bold ${
            isNegative
              ? "text-red-400"
              : budget < 1000
              ? "text-yellow-400"
              : "text-[var(--color-gold)]"
          }`}
        >
          ${formatBudget(budget)}
        </span>
        {diff !== 0 && (
          <span
            className={`text-sm font-bold ${
              diff > 0 ? "text-green-400" : "text-red-400"
            } animate-fade-in`}
          >
            {diff > 0 ? `+$${formatBudget(diff)}` : `-$${formatBudget(Math.abs(diff))}`}
          </span>
        )}
      </div>
      {isBankrupt && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded-md">
            ⚠️ İFLAS — {bankruptTurns} tur kaldı
          </span>
        </div>
      )}
    </div>
  );
}
