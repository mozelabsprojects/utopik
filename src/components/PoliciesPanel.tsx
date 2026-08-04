"use client";

import { useState } from "react";
import { POLICIES, PolicyId } from "@/lib/policies";
import { EXECUTIVE_ACTIONS } from "@/lib/executive-actions";
import { GameState, StatEffects } from "@/lib/types";

const STAT_LABELS: Record<string, string> = {
  budget: "Bütçe",
  military: "Askeriye",
  happiness: "Mutluluk",
  health: "Sağlık",
  environment: "Çevre",
  education: "Eğitim",
  stability: "İstikrar",
  foreignRelations: "Dış İlişkiler",
};

const renderEffects = (effects: StatEffects) => {
  return Object.entries(effects).map(([key, val]) => {
    if (!val) return null;
    const isPositive = val > 0;
    const prefix = key === "budget" ? (isPositive ? "+$" : "-$") : (isPositive ? "+" : "");
    const valueStr = key === "budget" ? Math.abs(val) : val;
    return (
      <span key={key} className={`text-[10px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
        {prefix}{valueStr} {STAT_LABELS[key] || key}
      </span>
    );
  });
};

interface PoliciesPanelProps {
  gameState: GameState;
  onUpdate: () => void;
}

export default function PoliciesPanel({ gameState, onUpdate }: PoliciesPanelProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isActionProcessing, setIsActionProcessing] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success'|'error'}|null>(null);

  let activeLaws: PolicyId[] = [];
  try {
    activeLaws = JSON.parse(gameState.activeLaws);
  } catch {}

  const handlePolicyAction = async (policyId: string, action: "enact" | "repeal") => {
    setIsProcessing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/game/policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: gameState.id, policyId, action })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setMessage({ text: action === "enact" ? "Yasa başarıyla yürürlüğe girdi." : "Yasa iptal edildi.", type: 'success' });
      onUpdate(); // state'i yenile
    } catch (e: any) {
      setMessage({ text: e.message || "İşlem başarısız.", type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecutiveAction = async (actionId: string) => {
    setIsActionProcessing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/game/executive-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: gameState.id, actionId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setMessage({ text: "Kararname başarıyla uygulandı.", type: 'success' });
      onUpdate(); // state'i yenile
    } catch (e: any) {
      setMessage({ text: e.message || "İşlem başarısız.", type: 'error' });
    } finally {
      setIsActionProcessing(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-3xl">📜</span> Kanunlar ve Politikalar
        </h2>
        <div className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-lg font-bold border border-cyan-500/30">
          Siyasi Sermaye: {Math.round(gameState.politicalCapital)}
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
          {message.text}
        </div>
      )}

      {/* KARARNAMELER (EXECUTIVE ACTIONS) */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <span>🏛️</span> Hızlı Kararnameler
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Siyasi sermayenizi anında harcayarak ülkenize geçici çözümler ve hızlı statü artışları sağlayabilirsiniz.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(EXECUTIVE_ACTIONS).map((action) => {
            const canAfford = gameState.politicalCapital >= action.cost;
            
            return (
              <div key={action.id} className="p-4 rounded-xl border bg-white/5 border-white/10 hover:border-cyan-500/30 transition-all flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-md font-bold text-cyan-300 flex items-center gap-2">
                    <span>{action.icon}</span> {action.name}
                  </h4>
                  <span className="text-xs font-bold bg-cyan-900/50 text-cyan-200 px-2 py-1 rounded">
                    {action.cost} PC
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3 flex-1">{action.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {renderEffects(action.effects)}
                </div>
                <button
                  onClick={() => handleExecutiveAction(action.id)}
                  disabled={isActionProcessing || !canAfford}
                  className={`w-full py-2 rounded-lg font-bold text-xs transition-colors ${
                    !canAfford ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50' : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/40'
                  }`}
                >
                  {isActionProcessing ? "Uygulanıyor..." : "Kararnameyi Çıkar"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* KANUNLAR (POLICIES) */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <span>📜</span> Kalıcı Kanunlar
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Yasa geçirmek siyasi sermaye (Political Capital) harcar ve ülkenin gidişatını, fraksiyon dengelerini pasif olarak etkiler.
        </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(POLICIES).map((policy) => {
          const isActive = activeLaws.includes(policy.id);
          const cost = isActive ? Math.max(1, Math.round(policy.politicalCost / 2)) : policy.politicalCost;
          const canAfford = gameState.politicalCapital >= cost;

          return (
            <div key={policy.id} className={`p-5 rounded-xl border transition-all ${isActive ? 'bg-cyan-900/30 border-cyan-500/50' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className={`text-lg font-bold ${isActive ? 'text-cyan-300' : 'text-gray-200'}`}>
                  {policy.name} {isActive && "✓"}
                </h3>
                <span className="text-xs bg-black/50 px-2 py-1 rounded text-gray-400">
                  Maliyet: {policy.politicalCost} | İptal: {Math.max(1, Math.round(policy.politicalCost / 2))}
                </span>
              </div>
              <div className="text-sm text-gray-400 mb-2 h-10 flex items-center">
                <p>{policy.description}</p>
              </div>
              <div className="flex flex-wrap gap-1 mb-4 h-5">
                {renderEffects(policy.passiveEffects)}
              </div>
              
              <button
                onClick={() => handlePolicyAction(policy.id, isActive ? "repeal" : "enact")}
                disabled={isProcessing || !canAfford}
                className={`w-full py-2 rounded-lg font-bold text-sm transition-colors ${
                  !canAfford ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50' :
                  isActive 
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                    : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                }`}
              >
                {isProcessing ? "İşleniyor..." : (isActive ? `Yasayı İptal Et (Maliyet: ${cost})` : `Yasayı Geçir (Maliyet: ${cost})`)}
              </button>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
