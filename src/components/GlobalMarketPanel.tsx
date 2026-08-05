"use client";

import React, { useState, useMemo } from "react";
import { GameState, MarketState } from "@/lib/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface GlobalMarketPanelProps {
  gameId: string;
  budget: number;
  marketStateStr: string;
  onUpdate: () => void;
}

export default function GlobalMarketPanel({ gameId, budget, marketStateStr, onUpdate }: GlobalMarketPanelProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const market: MarketState = useMemo(() => {
    let m: MarketState = {
      prices: { energy: 100, food: 50, tech: 200, medical: 150, arms: 300, minerals: 80 },
      inventory: { energy: 0, food: 0, tech: 0, medical: 0, arms: 0, minerals: 0 },
      history: []
    };
    try {
      const parsed = JSON.parse(marketStateStr);
      if (parsed.prices && parsed.inventory) {
        m = {
          ...parsed,
          prices: { ...m.prices, ...parsed.prices },
          inventory: { ...m.inventory, ...parsed.inventory },
          history: parsed.history || []
        };
      }
    } catch {}
    return m;
  }, [marketStateStr]);

  const handleTrade = async (resource: keyof typeof market.prices, action: 'buy' | 'sell', amount: number) => {
    if (loading) return;
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/game/market", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, resource, action, amount }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "İşlem başarısız");
      }

      setMessage({ text: "İşlem başarıyla gerçekleşti.", type: 'success' });
      onUpdate();
    } catch (e: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      setMessage({ text: e.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const renderResourceCard = (id: keyof typeof market.prices, name: string, icon: string, price: number, inventory: number) => (
    <div className="glass p-6 rounded-2xl flex flex-col items-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="text-4xl mb-2 z-10">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2 z-10">{name}</h3>
      <div className="w-full bg-white/5 rounded-lg p-3 mb-4 space-y-2 text-sm z-10">
        <div className="flex justify-between text-gray-300">
          <span>Birim Fiyat:</span>
          <span className="font-bold text-green-400">${Math.round(price)}</span>
        </div>
        <div className="flex justify-between text-gray-300 border-t border-white/5 pt-2">
          <span>Envanteriniz:</span>
          <span className="font-bold text-cyan-400">{Math.round(inventory)} Birim</span>
        </div>
        <div className="flex justify-between text-gray-300 border-t border-white/5 pt-2">
          <span>Toplam Değer:</span>
          <span className="font-bold text-yellow-400">${Math.round(inventory * price)}</span>
        </div>
      </div>
      
      <div className="w-full grid grid-cols-2 gap-2 mt-auto z-10">
        <div className="flex flex-col gap-2">
          {[1, 10, 50].map(amt => (
            <button 
              key={`buy-${amt}`}
              onClick={() => handleTrade(id, 'buy', amt)}
              disabled={loading || budget < price * amt}
              className="btn-primary text-xs py-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {amt} Al (${Math.round(price * amt)})
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {[1, 10, 50].map(amt => (
            <button 
              key={`sell-${amt}`}
              onClick={() => handleTrade(id, 'sell', amt)}
              disabled={loading || inventory < amt}
              className="bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 rounded-lg font-bold transition-all text-xs py-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(239,68,68,0.2)]"
            >
              {amt} Sat
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Format data for Recharts
  const chartData = market.history.map(h => ({
    turn: `Tur ${h.turn}`,
    ...h.prices
  }));

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="text-3xl">📈</span> Küresel Borsa ve Emtialar
        </h2>
        <p className="text-gray-400 mb-6 text-sm">
          Borsa fiyatları yaşanan krizlere, savaşlara ve ekonomik patlamalara göre sert dalgalanmalar gösterir. Fırsatları değerlendirin! 
          Mevcut bütçeniz: <strong className="text-green-400">${Math.round(budget)}</strong>
        </p>
        
        {message && (
          <div className={`p-4 rounded-xl mb-6 text-sm ${message.type === 'success' ? 'bg-green-500/20 border border-green-500/30 text-green-300' : 'bg-red-500/20 border border-red-500/30 text-red-300'}`}>
            {message.text}
          </div>
        )}
      </div>

      {market.history.length > 0 && (
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-4">Tarihsel Fiyat Grafiği</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="turn" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="tech" name="Teknoloji" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="arms" name="Silah" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="medical" name="Medikal" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="energy" name="Enerji" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="food" name="Gıda" stroke="#84cc16" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="minerals" name="Mineral" stroke="#64748b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderResourceCard("energy", "Enerji", "⚡", market.prices.energy, market.inventory.energy)}
              {renderResourceCard("food", "Gıda", "🌾", market.prices.food, market.inventory.food)}
              {renderResourceCard("tech", "Teknoloji", "💻", market.prices.tech, market.inventory.tech)}
              {renderResourceCard("medical", "Medikal", "🏥", market.prices.medical, market.inventory.medical)}
              {renderResourceCard("arms", "Silah / Mühimmat", "🛡️", market.prices.arms, market.inventory.arms)}
              {renderResourceCard("minerals", "Maden / Mineral", "🪨", market.prices.minerals, market.inventory.minerals)}
      </div>
    </div>
  );
}
