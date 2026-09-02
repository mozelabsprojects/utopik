"use client";

import React, { useState } from "react";
import { GameState, Quest } from "@/lib/types";
import { calculateParliamentSeats, INITIAL_FACTIONS } from "@/lib/factions";

interface PoliticsPanelProps {
  gameState: GameState;
  onQuestAction: (questId: string, action: "complete" | "fail") => Promise<void>;
}

export default function PoliticsPanel({ gameState, onQuestAction }: PoliticsPanelProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  let factions = INITIAL_FACTIONS;
  try { factions = JSON.parse(gameState.factions); } catch {}
  const parliamentSeats = calculateParliamentSeats(factions);

  const activeQuests: Quest[] = JSON.parse(gameState.activeQuests || "[]");
  const turnsUntilElection = gameState.nextElectionTurn - gameState.turn;

  const handleQuestComplete = async (questId: string) => {
    setIsProcessing(true);
    await onQuestAction(questId, "complete");
    setIsProcessing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="glass p-6 rounded-2xl flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🗳️</span> Siyasi Durum
          </h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Başkanlık Desteği (Popülarite)</span>
                <span className="font-bold text-white">{Math.round(gameState.popularity)}%</span>
              </div>
              <div className="stat-bar-track h-4">
                <div 
                  className={`stat-bar-fill ${gameState.popularity < 40 ? "bg-red-500" : "bg-cyan-500"}`} 
                  style={{ width: `${Math.max(0, Math.min(100, gameState.popularity))}%` }}
                />
              </div>
              {gameState.popularity < 40 && (
                <p className="text-xs text-red-400 mt-2 animate-pulse-danger">
                  ⚠️ Destek çok düşük! Seçimlerde hükümet düşebilir.
                </p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
              <div>
                <div className="text-xs text-gray-400">Siyasi Sermaye</div>
                <div className="text-2xl font-bold text-yellow-400">{gameState.politicalCapital}</div>
              </div>
              <div className="text-4xl opacity-50">📜</div>
            </div>
            
            <div className="p-4 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex justify-between items-center relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-xs text-indigo-300">Sıradaki Seçime Kalan</div>
                <div className="text-3xl font-bold text-white">{turnsUntilElection > 0 ? `${turnsUntilElection} Tur` : 'Seçim Vakti!'}</div>
              </div>
              <div className="absolute right-0 top-0 text-7xl opacity-10 transform translate-x-4 -translate-y-4">
                🗳️
              </div>
            </div>
          </div>
        </div>

        {/* PARLAMENTO GÖRÜNÜMÜ */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            🏛️ Meclis Dağılımı (100 Koltuk)
          </h3>
          <div className="flex h-8 rounded-full overflow-hidden shadow-inner mb-4">
            {Object.entries(parliamentSeats).map(([fId, seats]) => {
              if (seats === 0) return null;
              let bgColor = "bg-gray-500";
              if (fId === "capitalists") bgColor = "bg-yellow-500";
              if (fId === "workers") bgColor = "bg-red-500";
              if (fId === "intellectuals") bgColor = "bg-blue-500";
              if (fId === "nationalists") bgColor = "bg-orange-600";
              if (fId === "military") bgColor = "bg-green-700";
              
              return (
                <div 
                  key={fId} 
                  className={`${bgColor} h-full transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white/90 overflow-hidden group relative`}
                  style={{ width: `${seats}%` }}
                >
                  {seats > 5 ? seats : ""}
                  <div className="hidden group-hover:block absolute bottom-full mb-1 w-max p-2 bg-slate-800 text-white rounded-lg border border-slate-600 shadow-xl z-20 pointer-events-none">
                    {fId.toUpperCase()}: {seats} Koltuk
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
             <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> İşçiler ({parliamentSeats.workers})</div>
             <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span> Sermaye ({parliamentSeats.capitalists})</div>
             <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> Aydınlar ({parliamentSeats.intellectuals})</div>
             <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-600 inline-block"></span> Milliyetçiler ({parliamentSeats.nationalists})</div>
             <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-700 inline-block"></span> Askeriye ({parliamentSeats.military})</div>
          </div>
          <p className="text-[10px] text-gray-500 mt-3 text-center">Yasa geçirmek için en az 51 meclis oyu (koltuk) gereklidir.</p>
        </div>
      </div>

      <div className="lg:col-span-2 glass p-6 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-3xl">📝</span> Halk İstekleri & Görevler
        </h2>

        {activeQuests.length > 0 ? (
          <div className="space-y-4">
            {activeQuests.map((quest) => {
              // Görevin hedefini kontrol et (Basit kontrol: İlgili stat hedefin üstünde mi?)
              // Bu basit mantık statüleri GameState'den dinamik çeker
              const currentStatValue = gameState[quest.targetSector as keyof GameState] as number;
              const isCompleted = currentStatValue >= quest.targetValue;

              return (
                <div key={quest.id} className="p-5 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/10 transition-colors">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-cyan-400 mb-1">{quest.title}</h3>
                    <p className="text-sm text-gray-300 mb-3">{quest.description}</p>
                    <div className="flex items-center gap-4 text-xs font-medium">
                      <span className="px-2 py-1 rounded bg-black/40 text-gray-300">
                        Hedef: {quest.targetSector} ({currentStatValue}/{quest.targetValue})
                      </span>
                      <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-300">
                        Ödül: {quest.rewardText}
                      </span>
                    </div>
                  </div>
                  <div>
                    {isCompleted ? (
                      <button 
                        onClick={() => handleQuestComplete(quest.id)}
                        disabled={isProcessing}
                        className="btn-primary text-sm px-4 py-2 whitespace-nowrap"
                      >
                        Tamamla & Ödülü Al
                      </button>
                    ) : (
                      <div className="px-4 py-2 rounded-lg bg-black/50 text-gray-500 border border-gray-700 text-sm whitespace-nowrap">
                        Devam Ediyor
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-gray-500 text-center p-6 border-2 border-dashed border-white/10 rounded-xl">
            Şu an halktan gelen yeni bir talep veya özel görev bulunmuyor.
          </div>
        )}
      </div>
    </div>
  );
}
