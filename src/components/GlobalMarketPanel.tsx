"use client";

import React, { useState } from "react";
import { GameState, MarketState } from "@/lib/types";

interface GlobalMarketPanelProps {
  gameId: string;
  budget: number;
  marketStateStr: string;
  onUpdate: () => void;
}

export default function GlobalMarketPanel({ gameId, budget, marketStateStr, onUpdate }: GlobalMarketPanelProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // Parse market state or use defaults
  let market: MarketState = {
    prices: { energy: 100, food: 50, tech: 200 },
    inventory: { energy: 0, food: 0, tech: 0 }
  };
  try {
    const parsed = JSON.parse(marketStateStr);
    if (parsed.prices && parsed.inventory) market = parsed;
  } catch {}

  const handleTrade = async (resource: 'energy' | 'food' | 'tech', action: 'buy' | 'sell', amount: number) => {
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
    } catch (e: any) {
      setMessage({ text: e.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const ResourceCard = ({ id, name, icon, price, inventory }: { id: 'energy'|'food'|'tech', name: string, icon: string, price: number, inventory: number }) => (
    <div className="glass p-6 rounded-2xl flex flex-col items-center">
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
      <div className="w-full bg-white/5 rounded-lg p-3 mb-4 space-y-2 text-sm">
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
      
      <div className="w-full grid grid-cols-2 gap-2 mt-auto">
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

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
        <span className="text-3xl">📈</span> Küresel Borsa ve Kaynaklar
      </h2>
      <p className="text-gray-400 mb-6 text-sm">
        Borsa fiyatları her tur dünya gündemine ve krizlere göre ±%20 oranında dalgalanır. 
        Mevcut bütçeniz: <strong className="text-green-400">${Math.round(budget)}</strong>
      </p>

      {message && (
        <div className={`p-4 rounded-xl mb-6 text-sm ${message.type === 'success' ? 'bg-green-500/20 border border-green-500/30 text-green-300' : 'bg-red-500/20 border border-red-500/30 text-red-300'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ResourceCard id="energy" name="Enerji" icon="⚡" price={market.prices.energy} inventory={market.inventory.energy} />
        <ResourceCard id="food" name="Gıda" icon="🌾" price={market.prices.food} inventory={market.inventory.food} />
        <ResourceCard id="tech" name="Teknoloji" icon="💻" price={market.prices.tech} inventory={market.inventory.tech} />
      </div>
    </div>
  );
}
