"use client";

import React, { useState } from "react";
import { GameState, Bond } from "@/lib/types";

interface CentralBankPanelProps {
  gameState: GameState;
  onUpdate: () => void;
}

export default function CentralBankPanel({ gameState, onUpdate }: CentralBankPanelProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success'|'error'}|null>(null);
  
  let activeBonds: Bond[] = [];
  try {
    activeBonds = JSON.parse(gameState.activeBonds || "[]");
  } catch {}

  const currentInflation = gameState.inflation || 5.0;

  const handlePrintMoney = async (amount: number) => {
    setIsProcessing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/game/bank/print-money", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: gameState.id, amount })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setMessage({ text: `$${amount.toLocaleString()} basıldı ve hazineye eklendi. (Enflasyon fırladı!)`, type: 'success' });
      onUpdate();
    } catch (e: any) {
      setMessage({ text: e.message || "İşlem başarısız.", type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleIssueBond = async (amount: number) => {
    setIsProcessing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/game/bank/issue-bond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: gameState.id, amount })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setMessage({ text: `$${amount.toLocaleString()} tutarında tahvil ihraç edildi. (5 tur sonra faiziyle ödenecek)`, type: 'success' });
      onUpdate();
    } catch (e: any) {
      setMessage({ text: e.message || "İşlem başarısız.", type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-3xl">🏦</span> Merkez Bankası ve Hazine
        </h2>
        <div className={`px-4 py-2 rounded-lg font-bold border ${currentInflation > 20 ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'}`}>
          Enflasyon: %{currentInflation.toFixed(1)}
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PARA BASMA */}
        <div className="glass-premium p-6 rounded-2xl border border-red-500/20">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            🖨️ Karşılıksız Para Bas
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Anında nakit kaynağı yaratır ancak enflasyonu kalıcı olarak artırır. Yüksek enflasyon vergi gelirlerini eritir ve bakım maliyetlerini uçurur.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => handlePrintMoney(10000)}
              disabled={isProcessing}
              className="w-full py-3 bg-red-900/40 hover:bg-red-700/60 border border-red-500/50 rounded-xl font-bold text-red-200 transition-colors flex justify-between px-6"
            >
              <span>$10,000 Bas</span>
              <span className="text-xs opacity-75">Enflasyon +%15</span>
            </button>
            <button 
              onClick={() => handlePrintMoney(50000)}
              disabled={isProcessing}
              className="w-full py-3 bg-red-900/60 hover:bg-red-600/80 border border-red-500/80 rounded-xl font-bold text-white transition-colors flex justify-between px-6"
            >
              <span>$50,000 Bas</span>
              <span className="text-xs opacity-75">Enflasyon +%75 (KRİTİK)</span>
            </button>
          </div>
        </div>

        {/* TAHVİL İHRACI */}
        <div className="glass-premium p-6 rounded-2xl border border-yellow-500/20">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            📜 Tahvil İhracı (Borçlanma)
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Piyasalardan 5 turluğuna borç alın. Faiz oranları mevcut enflasyon ve istikrar riskinize göre belirlenir. Vadesi geldiğinde ödeyemezseniz ülke temerrüde düşer.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => handleIssueBond(25000)}
              disabled={isProcessing}
              className="w-full py-3 bg-yellow-900/40 hover:bg-yellow-700/60 border border-yellow-500/50 rounded-xl font-bold text-yellow-200 transition-colors flex justify-between px-6"
            >
              <span>$25,000 Borç Al</span>
              <span className="text-xs opacity-75">Vade: 5 Tur</span>
            </button>
            <button 
              onClick={() => handleIssueBond(100000)}
              disabled={isProcessing}
              className="w-full py-3 bg-yellow-900/60 hover:bg-yellow-600/80 border border-yellow-500/80 rounded-xl font-bold text-white transition-colors flex justify-between px-6"
            >
              <span>$100,000 Borç Al</span>
              <span className="text-xs opacity-75">Vade: 5 Tur</span>
            </button>
          </div>
        </div>
      </div>

      {/* AKTİF BORÇLAR (TAHVİLLER) LİSTESİ */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          💸 Aktif Borçlar (Tahviller)
        </h3>
        {activeBonds.length > 0 ? (
          <div className="space-y-3">
            {activeBonds.map((bond) => {
              const turnsLeft = bond.duration - (gameState.turn - bond.turnIssued);
              return (
                <div key={bond.id} className="p-4 rounded-xl bg-black/40 border border-white/10 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-yellow-400">${bond.totalToRepay.toLocaleString()} Ödenecek</div>
                    <div className="text-xs text-gray-400">Alınan Borç: ${bond.amount.toLocaleString()} | Faiz: %{(bond.interestRate * 100).toFixed(1)}</div>
                  </div>
                  <div className={`px-3 py-1 rounded font-bold text-sm ${turnsLeft <= 1 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-gray-800 text-gray-300'}`}>
                    {turnsLeft <= 0 ? 'Bu Tur Ödenecek!' : `${turnsLeft} Tur Kaldı`}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-24 flex items-center justify-center text-gray-500 text-sm border-2 border-dashed border-white/10 rounded-xl">
            Şu an Merkez Bankası'nın piyasalara borcu bulunmuyor.
          </div>
        )}
      </div>
    </div>
  );
}
