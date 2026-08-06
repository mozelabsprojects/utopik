"use client";

import React, { useState, useMemo } from "react";
import { MarketState } from "@/lib/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GlobalMarketPanelProps {
  gameId: string;
  budget: number;
  marketStateStr: string;
  onUpdate: () => void;
}

export default function GlobalMarketPanel({ gameId, budget, marketStateStr, onUpdate }: GlobalMarketPanelProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [selectedResource, setSelectedResource] = useState<keyof MarketState['prices'] | 'all'>('all');
  const [tradeAmounts, setTradeAmounts] = useState<Record<string, string>>({});

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
    } catch (e: any) {
      setMessage({ text: e.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleHireExpert = async (level: number) => {
    if (loading) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/game/market/expert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, expertLevel: level }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "İşlem başarısız");
      }
      setMessage({ text: "Yatırım uzmanı kiralandı. Artık trendleri görebilirsiniz!", type: 'success' });
      onUpdate();
    } catch (e: any) {
      setMessage({ text: e.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getPriceChangeInfo = (id: keyof typeof market.prices) => {
    if (market.history.length < 2) return { diff: 0, percent: 0, isUp: true };
    const currentPrice = market.prices[id];
    const oldPrice = market.history[market.history.length - 2].prices[id];
    const diff = currentPrice - oldPrice;
    const percent = oldPrice > 0 ? (diff / oldPrice) * 100 : 0;
    return { diff, percent, isUp: diff >= 0 };
  };

  const getTrendIcon = (id: keyof typeof market.prices) => {
    if (!market.activeExpertLevel) return null;
    const level = market.activeExpertLevel;
    const trend = market.trends?.[id];
    if (!trend) return null;

    const visibleKeys: Array<keyof typeof market.prices> = [];
    const allKeys = Object.keys(market.prices) as Array<keyof typeof market.prices>;
    
    if (level === 1) visibleKeys.push(allKeys[0]); // Just one static mapping for demo (or random if we stored it, but we'll show first)
    else if (level === 2) { visibleKeys.push(allKeys[0], allKeys[1], allKeys[2]); }
    else if (level === 3) { visibleKeys.push(...allKeys); }

    // Basit mantık: Level'a göre indexli ürünleri gösterelim (ya da Hepsine izin verelim ama sadece belirli ürünlere random gösterelim).
    // Daha doğrusu, Level 1: sadece Energy'yi göster. Level 2: ilk 3'ü. Level 3: hepsini.
    const isVisible = visibleKeys.includes(id);

    if (!isVisible) return <span className="text-gray-500 text-xs">🔒 Gizli</span>;

    if (trend.direction === 'up') return <span className="text-green-400 font-bold text-xs bg-green-900/30 px-1 rounded flex items-center">📈 Yükseliş</span>;
    if (trend.direction === 'down') return <span className="text-red-400 font-bold text-xs bg-red-900/30 px-1 rounded flex items-center">📉 Düşüş</span>;
    return <span className="text-gray-400 font-bold text-xs bg-gray-700/50 px-1 rounded flex items-center">➖ Yatay</span>;
  };

  const renderResourceCard = (id: keyof typeof market.prices, name: string, icon: string, price: number, inventory: number) => {
    const change = getPriceChangeInfo(id);
    const isSelected = selectedResource === id;
    
    return (
      <div 
        key={id}
        onClick={() => setSelectedResource(isSelected ? 'all' : id)}
        className={`glass p-4 rounded-2xl flex flex-col items-center relative overflow-hidden group cursor-pointer transition-all duration-300 ${isSelected ? 'ring-2 ring-cyan-400 scale-[1.02]' : 'hover:bg-slate-800/80'}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        {/* Yüzdelik Değişim (Kripto Tarzı) */}
        <div className="absolute top-3 right-3 text-xs font-bold">
          <span className={change.isUp ? 'text-green-400' : 'text-red-400'}>
            {change.isUp ? '▲' : '▼'} {Math.abs(change.percent).toFixed(1)}%
          </span>
        </div>

        <div className="text-4xl mb-2 z-10">{icon}</div>
        <h3 className="text-lg font-bold text-white mb-1 z-10">{name}</h3>
        
        {/* Trend Uzmanı Göstergesi */}
        <div className="mb-3 h-5">
          {getTrendIcon(id)}
        </div>

        <div className="w-full bg-slate-900/50 rounded-lg p-3 mb-4 space-y-1 text-sm z-10 border border-slate-700/50">
          <div className="flex justify-between text-gray-300">
            <span className="text-xs text-gray-400">Birim Fiyat:</span>
            <span className="font-bold text-white">${Math.round(price)}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span className="text-xs text-gray-400">Envanter:</span>
            <span className="font-bold text-cyan-400">{Math.round(inventory)} Birim</span>
          </div>
        </div>
        
        {/* Sparkline (Mini Grafik) */}
        {market.history.length > 0 && (
          <div className="w-full h-12 mb-4 opacity-70 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={market.history.map(h => ({ turn: h.turn, value: h.prices[id] }))}>
                <Line type="monotone" dataKey="value" stroke={change.isUp ? "#4ade80" : "#f87171"} strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {/* İşlem Paneli (Input ve Butonlar) */}
        <div className="w-full mt-auto z-10" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between gap-1 mb-1">
            <button 
              onClick={() => setTradeAmounts(prev => ({ ...prev, [id]: Math.floor(budget / price).toString() }))}
              className="flex-1 text-[10px] font-bold bg-green-500/10 text-green-400 hover:bg-green-500/30 rounded py-1 border border-green-500/20 transition"
            >
              MAX AL
            </button>
            <button 
              onClick={() => setTradeAmounts(prev => ({ ...prev, [id]: Math.floor(budget / (price * 2)).toString() }))}
              className="flex-1 text-[10px] font-bold bg-blue-500/10 text-blue-400 hover:bg-blue-500/30 rounded py-1 border border-blue-500/20 transition"
            >
              %50 AL
            </button>
            <button 
              onClick={() => setTradeAmounts(prev => ({ ...prev, [id]: Math.floor(inventory).toString() }))}
              className="flex-1 text-[10px] font-bold bg-red-500/10 text-red-400 hover:bg-red-500/30 rounded py-1 border border-red-500/20 transition"
            >
              TÜMÜNÜ SAT
            </button>
          </div>

          <div className="flex items-center bg-slate-900/80 rounded-lg overflow-hidden border border-slate-700 p-1 mb-2">
            <input 
              type="number" 
              min="1"
              value={tradeAmounts[id] !== undefined ? tradeAmounts[id] : "1"}
              onChange={(e) => {
                setTradeAmounts(prev => ({ ...prev, [id]: e.target.value }));
              }}
              className="flex-1 w-full bg-transparent text-center text-white font-bold outline-none no-spinners"
              style={{ MozAppearance: 'textfield' }}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => {
                const amt = parseInt(tradeAmounts[id]) || 1;
                handleTrade(id, 'buy', amt);
              }}
              disabled={loading || budget < price * (parseInt(tradeAmounts[id]) || 1)}
              className="bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/40 hover:text-green-200 rounded text-sm py-1.5 disabled:opacity-30 transition-colors font-bold flex items-center justify-center gap-1"
            >
              <span className="text-lg leading-none">💰</span> Al
            </button>
            <button 
              onClick={() => {
                const amt = parseInt(tradeAmounts[id]) || 1;
                handleTrade(id, 'sell', amt);
              }}
              disabled={loading || inventory < (parseInt(tradeAmounts[id]) || 1) || inventory === 0}
              className="bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/40 hover:text-red-200 rounded text-sm py-1.5 disabled:opacity-30 transition-colors font-bold flex items-center justify-center gap-1"
            >
              <span className="text-lg leading-none">📉</span> Sat
            </button>
          </div>
        </div>
      </div>
    );
  };

  const chartData = market.history.map(h => ({
    turn: `Tur ${h.turn}`,
    ...h.prices
  }));

  const chartColors: Record<keyof typeof market.prices, string> = {
    energy: '#f59e0b', food: '#84cc16', tech: '#8b5cf6', medical: '#10b981', arms: '#ef4444', minerals: '#64748b'
  };
  const chartNames: Record<keyof typeof market.prices, string> = {
    energy: 'Enerji', food: 'Gıda', tech: 'Teknoloji', medical: 'Medikal', arms: 'Silah', minerals: 'Mineral'
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* BAŞLIK & MESAJ */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">📈</span> Kripto & Emtia Borsası
          </h2>
          <p className="text-slate-400 text-sm mt-1">Piyasa dalgalanmalarını takip edin ve kâr edin.</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Bütçe</div>
          <div className="text-xl font-bold text-green-400">${Math.round(budget)}</div>
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
          {message.text}
        </div>
      )}

      {/* UZMAN KİRALAMA BÖLÜMÜ */}
      <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl">
        <h3 className="text-sm font-bold text-yellow-400 mb-3 flex items-center gap-2">
          <span>🕵️</span> Yatırım Uzmanları (4 Tur Boyunca Geleceği Tahmin Ederler)
        </h3>
        
        {market.activeExpertLevel && market.activeExpertLevel > 0 ? (
          <div className="bg-green-900/20 border border-green-500/30 p-3 rounded-lg flex justify-between items-center">
            <div className="text-green-300 text-sm">
              <span className="font-bold">Aktif Uzman:</span> Seviye {market.activeExpertLevel}
            </div>
            <div className="text-xs text-green-400">
              Kalan Süre: <span className="font-bold text-lg">{market.expertTurnsRemaining}</span> Tur
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button 
              onClick={() => handleHireExpert(1)} 
              disabled={loading || budget < (1000 + Math.floor(budget * 0.05))} 
              className="bg-slate-900 border border-slate-600 p-3 rounded-lg hover:border-yellow-500/50 hover:bg-slate-800 transition text-left disabled:opacity-50"
            >
              <div className="text-white font-bold">Çaylak Analist</div>
              <div className="text-yellow-400 font-semibold mt-1 mb-1">${1000 + Math.floor(budget * 0.05)} <span className="text-[10px] text-gray-500">(1k + %5)</span></div>
              <div className="text-xs text-slate-400">Sadece Enerji piyasasının yönünü bilir.</div>
            </button>
            <button 
              onClick={() => handleHireExpert(2)} 
              disabled={loading || budget < (3000 + Math.floor(budget * 0.10))} 
              className="bg-slate-900 border border-slate-600 p-3 rounded-lg hover:border-yellow-500/50 hover:bg-slate-800 transition text-left disabled:opacity-50"
            >
              <div className="text-white font-bold">Kıdemli Broker</div>
              <div className="text-yellow-400 font-semibold mt-1 mb-1">${3000 + Math.floor(budget * 0.10)} <span className="text-[10px] text-gray-500">(3k + %10)</span></div>
              <div className="text-xs text-slate-400">Enerji, Gıda ve Teknoloji yönünü bilir.</div>
            </button>
            <button 
              onClick={() => handleHireExpert(3)} 
              disabled={loading || budget < (8000 + Math.floor(budget * 0.20))} 
              className="bg-slate-900 border border-yellow-600/50 p-3 rounded-lg hover:border-yellow-400 hover:bg-slate-800 transition text-left disabled:opacity-50"
            >
              <div className="text-yellow-400 font-bold">Wall Street Kurdu</div>
              <div className="text-yellow-400 font-semibold mt-1 mb-1">${8000 + Math.floor(budget * 0.20)} <span className="text-[10px] text-yellow-600/50">(8k + %20)</span></div>
              <div className="text-xs text-slate-400">TÜM emtiaların yönünü kesin olarak söyler.</div>
            </button>
          </div>
        )}
      </div>

      {/* GRAFİK */}
      {market.history.length > 0 && (
        <div className="glass p-4 rounded-xl">
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="turn" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                  labelStyle={{ display: 'none' }}
                />
                
                {selectedResource === 'all' ? (
                  Object.keys(market.prices).map(key => (
                    <Line key={key} type="monotone" dataKey={key} name={chartNames[key as keyof typeof market.prices]} stroke={chartColors[key as keyof typeof market.prices]} strokeWidth={2} dot={false} />
                  ))
                ) : (
                  <Line type="monotone" dataKey={selectedResource} name={chartNames[selectedResource]} stroke={chartColors[selectedResource]} strokeWidth={3} dot={{r:3}} activeDot={{r:5}} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          {selectedResource !== 'all' && (
            <div className="text-center mt-2 text-xs text-gray-400">
              Tüm grafikleri görmek için seçili karta tekrar tıklayın.
            </div>
          )}
        </div>
      )}

      {/* ÜRÜN KARTLARI */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {renderResourceCard("energy", "Enerji", "⚡", market.prices.energy, market.inventory.energy)}
        {renderResourceCard("food", "Gıda", "🌾", market.prices.food, market.inventory.food)}
        {renderResourceCard("tech", "Teknoloji", "💻", market.prices.tech, market.inventory.tech)}
        {renderResourceCard("medical", "Medikal", "🏥", market.prices.medical, market.inventory.medical)}
        {renderResourceCard("arms", "Silah", "🛡️", market.prices.arms, market.inventory.arms)}
        {renderResourceCard("minerals", "Maden", "🪨", market.prices.minerals, market.inventory.minerals)}
      </div>
    </div>
  );
}
