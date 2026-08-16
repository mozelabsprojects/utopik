"use client";

import React, { useState, useMemo } from "react";
import { WorldCountryState, GameState } from "@/lib/types";
import { calculateRelationship, calculateTradeRiskProfile } from "@/lib/game-engine";

interface WorldMapProps {
  countries: WorldCountryState[];
  gameState: GameState;
  onTrade: (partnerName: string, amount: number, isInternal?: boolean) => Promise<void>;
  onUpdate?: () => void;
}

export default function WorldMap({ countries, gameState, onTrade, onUpdate }: WorldMapProps) {
  const [selectedCountry, setSelectedCountry] = useState<WorldCountryState | null>(null);
  const [tradeAmount, setTradeAmount] = useState<number>(500);
  const [isTrading, setIsTrading] = useState(false);
  const [tradeMessage, setTradeMessage] = useState<{ text: string, type: 'success'|'error' } | null>(null);

  const sortedCountries = useMemo(() => {
    const getPowerScore = (c: WorldCountryState) => {
      const normalizedBudget = Math.min(100, Math.max(0, c.budget / 100)); // 10,000$ = 100 Puan
      return (c.military * 0.35) + (normalizedBudget * 0.25) + (c.stability * 0.2) + (c.education * 0.1) + (c.health * 0.1);
    };
    return [...countries].sort((a, b) => getPowerScore(b) - getPowerScore(a));
  }, [countries]);

  const handleTradeSubmit = async () => {
    if (!selectedCountry) return;
    setIsTrading(true);
    setTradeMessage(null);
    try {
      await onTrade(selectedCountry.name, tradeAmount, selectedCountry.isPlayer);
      setTradeMessage({ text: selectedCountry.isPlayer ? "Yerel şirketlere yatırım yapıldı. Ekonomiye can suyu!" : "Ticaret anlaşması imzalandı! Önümüzdeki 5 tur boyunca kar getirecek.", type: "success" });
    } catch (e: any) {
      setTradeMessage({ text: e.message || "İşlem yapılamadı.", type: "error" });
    } finally {
      setIsTrading(false);
    }
  };

  const handleDiplomacy = async (action: 'war' | 'alliance') => {
    if (!selectedCountry || selectedCountry.isPlayer) return;
    setIsTrading(true);
    setTradeMessage(null);
    try {
      const res = await fetch("/api/game/diplomacy-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: gameState.id, partnerName: selectedCountry.name, action }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }
      setTradeMessage({ text: action === 'war' ? "Savaş İlan Edildi!" : "İttifak Kuruldu!", type: "success" });
      if (onUpdate) onUpdate();
    } catch (e: any) {
      setTradeMessage({ text: e.message || "İşlem yapılamadı.", type: "error" });
    } finally {
      setIsTrading(false);
    }
  };

  return (
    <div className="tutorial-world grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="lg:col-span-2 glass p-6 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-3xl">🌍</span> Dünya Sıralaması
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="py-3 px-4 font-medium">Sıra</th>
                <th className="py-3 px-4 font-medium">Ülke</th>
                <th className="py-3 px-4 font-medium">Askeri</th>
                <th className="py-3 px-4 font-medium">Bütçe</th>
                <th className="py-3 px-4 font-medium">İstikrar</th>
              </tr>
            </thead>
            <tbody>
              {sortedCountries.map((c, index) => (
                <tr 
                  key={c.id} 
                  className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${c.isPlayer ? "bg-cyan-500/10 font-bold" : ""}`}
                  onClick={() => setSelectedCountry(c)}
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 flex items-center gap-2">
                    {c.name} {c.isPlayer && <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">Siz</span>}
                  </td>
                  <td className="py-3 px-4 text-orange-400">{Math.round(c.military)}</td>
                  <td className="py-3 px-4 text-green-400">${Math.round(c.budget)}</td>
                  <td className="py-3 px-4 text-indigo-400">{Math.round(c.stability)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass p-6 rounded-2xl flex flex-col">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-3xl">{selectedCountry?.isPlayer ? "🏢" : "🤝"}</span> 
          {selectedCountry?.isPlayer ? "İç Ticaret (Yerel Yatırım)" : "Dış Ticaret Anlaşması"}
        </h2>
        
        {selectedCountry ? (
          <div className="flex-1 flex flex-col">
            <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold text-cyan-400 mb-2">{selectedCountry.isPlayer ? "Yerel Şirketler & Endüstri" : selectedCountry.name}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                <div>
                  <div className="text-gray-400">{selectedCountry.isPlayer ? "Ülke Bütçesi" : "Partner Bütçesi"}</div>
                  <div className="font-bold">${Math.round(selectedCountry.budget)}</div>
                </div>
                <div>
                  <div className="text-gray-400">{selectedCountry.isPlayer ? "İstikrar" : "İlişki Seviyesi"}</div>
                  <div className="font-bold text-cyan-400">{selectedCountry.isPlayer ? Math.round(gameState.stability) : Math.round(calculateRelationship(gameState, selectedCountry))} / 100</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mt-4 border-t border-white/5 pt-4">
                <div>
                  <div className="text-gray-400">Tahmini Başarı Şansı</div>
                  <div className="font-bold text-yellow-400">
                    %{Math.round(calculateTradeRiskProfile(
                      selectedCountry.isPlayer, 
                      selectedCountry.stability, 
                      selectedCountry.military, 
                      selectedCountry.isPlayer ? gameState.stability : calculateRelationship(gameState, selectedCountry)
                    ).successChance * 100)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Risk Profili</div>
                  <div className="font-bold text-yellow-400">
                    {(() => {
                      const profile = calculateTradeRiskProfile(
                        selectedCountry.isPlayer, 
                        selectedCountry.stability, 
                        selectedCountry.military, 
                        selectedCountry.isPlayer ? gameState.stability : calculateRelationship(gameState, selectedCountry)
                      );
                      return (
                        <div className="flex flex-col">
                          <span className={`${profile.level === 'Düşük' ? 'text-green-400' : profile.level === 'Çok Yüksek' ? 'text-red-500' : 'text-orange-400'}`}>
                            {profile.level} Risk
                          </span>
                          <span className="text-xs text-gray-400 mt-1">
                            -%{Math.round(profile.minLoss * 100)} ile +%{Math.round(profile.maxReturn * 100)}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2">Yatırım Miktarı (Mevcut: ${Math.round(gameState.budget)})</label>
              <input 
                type="range" 
                min="100" 
                max={Math.min(10000, gameState.budget)} 
                step="100"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-right text-xl font-bold text-green-400 mt-2">${tradeAmount}</div>
            </div>

            {tradeMessage && (
              <div className={`p-4 rounded-lg mb-6 text-sm ${tradeMessage.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                {tradeMessage.text}
              </div>
            )}

            <div className="mt-auto space-y-2">
              <button 
                onClick={handleTradeSubmit}
                disabled={isTrading || tradeAmount > gameState.budget || (!selectedCountry.isPlayer && calculateRelationship(gameState, selectedCountry) < 30) || (selectedCountry.isPlayer && gameState.stability < 30)}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTrading ? "İşleniyor..." : selectedCountry.isPlayer ? (gameState.stability < 30 ? "İstikrar Çok Düşük" : "Yerel Şirketleri Destekle") : (calculateRelationship(gameState, selectedCountry) < 30 ? "İlişkiler Çok Kötü" : "Anlaşmayı İmzala")}
              </button>

              {!selectedCountry.isPlayer && (
                <button 
                  onClick={() => handleDiplomacy('war')}
                  disabled={isTrading || gameState.politicalCapital < 20}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {calculateRelationship(gameState, selectedCountry) >= 20 ? "⚔️ Sebepsiz Savaş İlan Et (20 PS, -40 İstikrar)" : "⚔️ Savaş İlan Et (20 PS, -15 İstikrar)"}
                </button>
              )}

              {!selectedCountry.isPlayer && calculateRelationship(gameState, selectedCountry) > 80 && (
                <button 
                  onClick={() => handleDiplomacy('alliance')}
                  disabled={isTrading || gameState.politicalCapital < 10 || gameState.budget < 500}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(22,163,74,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🛡️ İttifak Kur (10 PS, $500)
                </button>
              )}

              <p className="text-xs text-gray-400 mt-3 text-center">
                {selectedCountry.isPlayer 
                  ? "Yerel yatırım 5 tur sürer. Getiri oranı ülkenin istikrarına bağlıdır." 
                  : "Dış ticaret 5 tur sürer. İlişkiniz iyi olan ülkelere savaş açmak ağır istikrar cezası verir."}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-center p-6 border-2 border-dashed border-white/10 rounded-xl">
            Dış ticaret için bir ülke seçin veya iç ticaret için kendi ülkenize tıklayın.
          </div>
        )}
      </div>
    </div>
  );
}
