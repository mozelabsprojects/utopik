"use client";

import { CRISES, CrisisId, QUESTS, QuestId } from "@/lib/crises-missions";
import { GameState } from "@/lib/types";

interface CrisesAndQuestsProps {
  gameState: GameState;
}

export default function CrisesAndQuests({ gameState }: CrisesAndQuestsProps) {
  let activeCrises: CrisisId[] = [];
  try { activeCrises = JSON.parse(gameState.activeCrises); } catch {}
  let activeQuests: any[] = [];
  try { activeQuests = JSON.parse(gameState.activeQuests || "[]"); } catch {}

  if (activeCrises.length === 0 && activeQuests.length === 0) return null;

  return (
    <div className="tutorial-crises space-y-6 animate-fade-in">
      {/* Aktif Krizler */}
      {activeCrises.length > 0 && (
      <div className="glass-strong p-6 rounded-2xl border-l-4 border-l-red-500">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="text-3xl">🚨</span> Aktif Krizler
        </h2>
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
      </div>
      )}

      {/* Aktif Görevler (Side Quests) */}
      {activeQuests.length > 0 && (
      <div className="glass p-6 rounded-2xl border-l-4 border-l-yellow-500">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="text-3xl">🎯</span> Bekleyen Görevler
        </h2>
        <div className="space-y-4">
          {activeQuests.map((quest, idx) => (
            <div key={idx} className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-2 relative z-10">
                <h3 className="text-yellow-400 font-bold text-lg">{quest.title}</h3>
                <span className="bg-black/50 text-yellow-300 px-2 py-1 rounded text-xs font-bold border border-yellow-500/30">
                  ⏳ {quest.turnsRemaining} Tur Kaldı
                </span>
              </div>
              <p className="text-gray-300 text-sm relative z-10">{quest.description}</p>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
}
