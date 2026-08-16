"use client";

import React, { useState } from "react";
import { GameState } from "@/lib/types";
import { TECH_TREE, TechId, TechNode } from "@/lib/tech-tree";

interface TechTreePanelProps {
  gameState: GameState;
  onTechUnlocked: (techId: TechId) => void;
}

export default function TechTreePanel({ gameState, onTechUnlocked }: TechTreePanelProps) {
  const [loading, setLoading] = useState<TechId | null>(null);
  const unlockedTechs: string[] = (() => {
    try {
      return JSON.parse(gameState.unlockedTechs || "[]");
    } catch {
      return [];
    }
  })();

  const handleUnlock = async (techId: TechId) => {
    setLoading(techId);
    try {
      const res = await fetch("/api/game/tech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: gameState.id, techId }),
      });
      const data = await res.json();
      if (data.success) {
        onTechUnlocked(techId);
      } else {
        alert(data.error || "Bir hata oluştu");
      }
    } catch (err) {
      alert("Bağlantı hatası");
    }
    setLoading(null);
  };

  const isUnlocked = (techId: TechId) => unlockedTechs.includes(techId);
  const canUnlock = (tech: TechNode) => {
    if (gameState.researchPoints < tech.cost) return false;
    for (const req of tech.requires) {
      if (!isUnlocked(req)) return false;
    }
    return true;
  };

  const techs = Object.values(TECH_TREE) as TechNode[];

  return (
    <div className="tutorial-tech bg-slate-800 p-6 rounded-xl border border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            🔬 Araştırma ve Teknoloji
          </h2>
          <p className="text-slate-400 mt-1">Eğitim seviyenize göre tur başına Ar-Ge puanı kazanırsınız.</p>
        </div>
        <div className="bg-blue-900/50 border border-blue-700/50 px-4 py-2 rounded-lg text-center">
          <div className="text-sm text-blue-300">Mevcut RP</div>
          <div className="text-2xl font-bold text-blue-400">{gameState.researchPoints || 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {techs.map((tech) => {
          const unlocked = isUnlocked(tech.id);
          const available = canUnlock(tech);
          
          return (
            <div 
              key={tech.id} 
              className={`p-4 rounded-xl border relative transition-all ${
                unlocked 
                  ? 'bg-green-900/20 border-green-700/50 opacity-100' 
                  : available 
                    ? 'bg-slate-700/50 border-blue-500/50 hover:border-blue-400' 
                    : 'bg-slate-900/50 border-slate-700 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{tech.icon}</span>
                  <div>
                    <h3 className={`font-bold ${unlocked ? 'text-green-400' : 'text-white'}`}>
                      {tech.name}
                    </h3>
                    <div className="text-xs text-slate-400 font-mono">
                      Maliyet: {tech.cost} RP
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-slate-300 mb-4 h-12">
                {tech.description}
              </p>

              {tech.requires.length > 0 && !unlocked && (
                <div className="mb-4">
                  <div className="text-xs text-slate-500 mb-1">Ön Koşullar:</div>
                  <div className="flex flex-wrap gap-1">
                    {tech.requires.map(reqId => (
                      <span 
                        key={reqId} 
                        className={`text-[10px] px-2 py-1 rounded-full ${
                          isUnlocked(reqId) ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                        }`}
                      >
                        {TECH_TREE[reqId].name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {unlocked ? (
                <button disabled className="w-full py-2 rounded-lg bg-green-600/20 text-green-400 font-bold border border-green-600/50">
                  ✓ Araştırıldı
                </button>
              ) : (
                <button 
                  onClick={() => handleUnlock(tech.id)}
                  disabled={!available || loading === tech.id}
                  className={`w-full py-2 rounded-lg font-bold transition-all ${
                    available 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {loading === tech.id ? "Araştırılıyor..." : "Araştır"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
