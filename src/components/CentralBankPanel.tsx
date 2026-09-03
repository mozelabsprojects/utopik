"use client";

import React, { useState } from "react";
import { GameState, Bond, HistoryRecord } from "@/lib/types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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

  let historyData: HistoryRecord[] = [];
  try {
    historyData = JSON.parse(gameState.historicalData || "[]");
  } catch {}

  const chartData = {
    labels: historyData.map(d => `Tur ${d.turn}`),
    datasets: [
      {
        label: 'Enflasyon (%)',
        data: historyData.map(d => d.inflation),
        borderColor: 'rgba(239, 68, 68, 1)', // red-500
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(148, 163, 184, 0.8)' }
      },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(148, 163, 184, 0.8)', maxTicksLimit: 10 }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

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

  const handleRepayBond = async (bondId: string) => {
    setIsProcessing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/game/bank/repay-bond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: gameState.id, bondId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setMessage({ text: `Tahvil başarıyla erken kapatıldı.`, type: 'success' });
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

      {/* ENFLASYON GRAFİĞİ */}
      <div className="glass-premium p-6 rounded-2xl border border-white/5">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          📉 Enflasyon Eğrisi
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Zaman içindeki enflasyon dalgalanmaları. Karşılıksız para basmak bu eğriyi dikey olarak zıplatır.
        </p>
        <div className="h-48 w-full">
          {historyData.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm border border-dashed border-white/10 rounded-xl">
              Yeterli veri yok. Sonraki turda grafik çizilmeye başlanacak.
            </div>
          )}
        </div>
      </div>

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
              onClick={() => handlePrintMoney(20000)}
              disabled={isProcessing}
              className="w-full py-3 bg-red-900/40 hover:bg-red-700/60 border border-red-500/50 rounded-xl font-bold text-red-200 transition-colors flex justify-between px-6"
            >
              <span>$20,000 Bas</span>
              <span className="text-xs opacity-75">Enflasyon +%15</span>
            </button>
            <button 
              onClick={() => handlePrintMoney(100000)}
              disabled={isProcessing}
              className="w-full py-3 bg-red-900/60 hover:bg-red-600/80 border border-red-500/80 rounded-xl font-bold text-white transition-colors flex justify-between px-6"
            >
              <span>$100,000 Bas</span>
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
              const canRepayEarly = gameState.budget >= bond.totalToRepay;
              return (
                <div key={bond.id} className="p-4 rounded-xl bg-black/40 border border-white/10 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-yellow-400">${bond.totalToRepay.toLocaleString()} Ödenecek</div>
                    <div className="text-xs text-gray-400">Alınan Borç: ${bond.amount.toLocaleString()} | Faiz: %{(bond.interestRate * 100).toFixed(1)}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded font-bold text-sm ${turnsLeft <= 1 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-gray-800 text-gray-300'}`}>
                      {turnsLeft <= 0 ? 'Bu Tur Ödenecek!' : `${turnsLeft} Tur Kaldı`}
                    </div>
                    {turnsLeft > 1 && (
                      <button 
                        onClick={() => handleRepayBond(bond.id)}
                        disabled={!canRepayEarly || isProcessing}
                        className={`px-3 py-1 rounded font-bold text-sm border transition-colors ${canRepayEarly ? 'bg-green-500/20 hover:bg-green-500/40 text-green-300 border-green-500/50' : 'bg-gray-800/50 text-gray-500 border-gray-700 cursor-not-allowed'} `}
                        title={!canRepayEarly ? "Bütçeniz yetersiz" : "Faiziyle beraber kapat"}
                      >
                        Erken Kapat
                      </button>
                    )}
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
