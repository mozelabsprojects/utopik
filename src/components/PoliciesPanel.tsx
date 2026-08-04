"use client";

import { useState } from "react";
import { POLICIES, PolicyId } from "@/lib/policies";
import { GameState } from "@/lib/types";

interface PoliciesPanelProps {
  gameState: GameState;
  onUpdate: () => void;
}

export default function PoliciesPanel({ gameState, onUpdate }: PoliciesPanelProps) {
  const [isProcessing, setIsProcessing] = useState(false);
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

  return (
    <div className="glass p-6 rounded-2xl animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-3xl">📜</span> Kanunlar ve Politikalar
        </h2>
        <div className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-lg font-bold border border-cyan-500/30">
          Siyasi Sermaye: {Math.round(gameState.politicalCapital)}
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-6">
        Yasa geçirmek siyasi sermaye (Political Capital) harcar ve ülkenin gidişatını, fraksiyon dengelerini pasif olarak etkiler.
      </p>

      {message && (
        <div className={`p-4 rounded-lg mb-6 text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
          {message.text}
        </div>
      )}

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
              <p className="text-sm text-gray-400 mb-4 h-10">{policy.description}</p>
              
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
  );
}
