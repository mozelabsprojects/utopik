"use client";

import { getDetailedTaxIncome, getDetailedMaintenanceCost } from "@/lib/game-engine";
import { INITIAL_FACTIONS } from "@/lib/factions";
import { COUNTRIES } from "@/lib/countries-data";
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

  const countryTemplate = COUNTRIES.find(c => c.name === game.countryName);
  const difficulty = countryTemplate?.difficulty || "Orta";

  const capitalistsSupport = factions.capitalists?.support || 50;
  
  const taxDetails = getDetailedTaxIncome(
    game.education,
    game.health,
    game.environment,
    game.military,
    game.stability,
    game.happiness,
    capitalistsSupport,
    eventFlags,
    difficulty
  );
  const maintDetails = getDetailedMaintenanceCost(
    game.military,
    game.health,
    game.education,
    game.environment,
    eventFlags,
    game.budget,
    difficulty
  );

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

  const totalIncome = taxDetails.total + (lawsCost > 0 ? lawsCost : 0) + (ministersCost > 0 ? ministersCost : 0);
  const totalExpense = maintDetails.total + (lawsCost < 0 ? Math.abs(lawsCost) : 0) + (ministersCost < 0 ? Math.abs(ministersCost) : 0);
  const netIncome = totalIncome - totalExpense;

  const isPositive = netIncome >= 0;

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="text-lg">📊</span>
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Detaylı Ekonomik Bilanço</h3>
      </div>
      
      <div className="space-y-3">
        {/* GELİRLER */}
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700 shadow-inner">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-700/50">
            <span className="text-xs font-semibold text-green-400">Tur Başı Gelirler</span>
            <span className="font-bold text-green-400 text-sm">+${totalIncome.toLocaleString()}</span>
          </div>
          <div className="text-[11px] text-slate-400 space-y-1.5">
            <div className="flex justify-between"><span>Temel Vergi (Base):</span> <span>+${taxDetails.baseIncome.toLocaleString()}</span></div>
            {taxDetails.educationBonus > 0 && <div className="flex justify-between text-green-300"><span>Eğitim Seviyesi Bonusu:</span> <span>+${taxDetails.educationBonus.toLocaleString()}</span></div>}
            {taxDetails.healthBonus > 0 && <div className="flex justify-between text-green-300"><span>Sağlıklı İşgücü Bonusu:</span> <span>+${taxDetails.healthBonus.toLocaleString()}</span></div>}
            {taxDetails.environmentBonus > 0 && <div className="flex justify-between text-green-300"><span>Yeşil Ekonomi / Turizm:</span> <span>+${taxDetails.environmentBonus.toLocaleString()}</span></div>}
            {taxDetails.militaryBonus > 0 && <div className="flex justify-between text-green-300"><span>Silah İhracatı Bonusu:</span> <span>+${taxDetails.militaryBonus.toLocaleString()}</span></div>}
            
            <div className="flex justify-between mt-1 pt-1 border-t border-slate-800">
              <span>Mutluluk/İstikrar/Sermaye Çarpanı:</span> 
              <span className={taxDetails.multipliersCombined >= 1 ? "text-green-300" : "text-red-300"}>x{taxDetails.multipliersCombined}</span>
            </div>
            
            {taxDetails.difficultyMultiplier !== 1 && (
              <div className="flex justify-between text-indigo-300">
                <span>Zorluk Çarpanı ({difficulty}):</span> 
                <span>x{taxDetails.difficultyMultiplier}</span>
              </div>
            )}

            {taxDetails.leaderBonus > 0 && <div className="flex justify-between text-yellow-300"><span>Lider Bonusu (Ekonomist):</span> <span>+${taxDetails.leaderBonus.toLocaleString()}</span></div>}
            
            {lawsCost > 0 && <div className="flex justify-between text-cyan-300 mt-2 pt-1 border-t border-slate-800"><span>Aktif Yasalar (Pasif Gelir):</span> <span>+${lawsCost.toLocaleString()}</span></div>}
            {ministersCost > 0 && <div className="flex justify-between text-purple-300"><span>Bakan Katkısı:</span> <span>+${ministersCost.toLocaleString()}</span></div>}
          </div>
        </div>

        {/* GİDERLER */}
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700 shadow-inner">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-700/50">
            <span className="text-xs font-semibold text-red-400">Tur Başı Giderler</span>
            <span className="font-bold text-red-400 text-sm">-${totalExpense.toLocaleString()}</span>
          </div>
          <div className="text-[11px] text-slate-400 space-y-1.5">
            <div className="flex justify-between"><span>Askeriye & Savunma:</span> <span>-${maintDetails.militaryCost.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Sağlık & Altyapı:</span> <span>-${maintDetails.healthCost.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Eğitim Sistemi:</span> <span>-${maintDetails.educationCost.toLocaleString()}</span></div>
            {maintDetails.environmentCost > 0 && <div className="flex justify-between"><span>Çevre Koruması:</span> <span>-${maintDetails.environmentCost.toLocaleString()}</span></div>}
            
            {maintDetails.sickPenalty > 0 && <div className="flex justify-between text-red-300"><span>Salgın/Hastalık Ek Gideri:</span> <span>-${maintDetails.sickPenalty.toLocaleString()}</span></div>}
            {maintDetails.corruptionPenalty > 0 && <div className="flex justify-between text-orange-300"><span>Bürokrasi ve Yolsuzluk (Kasa Doluysa):</span> <span>-${maintDetails.corruptionPenalty.toLocaleString()}</span></div>}

            {maintDetails.difficultyMultiplier !== 1 && (
              <div className="flex justify-between text-indigo-300">
                <span>Zorluk Çarpanı ({difficulty}):</span> 
                <span>x{maintDetails.difficultyMultiplier}</span>
              </div>
            )}

            {maintDetails.leaderDiscount > 0 && <div className="flex justify-between text-green-300 mt-1 pt-1 border-t border-slate-800"><span>Lider İndirimi (General):</span> <span>+${maintDetails.leaderDiscount.toLocaleString()} (Tasarruf)</span></div>}
            
            {lawsCost < 0 && <div className="flex justify-between text-red-300 mt-1 pt-1 border-t border-slate-800"><span>Aktif Yasa Maliyetleri:</span> <span>-${Math.abs(lawsCost).toLocaleString()}</span></div>}
            {ministersCost < 0 && <div className="flex justify-between text-red-300"><span>Bakan Maaşları ve Bütçesi:</span> <span>-${Math.abs(ministersCost).toLocaleString()}</span></div>}
          </div>
        </div>

        {/* NET BİLANÇO */}
        <div className={`p-3 rounded-xl border shadow-[0_0_15px_rgba(0,0,0,0.5)] ${isPositive ? 'bg-green-900/30 border-green-500/50' : 'bg-red-900/30 border-red-500/50'}`}>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-100 uppercase tracking-widest">Net Bilanço (Tur Başı)</span>
            <span className={`font-black text-lg ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : '-'}${Math.abs(netIncome).toLocaleString()}
            </span>
          </div>
          {!isPositive && (
            <p className="text-[10px] text-red-300 mt-1 italic leading-tight">
              Kasanızdaki toplam paradan her tur bu tutar düşecek. Eksiye inmemek için giderleri kısın veya vergiyi artırın.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
