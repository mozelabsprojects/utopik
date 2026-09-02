"use client";

interface GameOverModalProps {
  reason: string;
  turn: number;
  countryName: string;
  stats: {
    budget: number;
    military: number;
    happiness: number;
    health: number;
    environment: number;
    education: number;
    stability: number;
    foreignRelations: number;
  };
  onRestart: () => void;
}

export default function GameOverModal({
  reason,
  turn,
  countryName,
  stats,
  onRestart,
}: GameOverModalProps) {
  const isVictory = reason.includes("ZAFER") || reason.includes("ÜTOPYA");

  const getTitle = () => {
    if (isVictory) return "ZAFER!";
    if (reason.includes("SAVAŞ") || reason.includes("darbe")) return "DARBE!";
    if (reason.includes("İFLAS")) return "İFLAS!";
    if (reason.includes("SAĞLIK") || reason.includes("Salgın")) return "SALGIN!";
    if (reason.includes("İŞGAL")) return "İŞGAL!";
    if (reason.includes("SEÇİM")) return "SEÇİM YENİLGİSİ!";
    if (reason.includes("SÜRE")) return "SÜRE DOLDU!";
    return "OYUN BİTTİ";
  };

  const getEmoji = () => {
    if (isVictory) return "🏆";
    if (reason.includes("SAVAŞ") || reason.includes("darbe")) return "⚔️";
    if (reason.includes("İFLAS")) return "💸";
    if (reason.includes("SAĞLIK") || reason.includes("Salgın")) return "☠️";
    if (reason.includes("İŞGAL")) return "🏴";
    return "📉";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in">
      <div className={`max-w-lg w-full mx-4 ${isVictory ? '' : 'animate-shake'}`}>
        {/* Main card */}
        <div className={`glass-strong rounded-2xl overflow-hidden border ${isVictory ? 'border-yellow-500/50' : 'border-red-500/30'}`}>
          {/* Header */}
          <div className={`p-8 text-center ${isVictory 
            ? 'bg-gradient-to-r from-yellow-900/80 via-amber-700/80 to-yellow-900/80' 
            : 'bg-gradient-to-r from-red-900/80 to-red-700/80'
          }`}>
            <div className={`text-6xl mb-3 ${isVictory ? 'animate-bounce' : 'animate-glitch'}`}>{getEmoji()}</div>
            <h1 className={`text-4xl font-[family-name:var(--font-display)] font-black mb-2 ${isVictory 
              ? 'text-yellow-300' 
              : 'text-red-400 animate-glitch'
            }`}>
              {getTitle()}
            </h1>
            <p className={`text-sm ${isVictory ? 'text-yellow-200/80' : 'text-red-200/80'}`}>{countryName}</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Reason */}
            <p className="text-gray-300 text-center mb-6 leading-relaxed">
              {reason}
            </p>

            {/* Stats summary */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="text-center p-3 rounded-lg bg-gray-800/50">
                <div className="text-2xl font-[family-name:var(--font-display)] font-bold text-[var(--color-neon-cyan)]">
                  {turn}
                </div>
                <div className="text-xs text-gray-400">Tur Sayısı</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-gray-800/50">
                <div
                  className={`text-2xl font-[family-name:var(--font-display)] font-bold ${
                    stats.budget >= 0 ? "text-[var(--color-gold)]" : "text-red-400"
                  }`}
                >
                  ${Math.round(stats.budget).toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">Son Bütçe</div>
              </div>
            </div>

            {/* Final stats */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { label: "Askeri", value: stats.military, icon: "⚔️" },
                { label: "Mutluluk", value: stats.happiness, icon: "😊" },
                { label: "Sağlık", value: stats.health, icon: "🏥" },
                { label: "Çevre", value: stats.environment, icon: "🌿" },
                { label: "Eğitim", value: stats.education, icon: "📚" },
                { label: "İstikrar", value: stats.stability, icon: "🏛️" },
                { label: "Dış İliş.", value: stats.foreignRelations, icon: "🌍" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-2 rounded-lg bg-gray-800/30"
                >
                  <div className="text-sm mb-1">{stat.icon}</div>
                  <div
                    className={`text-xs font-bold ${
                      stat.value < 30
                        ? "text-red-400"
                        : stat.value < 50
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {Math.round(stat.value)}%
                  </div>
                </div>
              ))}
            </div>

            {/* Restart button */}
            <button
              onClick={onRestart}
              className={`w-full text-center text-base py-4 rounded-xl font-bold transition-all ${isVictory 
                ? 'bg-gradient-to-r from-yellow-600 to-amber-500 text-black hover:from-yellow-500 hover:to-amber-400 shadow-[0_0_20px_rgba(234,179,8,0.3)]' 
                : 'btn-danger'
              }`}
            >
              🔄 Yeniden Başla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
