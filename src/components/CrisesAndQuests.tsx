"use client";

import { CRISES, CrisisId, QUESTS, QuestId } from "@/lib/crises-missions";
import { GameState } from "@/lib/types";

interface CrisesAndQuestsProps {
  gameState: GameState;
}

export default function CrisesAndQuests({ gameState }: CrisesAndQuestsProps) {
  let activeCrises: CrisisId[] = [];
  try { activeCrises = JSON.parse(gameState.activeCrises); } catch {}
  let activeQuests: QuestId[] = [];
  try { activeQuests = JSON.parse(gameState.activeQuests || "[]"); } catch {}

  if (activeCrises.length === 0 && activeQuests.length === 0) return null;

  return (
    <div className="tutorial-crises space-y-6 animate-fade-in">
      {/* Aktif Krizler */}
      <div className="glass-strong p-6 rounded-2xl border-l-4 border-l-red-500">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="text-3xl">🚨</span> Aktif Krizler
        </h2>
        {activeCrises.length === 0 ? (
          <p className="text-gray-400">Şu anda ülkenizi tehdit eden aktif bir kriz bulunmuyor.</p>
        ) : (
          <div className="space-y-4">
            {activeCrises.map(cId => {
              const crisis = CRISES[cId];
              if (!crisis) return null;
              return (
                <div key={cId} className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                  <h3 className="text-red-400 font-bold text-lg mb-1">{crisis.name}</h3>
                  <p className="text-gray-300 text-sm">{crisis.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Aktif Görevler (Side Quests) */}
      <div className="glass p-6 rounded-2xl border-l-4 border-l-yellow-500">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="text-3xl">🎯</span> Bekleyen Görevler
        </h2>
        <p className="text-gray-400 mb-4 text-sm">Görevler yakında fraksiyonlar tarafından size iletilecek (V4.1 Güncellemesi).</p>
      </div>
    </div>
  );
}
