"use client";

import { calculateTaxIncome, calculateMaintenanceCost } from "@/lib/game-engine";
import { INITIAL_FACTIONS } from "@/lib/factions";
import { POLICIES, PolicyId } from "@/lib/policies";
import { MINISTERS, MinisterId } from "@/lib/ministers";

interface FinanceAnalysisProps {
  game: any;
}

export default function FinanceAnalysis({ game }: FinanceAnalysisProps) {
  if (!game) return null;

  let factions = INITIAL_FACTIONS;
  try { factions = JSON.parse(game.factions); } catch {}
  
  let activeLaws: PolicyId[] = [];
  try { activeLaws = JSON.parse(game.activeLaws); } catch {}
  
  let ministers: Record<string, MinisterId> = {};
  try { ministers = JSON.parse(game.ministers); } catch {}
  
  let eventFlags: string[] = [];
  try { eventFlags = JSON.parse(game.eventFlags); } catch {}

  const capitalistsSupport = factions.capitalists?.support || 50;
  
  const taxIncome = calculateTaxIncome(game.education, game.stability, game.happiness, capitalistsSupport, eventFlags);
  const maintenanceCost = calculateMaintenanceCost(game.military, game.health, game.education, eventFlags, game.budget);

  // Pasif etkileri hesapla
  let lawsCost = 0;
  activeLaws.forEach(lawId => {
    const law = POLICIES[lawId];
    if (law?.passiveEffects?.budget) {
      lawsCost += law.passiveEffects.budget;
    }
  });

  let ministersCost = 0;
  Object.values(ministers).forEach(minId => {
    const min = MINISTERS[minId];
    if (min?.passiveEffects?.budget) {
      ministersCost += min.passiveEffects.budget;
    }
  });

  const totalIncome = taxIncome + (lawsCost > 0 ? lawsCost : 0) + (ministersCost > 0 ? ministersCost : 0);
  const totalExpense = maintenanceCost + (lawsCost < 0 ? Math.abs(lawsCost) : 0) + (ministersCost < 0 ? Math.abs(ministersCost) : 0);
  const netIncome = totalIncome - totalExpense;

  const isPositive = netIncome >= 0;

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="text-lg">📊</span>
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Ekonomik Analiz</h3>
      </div>
      
      <div className="space-y-3">
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700 shadow-inner">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-700/50">
            <span className="text-xs font-semibold text-green-400">Tahmini Gelirler</span>
            <span className="font-bold text-green-400 text-sm">+${totalIncome.toLocaleString()}</span>
          </div>
          <div className="text-[11px] text-slate-400 space-y-1.5">
            <div className="flex justify-between"><span>Vergi Geliri:</span> <span>+${taxIncome.toLocaleString()}</span></div>
            {lawsCost > 0 && <div className="flex justify-between"><span>Yasa Gelirleri:</span> <span>+${lawsCost.toLocaleString()}</span></div>}
            {ministersCost > 0 && <div className="flex justify-between"><span>Bakan Katkısı:</span> <span>+${ministersCost.toLocaleString()}</span></div>}
          </div>
        </div>

        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700 shadow-inner">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-700/50">
            <span className="text-xs font-semibold text-red-400">Tahmini Giderler</span>
            <span className="font-bold text-red-400 text-sm">-${totalExpense.toLocaleString()}</span>
          </div>
          <div className="text-[11px] text-slate-400 space-y-1.5">
            <div className="flex justify-between"><span>Devlet Bakım & Altyapı:</span> <span>-${maintenanceCost.toLocaleString()}</span></div>
            {lawsCost < 0 && <div className="flex justify-between"><span>Yasa Maliyetleri:</span> <span>-${Math.abs(lawsCost).toLocaleString()}</span></div>}
            {ministersCost < 0 && <div className="flex justify-between"><span>Bakan Maliyetleri:</span> <span>-${Math.abs(ministersCost).toLocaleString()}</span></div>}
          </div>
        </div>

        <div className={`p-3 rounded-xl border ${isPositive ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-200">Net Bilanço (Tur Başı)</span>
            <span className={`font-bold text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : '-'}${Math.abs(netIncome).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
