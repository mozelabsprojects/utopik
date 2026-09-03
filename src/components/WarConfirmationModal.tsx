import React from "react";
import { WorldCountryState, GameState } from "@/lib/types";

interface WarConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  targetCountry: WorldCountryState | null;
  playerMilitary: number;
  playerBudget: number;
}

export default function WarConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  targetCountry,
  playerMilitary,
  playerBudget
}: WarConfirmationModalProps) {
  if (!isOpen || !targetCountry) return null;

  // Hesaplamalar (diplomacy-action ile uyumlu)
  const isTargetWeaker = playerMilitary > targetCountry.military;
  const winChance = Math.min(95, Math.max(5, (playerMilitary / (targetCountry.military || 1)) * 50));
  
  const estimatedLoot = Math.max(5000, targetCountry.budget + (targetCountry.military * 150) + (targetCountry.stability * 100));
  const estimatedLoss = Math.max(5000, playerBudget * 0.15);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-950 border-2 border-red-500/50 rounded-3xl p-6 max-w-lg w-full shadow-[0_0_50px_rgba(239,68,68,0.3)]">
        
        <div className="flex flex-col items-center mb-6 text-center">
          <span className="text-6xl mb-2 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">⚔️</span>
          <h2 className="text-2xl font-black font-[family-name:var(--font-display)] text-red-400 uppercase tracking-widest">
            Savaş İlanı: {targetCountry.name}
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Bu kararın geri dönüşü yoktur. Tüm diplomatik ilişkiler kesilecek ve uluslararası toplum tepki gösterecektir.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {/* Askeri Karşılaştırma */}
          <div className="bg-black/50 rounded-xl p-4 border border-white/10">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Güç Dengesi</h3>
            <div className="flex justify-between items-center text-sm">
              <span className="text-blue-400 font-bold flex items-center gap-2">🛡️ Biz: {Math.round(playerMilitary)}</span>
              <span className="text-slate-500 font-black">VS</span>
              <span className="text-red-400 font-bold flex items-center gap-2">{Math.round(targetCountry.military)} :Düşman ⚔️</span>
            </div>
            <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden flex">
              <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, Math.max(0, (playerMilitary / (playerMilitary + targetCountry.military)) * 100))}%` }}></div>
              <div className="h-full bg-red-500" style={{ width: `${Math.min(100, Math.max(0, (targetCountry.military / (playerMilitary + targetCountry.military)) * 100))}%` }}></div>
            </div>
          </div>

          {/* Olası Senaryolar */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-950/30 border border-green-500/30 rounded-xl p-4">
              <h4 className="text-green-400 font-bold text-sm mb-2">🏆 Zafer İhtimali</h4>
              <p className="text-2xl font-black text-white mb-2">~%{Math.round(winChance)}</p>
              <div className="text-xs text-slate-400 space-y-1">
                <p className="text-green-300">Tahmini Ganimet:</p>
                <p>+ ${Math.round(estimatedLoot).toLocaleString()}</p>
                <p>+ Popülarite / Mutluluk</p>
              </div>
            </div>
            
            <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-4">
              <h4 className="text-red-400 font-bold text-sm mb-2">💀 Bozgun İhtimali</h4>
              <p className="text-2xl font-black text-white mb-2">~%{Math.round(100 - winChance)}</p>
              <div className="text-xs text-slate-400 space-y-1">
                <p className="text-red-300">Savaş Tazminatı Kaybı:</p>
                <p>- ${Math.round(estimatedLoss).toLocaleString()}</p>
                <p>- Ağır İstikrar & Ordu Kaybı</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Geri Çekil
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-xl font-black bg-red-600 hover:bg-red-500 text-white uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            Saldırı Emri Ver! 🚀
          </button>
        </div>
        
      </div>
    </div>
  );
}
