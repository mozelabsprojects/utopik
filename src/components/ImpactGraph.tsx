"use client";

import { motion } from "framer-motion";

interface GameData {
  military: number;
  happiness: number;
  health: number;
  environment: number;
  education: number;
  stability: number;
  foreignRelations: number;
}

interface ImpactGraphProps {
  currentGame: GameData;
  previousGame?: GameData;
}

const STAT_LABELS: Record<keyof GameData, string> = {
  military: "Askeri Güç",
  happiness: "Mutluluk",
  health: "Sağlık",
  environment: "Çevre",
  education: "Eğitim",
  stability: "İstikrar",
  foreignRelations: "Dış İlişkiler",
};

const STAT_ICONS: Record<keyof GameData, string> = {
  military: "⚔️",
  happiness: "😊",
  health: "🏥",
  environment: "🌿",
  education: "📚",
  stability: "🏛️",
  foreignRelations: "🌍",
};

export default function ImpactGraph({ currentGame, previousGame }: ImpactGraphProps) {
  if (!previousGame) return null; // No history to compare yet

  // Calculate deltas
  const stats = (Object.keys(STAT_LABELS) as Array<keyof GameData>).map((key) => {
    const diff = currentGame[key] - previousGame[key];
    return { key, label: STAT_LABELS[key], icon: STAT_ICONS[key], diff };
  });

  // Sadece değişenleri göster (veya hepsi 0 ise boş bir mesaj)
  const changedStats = stats.filter((s) => s.diff !== 0);

  if (changedStats.length === 0) {
    return (
      <div className="glass-strong rounded-2xl p-5 mb-4 text-center">
        <p className="text-gray-400 text-sm">Geçen turdan bu yana statlarda bir değişiklik olmadı.</p>
      </div>
    );
  }

  // En büyük değişimi bul ki bar genişliklerini ona göre oranlayalım (max bar = 100%)
  const maxAbsDiff = Math.max(...changedStats.map((s) => Math.abs(s.diff)), 10);

  return (
    <div className="glass-premium rounded-2xl p-6 mb-4 animate-fade-in border border-cyan-900/30 shadow-[0_0_30px_rgba(8,145,178,0.1)] relative overflow-hidden">
      {/* Background grid effect for intelligence vibe */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-sm font-black text-cyan-400 flex items-center gap-2 uppercase tracking-[0.2em]">
          <span className="animate-pulse">📡</span> ETKİ İSTİHBARATI Raporu
        </h3>
        <div className="text-[10px] text-slate-500 font-mono tracking-widest border border-slate-700/50 px-2 py-1 rounded bg-slate-900/50">
          DELTA: {(previousGame as any).turn} ➔ {(currentGame as any).turn}
        </div>
      </div>
      
      <div className="space-y-4 relative z-10">
        {changedStats.map((stat) => {
          const isPositive = stat.diff > 0;
          const widthPercent = (Math.abs(stat.diff) / maxAbsDiff) * 100;
          
          return (
            <div key={stat.key} className="flex items-center text-sm group">
              {/* Sol Etiket */}
              <div className="w-36 flex items-center gap-3 text-slate-300">
                <span className="text-lg drop-shadow-md">{stat.icon}</span>
                <span className="truncate font-semibold tracking-wide text-xs">{stat.label}</span>
              </div>
              
              {/* Grafik Alanı */}
              <div className="flex-1 flex items-center px-4">
                {/* Negatif Bar (Orta noktanın solu) */}
                <div className="flex-1 flex justify-end pr-1 border-r-2 border-slate-700/80">
                  {!isPositive && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPercent}%` }}
                      className="h-2 bg-gradient-to-l from-red-500 to-red-600 rounded-l-full shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                    />
                  )}
                </div>
                
                {/* Pozitif Bar (Orta noktanın sağı) */}
                <div className="flex-1 flex justify-start pl-1">
                  {isPositive && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPercent}%` }}
                      className="h-2 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-r-full shadow-[0_0_10px_rgba(52,211,153,0.4)]"
                    />
                  )}
                </div>
              </div>
              
              {/* Değer */}
              <div className={`w-16 text-right font-mono font-bold text-sm bg-slate-900/60 px-2 py-1 rounded-md border ${isPositive ? 'text-emerald-400 border-emerald-500/20' : 'text-red-400 border-red-500/20'}`}>
                {isPositive ? `+${stat.diff.toFixed(1)}` : stat.diff.toFixed(1)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
