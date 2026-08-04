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
    <div className="glass-strong rounded-2xl p-5 mb-4 animate-fade-in border border-slate-700">
      <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2 uppercase tracking-wider">
        <span>📈</span> Kararların Etki Analizi (Geçen Tura Göre)
      </h3>
      
      <div className="space-y-3">
        {changedStats.map((stat, index) => {
          const isPositive = stat.diff > 0;
          const widthPercent = (Math.abs(stat.diff) / maxAbsDiff) * 100;
          
          return (
            <div key={stat.key} className="flex items-center text-xs">
              {/* Sol Etiket */}
              <div className="w-28 flex items-center gap-2 text-slate-300">
                <span className="text-base">{stat.icon}</span>
                <span className="truncate">{stat.label}</span>
              </div>
              
              {/* Grafik Alanı */}
              <div className="flex-1 flex items-center">
                {/* Negatif Bar (Orta noktanın solu) */}
                <div className="flex-1 flex justify-end pr-1 border-r border-slate-600">
                  {!isPositive && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPercent}%` }}
                      className="h-4 bg-red-500 rounded-l-sm"
                    />
                  )}
                </div>
                
                {/* Pozitif Bar (Orta noktanın sağı) */}
                <div className="flex-1 flex justify-start pl-1">
                  {isPositive && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPercent}%` }}
                      className="h-4 bg-green-500 rounded-r-sm"
                    />
                  )}
                </div>
              </div>
              
              {/* Değer */}
              <div className={`w-12 text-right font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? `+${stat.diff.toFixed(1)}` : stat.diff.toFixed(1)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
