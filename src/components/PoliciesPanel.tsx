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
  energy: "Enerji",
  food: "Gıda",
  materials: "Materyal",
  tech: "Teknoloji",
  inflation: "Enflasyon",
  popularity: "Popülarite",
  politicalCapital: "Siyasi Sermaye",
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
  
  // Lobbying state
  const [lobbyPrompt, setLobbyPrompt] = useState<{
    policyId: string, 
    action: "enact" | "repeal", 
    votes: { yes: number, no: number },
    cost: number
  } | null>(null);

  let activeLaws: PolicyId[] = [];
  try {
    activeLaws = JSON.parse(gameState.activeLaws);
  } catch {}

  const totalPassiveEffects: StatEffects = {
    budget: 0,
    military: 0,
    happiness: 0,
    health: 0,
    environment: 0,
    education: 0,
    stability: 0,
    foreignRelations: 0,
  };

  activeLaws.forEach((policyId) => {
    const policy = POLICIES[policyId];
    if (policy && policy.passiveEffects) {
      if (policy.passiveEffects.budget) totalPassiveEffects.budget! += policy.passiveEffects.budget;
      if (policy.passiveEffects.military) totalPassiveEffects.military! += policy.passiveEffects.military;
      if (policy.passiveEffects.happiness) totalPassiveEffects.happiness! += policy.passiveEffects.happiness;
      if (policy.passiveEffects.health) totalPassiveEffects.health! += policy.passiveEffects.health;
      if (policy.passiveEffects.environment) totalPassiveEffects.environment! += policy.passiveEffects.environment;
      if (policy.passiveEffects.education) totalPassiveEffects.education! += policy.passiveEffects.education;
      if (policy.passiveEffects.stability) totalPassiveEffects.stability! += policy.passiveEffects.stability;
      if (policy.passiveEffects.foreignRelations) totalPassiveEffects.foreignRelations! += policy.passiveEffects.foreignRelations;
    }
  });

  const hasAnyEffects = Object.values(totalPassiveEffects).some(val => val !== 0);

  const handlePolicyAction = async (policyId: string, action: "enact" | "repeal", isLobbying: boolean = false) => {
    setIsProcessing(true);
    setMessage(null);
    setLobbyPrompt(null);
    
    try {
      const res = await fetch("/api/game/policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: gameState.id, policyId, action, isLobbying })
      });
      const data = await res.json();
      
      if (!res.ok) {
        if (data.requiresLobbying) {
          const policy = POLICIES[policyId as PolicyId];
          const baseCost = action === "enact" ? policy.politicalCost : Math.max(1, Math.round(policy.politicalCost / 2));
          setLobbyPrompt({
            policyId,
            action,
            votes: data.votes,
            cost: baseCost * 2
          });
          return;
        }
        throw new Error(data.error);
      }
      
      const successMsg = action === "enact" ? "Yasa başarıyla meclisten geçti." : "Yasa meclis kararıyla iptal edildi.";
      const impactMsg = data.impactString ? ` Etkisi: ${data.impactString}` : '';
      setMessage({ text: `${successMsg}${impactMsg}`, type: 'success' });
      onUpdate(); 
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

      {/* TOPLAM ETKİ ÖZETİ */}
      <div className="glass-premium p-6 rounded-2xl border border-cyan-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <span>📊</span> Yürürlükteki Yasaların Toplam Tur Başına Etkisi
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Aşağıdaki etkiler her tur atladığınızda otomatik olarak statlarınıza yansır.
        </p>
        <div className="flex flex-wrap gap-2">
          {hasAnyEffects ? renderEffects(totalPassiveEffects) : (
            <span className="text-gray-500 text-sm italic">Henüz pasif etkisi olan bir yasa yürürlükte değil.</span>
          )}
        </div>
      </div>

      {/* LOBİ (RÜŞVET/İKNA) EKRANI */}
      {lobbyPrompt && (
        <div className="bg-yellow-900/40 border border-yellow-500/50 p-6 rounded-2xl animate-fade-in shadow-[0_0_30px_rgba(234,179,8,0.2)]">
          <h3 className="text-2xl font-bold text-yellow-400 mb-2 flex items-center gap-2">
            <span>⚖️</span> Meclis Çıkmazı!
          </h3>
          <p className="text-gray-200 mb-4">
            Sunulan tasarı meclisten geçemedi. Fraksiyonlar ikiye bölünmüş durumda.
          </p>
          
          <div className="flex items-center gap-6 mb-6 bg-black/30 p-4 rounded-xl">
            <div className="flex-1 text-center">
              <div className="text-4xl mb-1">👍</div>
              <div className="text-green-400 font-bold text-xl">{lobbyPrompt.votes.yes} Koltuk</div>
              <div className="text-xs text-gray-500 uppercase">Kabul</div>
            </div>
            <div className="flex-1 text-center border-l border-white/10">
              <div className="text-4xl mb-1">👎</div>
              <div className="text-red-400 font-bold text-xl">{lobbyPrompt.votes.no} Koltuk</div>
              <div className="text-xs text-gray-500 uppercase">Ret</div>
            </div>
          </div>
          
          <p className="text-yellow-300/80 text-sm mb-6">
            Kararsız vekilleri ikna etmek (lobi yapmak) için ekstra siyasi sermaye harcayarak yasayı zorla geçirebilirsiniz. 
            Maliyet: <strong>{lobbyPrompt.cost} PC</strong>
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={() => handlePolicyAction(lobbyPrompt.policyId, lobbyPrompt.action, true)}
              disabled={isProcessing || gameState.politicalCapital < lobbyPrompt.cost}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                gameState.politicalCapital < lobbyPrompt.cost 
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                  : 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]'
              }`}
            >
              {isProcessing ? "İkna Ediliyor..." : `Lobi Yap ve Geçir (${lobbyPrompt.cost} PC)`}
            </button>
            <button
              onClick={() => setLobbyPrompt(null)}
              className="px-6 py-3 rounded-xl font-bold border border-gray-600 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              Vazgeç
            </button>
          </div>
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
          Yasaları meclise sunmak siyasi sermaye (Political Capital) harcar. Meclisteki oylar fraksiyonların gücüne göre belirlenir.
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
                disabled={isProcessing || !canAfford || lobbyPrompt !== null}
                className={`w-full py-2 rounded-lg font-bold text-sm transition-colors ${
                  (!canAfford || lobbyPrompt !== null) ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50' :
                  isActive 
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                    : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                }`}
              >
                {isProcessing ? "Oylanıyor..." : (isActive ? `İptali Meclise Sun (${cost} PC)` : `Meclise Sun (${cost} PC)`)}
              </button>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
