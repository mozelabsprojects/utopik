"use client";

import { useState } from "react";
import { MINISTERS, Minister, MinisterId, MinistryType } from "@/lib/ministers";
import { GameState, StatEffects } from "@/lib/types";

const STAT_LABELS: Record<string, string> = {
  budget: "Bütçe",
  military: "Askeriye",
  happiness: "Mutluluk",
  health: "Sağlık",
  environment: "Çevre",
  education: "Eğitim",
  stability: "İstikrar",
  foreignRelations: "Dış İlişkiler",
};

const renderEffects = (effects: StatEffects) => {
  return Object.entries(effects).map(([key, val]) => {
    if (!val) return null;
    const isPositive = val > 0;
    const prefix = key === "budget" ? (isPositive ? "+$" : "-$") : (isPositive ? "+" : "");
    const valueStr = key === "budget" ? Math.abs(val) : val;
    return (
      <span key={key} className={`text-[10px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
        {prefix}{valueStr} {STAT_LABELS[key] || key}
      </span>
    );
  });
};

export default function MinistersPanel({
  gameId,
  politicalCapital,
  currentMinistersJson,
  onUpdate
}: {
  gameId: string;
  politicalCapital: number;
  currentMinistersJson: string;
  onUpdate: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  let currentMinisters: Record<string, string> = {};
  try {
    currentMinisters = JSON.parse(currentMinistersJson);
  } catch (e) {}

  // Kabinenin toplam etkilerini hesapla
  const aggregateEffects: StatEffects = {};
  Object.values(currentMinisters).forEach((ministerId) => {
    const minister = MINISTERS[ministerId as MinisterId];
    if (minister && minister.passiveEffects) {
      Object.entries(minister.passiveEffects).forEach(([key, val]) => {
        if (val) {
          const statKey = key as keyof StatEffects;
          aggregateEffects[statKey] = (aggregateEffects[statKey] || 0) + val;
        }
      });
    }
  });

  const handleHire = async (ministerId: MinisterId) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/game/minister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, ministerId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onUpdate();
    } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const ministries: MinistryType[] = ["economy", "defense", "internal", "foreign", "education", "health", "environment"];
  const ministryLabels: Record<MinistryType, string> = {
    economy: "Ekonomi Bakanlığı",
    defense: "Savunma Bakanlığı",
    internal: "İçişleri Bakanlığı",
    foreign: "Dışişleri Bakanlığı",
    education: "Eğitim Bakanlığı",
    health: "Sağlık Bakanlığı",
    environment: "Çevre Bakanlığı",
  };

  return (
    <div className="tutorial-ministers bg-slate-800/80 p-6 rounded-2xl shadow-xl border border-slate-700 backdrop-blur-sm">
      <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2 mb-4">
        🏛️ Bakanlar Kurulu
        <span className="text-sm font-normal bg-slate-700 px-3 py-1 rounded-full text-slate-300">
          Siyasi Sermaye: 📜 {politicalCapital}
        </span>
      </h2>
      
      {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">{error}</div>}

      {/* Kabinenin Toplam Etkisi Özeti */}
      {Object.keys(aggregateEffects).length > 0 && (
        <div className="bg-slate-900/80 border border-slate-600 rounded-xl p-4 mb-6 shadow-inner">
          <h3 className="text-sm font-bold text-slate-300 mb-2 uppercase tracking-widest flex items-center gap-2">
            📊 Kabinenin Toplam Etkisi (Tur Başına)
          </h3>
          <div className="flex flex-wrap gap-2">
            {renderEffects(aggregateEffects)}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ministries.map((ministry) => {
          const currentId = currentMinisters[ministry];
          const current = currentId ? MINISTERS[currentId as MinisterId] : null;
          
          const availableMinisters = Object.values(MINISTERS).filter(m => m.ministry === ministry);

          return (
            <div key={ministry} className="border border-slate-600 rounded-xl p-4 bg-slate-900/50">
              <h3 className="font-semibold text-blue-300 border-b border-slate-700 pb-2 mb-3">
                {ministryLabels[ministry]}
              </h3>
              
              {current ? (
                <div className="mb-4">
                  <p className="text-sm text-slate-400">Mevcut Bakan:</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl">{current.avatar}</span>
                    <div>
                      <p className="font-bold text-slate-100">{current.name}</p>
                      <p className="text-xs text-blue-400 mb-1">{current.title}</p>
                      <div className="flex flex-wrap gap-1">
                        {renderEffects(current.passiveEffects)}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{current.description}</p>
                </div>
              ) : (
                <div className="mb-4 text-slate-500 italic text-sm">Bakan atanmadı.</div>
              )}

              <div className="space-y-2 mt-4 pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-400 font-semibold">Adaylar:</p>
                {availableMinisters.map((candidate) => (
                  <div key={candidate.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-800 p-2 rounded gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{candidate.avatar}</span>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{candidate.name}</p>
                        <p className="text-[10px] text-slate-400 mb-1">{candidate.title} (📜 {candidate.hireCost})</p>
                        <div className="flex flex-wrap gap-1">
                          {renderEffects(candidate.passiveEffects)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleHire(candidate.id)}
                      disabled={loading || currentId === candidate.id || politicalCapital < candidate.hireCost}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-xs rounded font-medium text-white transition-colors whitespace-nowrap"
                    >
                      {currentId === candidate.id ? "Atandı" : "Ata"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
