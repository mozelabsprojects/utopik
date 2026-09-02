"use client";

import React, { useState } from "react";

interface ElectionModalProps {
  gameId: string;
  turn: number;
  popularity: number;
  politicalCapital: number;
  onComplete: () => void;
}

export default function ElectionModal({ gameId, turn, popularity, politicalCapital, onComplete }: ElectionModalProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleElectionAction = async (action: 'campaign' | 'rig' | 'normal') => {
    setLoading(true);
    try {
      const res = await fetch("/api/game/election", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setResult(data.message);
      
      if (data.gameOver) {
        setTimeout(() => {
          window.location.href = "/";
        }, 5000);
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
        <div className="bg-[#16223e] border border-[var(--color-border)] rounded-2xl max-w-lg w-full p-8 shadow-2xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">🗳️ Seçim Sonuçları</h2>
          <p className="text-lg text-gray-300 mb-8">{result}</p>
          {!result.includes("HEZİMET") && (
            <button 
              onClick={onComplete}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-xl transition-all"
            >
              Devam Et
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-[#16223e] border border-[var(--color-border)] rounded-2xl max-w-xl w-full p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-500"></div>
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center text-3xl mb-4">🗳️</div>
          <h2 className="text-3xl font-bold text-white text-center">Genel Seçimler Geldi!</h2>
          <p className="text-gray-400 mt-2 text-center">Halk sandık başına gidiyor. Kaderiniz belirlenecek.</p>
        </div>

        <div className="bg-black/30 rounded-xl p-4 mb-6 border border-white/5 text-center">
          <div className="text-sm text-gray-400 mb-1">Mevcut Halk Desteğiniz (Anketler)</div>
          <div className={`text-4xl font-bold ${popularity >= 50 ? 'text-green-400' : 'text-red-400'}`}>
            %{Math.round(popularity)}
          </div>
          {popularity < 50 && (
            <div className="text-xs text-red-400 mt-2 font-bold animate-pulse">KAYBETME RİSKİ YÜKSEK!</div>
          )}
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => handleElectionAction('normal')}
            disabled={loading}
            className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-xl transition-all flex items-center gap-4"
          >
            <div className="text-2xl">⚖️</div>
            <div>
              <div className="font-bold text-white">Normal Seçim Kampanyası</div>
              <div className="text-sm text-gray-400">Sonuç anketlere göre belirlenir. Ek masraf yok.</div>
            </div>
          </button>

          <button 
            onClick={() => handleElectionAction('campaign')}
            disabled={loading || politicalCapital < 20}
            className={`w-full text-left p-4 rounded-xl transition-all flex items-center gap-4 border ${politicalCapital >= 20 ? 'bg-cyan-900/30 hover:bg-cyan-900/50 border-cyan-500/30' : 'bg-gray-900/50 border-gray-800 opacity-50 cursor-not-allowed'}`}
          >
            <div className="text-2xl">📢</div>
            <div>
              <div className="font-bold text-cyan-300">Devlet İmkânlarıyla Propaganda (20 Siyasi Sermaye)</div>
              <div className="text-sm text-gray-400">Kazanma şansınızı büyük ölçüde artırır (+15 Puan).</div>
            </div>
          </button>

          <button 
            onClick={() => handleElectionAction('rig')}
            disabled={loading}
            className="w-full text-left bg-red-900/20 hover:bg-red-900/40 border border-red-500/30 p-4 rounded-xl transition-all flex items-center gap-4 group"
          >
            <div className="text-2xl group-hover:animate-bounce">🕵️</div>
            <div>
              <div className="font-bold text-red-400">Sandıklara Müdahale Et (Hile Yap)</div>
              <div className="text-sm text-gray-400">Kesin kazanırsınız ancak yakalanırsanız İstikrar -30 ve İsyan!</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
