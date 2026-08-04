"use client";

interface StatBarProps {
  label: string;
  value: number;
  icon: string;
  color: string;
  previousValue?: number;
}

export default function StatBar({ label, value, icon, color, previousValue }: StatBarProps) {
  const isCritical = value < 30;
  const diff = previousValue !== undefined ? value - previousValue : 0;

  const getBarColor = () => {
    if (value >= 70) return "bg-green-400";
    if (value >= 40) return "bg-yellow-400";
    return "bg-red-500";
  };

  const getGradient = () => {
    if (value >= 70) return `linear-gradient(90deg, ${color}, #34d399)`;
    if (value >= 40) return `linear-gradient(90deg, ${color}, #fbbf24)`;
    return `linear-gradient(90deg, #ff2d55, #ff6b6b)`;
  };

  return (
    <div className={`animate-slide-in ${isCritical ? "animate-pulse-danger rounded-lg" : ""}`}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">{icon}</span>
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {diff !== 0 && (
            <span
              className={`text-xs font-bold ${
                diff > 0 ? "text-green-400" : "text-red-400"
              } animate-fade-in`}
            >
              {diff > 0 ? `+${diff}` : diff}
            </span>
          )}
          <span
            className={`text-sm font-bold ${
              isCritical ? "text-red-400" : "text-white"
            }`}
          >
            {Math.round(value)}%
          </span>
        </div>
      </div>
      <div className="stat-bar-track h-2.5">
        <div
          className="stat-bar-fill"
          style={{
            width: `${Math.max(0, Math.min(100, value))}%`,
            background: getGradient(),
          }}
        />
      </div>
    </div>
  );
}
