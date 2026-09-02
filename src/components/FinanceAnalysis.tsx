"use client";

import React from "react";
import { GameState } from "@/lib/types";
import { getDetailedTaxIncome, getDetailedMaintenanceCost, calculateNetBudget, BudgetBreakdown } from "@/lib/game-engine";
import { INITIAL_FACTIONS } from "@/lib/factions";
import { COUNTRIES } from "@/lib/countries-data";

interface FinanceAnalysisProps {
  game: GameState;
}

export default function FinanceAnalysis({ game }: FinanceAnalysisProps) {
  let factions = INITIAL_FACTIONS;
  try { factions = JSON.parse(game.factions); } catch {}
  
  let activeLaws: string[] = [];
  try { activeLaws = JSON.parse(game.activeLaws || "[]"); } catch {}

  let unlockedTechs: string[] = [];
  try { unlockedTechs = JSON.parse(game.unlockedTechs || "[]"); } catch {}

  let ministers: Record<string, string> = {};
  try { ministers = JSON.parse(game.ministers || "{}"); } catch {}

  let activeCrises: string[] = [];
  try { activeCrises = JSON.parse(game.activeCrises || "[]"); } catch {}

  let eventFlags: string[] = [];
  try { eventFlags = JSON.parse(game.eventFlags || "[]"); } catch {}

  const countryTemplate = COUNTRIES.find(c => c.name === game.countryName);
  const difficulty = countryTemplate?.difficulty || "Orta";
  const currentInflation = game.inflation || 5.0;

  // 1) Temel Vergi ve Bakım Detayları (Ayrıntılı Görünüm İçin)
  const taxDetails = getDetailedTaxIncome(
    game.education, game.health, game.environment, game.military, 
    game.stability, game.happiness, factions.capitalists?.support || 50, 
    eventFlags, difficulty, currentInflation, game.population
  );

  const maintDetails = getDetailedMaintenanceCost(
    game.military, game.health, game.education, game.environment, 
    game.stability, eventFlags, game.budget, difficulty, unlockedTechs, currentInflation, game.population
  );

  // 2) KESİN NET BÜTÇE (calculateNetBudget ile)
  const budgetBreakdown: BudgetBreakdown = calculateNetBudget(
    game, factions, activeLaws, unlockedTechs, ministers, activeCrises, eventFlags
  );

  const totalIncome = budgetBreakdown.tax 
    + (budgetBreakdown.laws > 0 ? budgetBreakdown.laws : 0) 
    + (budgetBreakdown.techs > 0 ? budgetBreakdown.techs : 0)
    + (budgetBreakdown.ministers > 0 ? budgetBreakdown.ministers : 0)
    + (budgetBreakdown.special > 0 ? budgetBreakdown.special : 0);

  const totalExpense = budgetBreakdown.maintenance 
    + (budgetBreakdown.laws < 0 ? Math.abs(budgetBreakdown.laws) : 0)
    + (budgetBreakdown.techs < 0 ? Math.abs(budgetBreakdown.techs) : 0)
    + (budgetBreakdown.ministers < 0 ? Math.abs(budgetBreakdown.ministers) : 0)
    + (budgetBreakdown.crises < 0 ? Math.abs(budgetBreakdown.crises) : 0)
    + (budgetBreakdown.special < 0 ? Math.abs(budgetBreakdown.special) : 0);

  const netIncome = budgetBreakdown.totalNet;
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
            <div className="flex justify-between items-center group relative cursor-help">
              <span className="flex items-center gap-1">Temel Vergi (Base) <span className="text-[9px] opacity-50">ℹ️</span></span> 
              <span>+${taxDetails.baseIncome.toLocaleString()}</span>
              <div className="hidden group-hover:block absolute left-0 bottom-full mb-1 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg border border-slate-600 shadow-xl z-10">
                <p className="font-bold mb-1 text-green-300">Neden Kazanıyorum?</p>
                <p>Ülkenizin temel geliridir. Nüfusun günlük ticari faaliyetlerinden toplanır.</p>
              </div>
            </div>

            {taxDetails.educationBonus > 0 && 
            <div className="flex justify-between items-center text-green-300 group relative cursor-help">
              <span className="flex items-center gap-1">Eğitim Seviyesi Bonusu <span className="text-[9px] opacity-50">ℹ️</span></span> 
              <span>+${taxDetails.educationBonus.toLocaleString()}</span>
              <div className="hidden group-hover:block absolute left-0 bottom-full mb-1 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg border border-slate-600 shadow-xl z-10">
                <p className="font-bold mb-1 text-green-300">Neden Kazanıyorum?</p>
                <p>Yüksek eğitim seviyesi inovasyon ve teknolojik ihracatı artırır. <b>Nasıl Artırılır:</b> Eğitimi yükselt.</p>
              </div>
            </div>}
            
            {taxDetails.healthBonus > 0 && 
            <div className="flex justify-between items-center text-green-300 group relative cursor-help">
              <span className="flex items-center gap-1">Sağlıklı İşgücü Bonusu <span className="text-[9px] opacity-50">ℹ️</span></span> 
              <span>+${taxDetails.healthBonus.toLocaleString()}</span>
              <div className="hidden group-hover:block absolute left-0 bottom-full mb-1 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg border border-slate-600 shadow-xl z-10">
                <p className="font-bold mb-1 text-green-300">Neden Kazanıyorum?</p>
                <p>Halk sağlıklı olduğunda iş gücü verimliliği artar. <b>Nasıl Artırılır:</b> Sağlığı yükselt.</p>
              </div>
            </div>}

            {taxDetails.environmentBonus > 0 && 
            <div className="flex justify-between items-center text-green-300 group relative cursor-help">
              <span className="flex items-center gap-1">Yeşil Ekonomi / Turizm <span className="text-[9px] opacity-50">ℹ️</span></span> 
              <span>+${taxDetails.environmentBonus.toLocaleString()}</span>
              <div className="hidden group-hover:block absolute left-0 bottom-full mb-1 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg border border-slate-600 shadow-xl z-10">
                <p className="font-bold mb-1 text-green-300">Neden Kazanıyorum?</p>
                <p>Doğa korundukça eko-turizm ve yenilenebilir enerji gelirleri artar. <b>Nasıl Artırılır:</b> Çevreyi koru.</p>
              </div>
            </div>}

            {taxDetails.militaryBonus > 0 && 
            <div className="flex justify-between items-center text-green-300 group relative cursor-help">
              <span className="flex items-center gap-1">Silah İhracatı Bonusu <span className="text-[9px] opacity-50">ℹ️</span></span> 
              <span>+${taxDetails.militaryBonus.toLocaleString()}</span>
              <div className="hidden group-hover:block absolute left-0 bottom-full mb-1 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg border border-slate-600 shadow-xl z-10">
                <p className="font-bold mb-1 text-green-300">Neden Kazanıyorum?</p>
                <p>Güçlü ordu, savunma sanayii ihracatını tetikler. <b>Nasıl Artırılır:</b> Askeriyeyi güçlendir.</p>
              </div>
            </div>}
            
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
            
            {budgetBreakdown.laws > 0 && <div className="flex justify-between text-cyan-300 mt-2 pt-1 border-t border-slate-800"><span>Aktif Yasalar (Pasif Gelir):</span> <span>+${budgetBreakdown.laws.toLocaleString()}</span></div>}
            {budgetBreakdown.ministers > 0 && <div className="flex justify-between text-purple-300"><span>Bakan Katkısı:</span> <span>+${budgetBreakdown.ministers.toLocaleString()}</span></div>}
          </div>
        </div>

        {/* GİDERLER */}
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700 shadow-inner">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-700/50">
            <span className="text-xs font-semibold text-red-400">Tur Başı Giderler</span>
            <span className="font-bold text-red-400 text-sm">-${totalExpense.toLocaleString()}</span>
          </div>
          <div className="text-[11px] text-slate-400 space-y-1.5">
            <div className="flex justify-between items-center group relative cursor-help">
              <span className="flex items-center gap-1">Askeriye & Savunma <span className="text-[9px] opacity-50">ℹ️</span></span> 
              <span>-${maintDetails.militaryCost.toLocaleString()}</span>
              <div className="hidden group-hover:block absolute right-0 bottom-full mb-1 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg border border-slate-600 shadow-xl z-10">
                <p className="font-bold mb-1 text-red-300">Neden Ödüyorum?</p>
                <p>Askeri personelin maaşları ve mühimmat maliyetidir. Ordu büyüdükçe katlanarak artar.</p>
              </div>
            </div>

            <div className="flex justify-between items-center group relative cursor-help">
              <span className="flex items-center gap-1">Sağlık & Altyapı <span className="text-[9px] opacity-50">ℹ️</span></span> 
              <span>-${maintDetails.healthCost.toLocaleString()}</span>
              <div className="hidden group-hover:block absolute right-0 bottom-full mb-1 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg border border-slate-600 shadow-xl z-10">
                <p className="font-bold mb-1 text-red-300">Neden Ödüyorum?</p>
                <p>Hastaneler ve kamu sağlığının korunması maliyetidir.</p>
              </div>
            </div>

            <div className="flex justify-between items-center group relative cursor-help">
              <span className="flex items-center gap-1">Eğitim Sistemi <span className="text-[9px] opacity-50">ℹ️</span></span> 
              <span>-${maintDetails.educationCost.toLocaleString()}</span>
              <div className="hidden group-hover:block absolute right-0 bottom-full mb-1 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg border border-slate-600 shadow-xl z-10">
                <p className="font-bold mb-1 text-red-300">Neden Ödüyorum?</p>
                <p>Okullar ve akademilerin bakım maliyetidir.</p>
              </div>
            </div>

            {maintDetails.environmentCost > 0 && 
            <div className="flex justify-between items-center group relative cursor-help">
              <span className="flex items-center gap-1">Çevre Koruması <span className="text-[9px] opacity-50">ℹ️</span></span> 
              <span>-${maintDetails.environmentCost.toLocaleString()}</span>
              <div className="hidden group-hover:block absolute right-0 bottom-full mb-1 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg border border-slate-600 shadow-xl z-10">
                <p className="font-bold mb-1 text-red-300">Neden Ödüyorum?</p>
                <p>Doğal parkların ve yeşil projelerin devlete olan yüküdür.</p>
              </div>
            </div>}
            
            {maintDetails.sickPenalty > 0 && 
            <div className="flex justify-between items-center text-red-300 group relative cursor-help">
              <span className="flex items-center gap-1">Salgın/Hastalık Ek Gideri <span className="text-[9px] opacity-50">ℹ️</span></span> 
              <span>-${maintDetails.sickPenalty.toLocaleString()}</span>
              <div className="hidden group-hover:block absolute right-0 bottom-full mb-1 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg border border-slate-600 shadow-xl z-10">
                <p className="font-bold mb-1 text-red-300">Neden Ödüyorum?</p>
                <p>Ülkede salgın hastalık olduğu için acil müdahale fonları tüketiliyor. <b>Nasıl Çözülür:</b> Sağlığı artırarak salgını bitirin.</p>
              </div>
            </div>}

            {maintDetails.corruptionPenalty > 0 && 
            <div className="flex justify-between items-center text-orange-300 group relative cursor-help">
              <span className="flex items-center gap-1">Yolsuzluk (Bürokratik Kayıp) <span className="text-[9px] opacity-50">ℹ️</span></span> 
              <span>-${maintDetails.corruptionPenalty.toLocaleString()}</span>
              <div className="hidden group-hover:block absolute right-0 bottom-full mb-1 w-56 p-2 bg-slate-800 text-white text-[10px] rounded-lg border border-slate-600 shadow-xl z-10">
                <p className="font-bold mb-1 text-red-300">Neden Ödüyorum?</p>
                <p>İstikrar seviyesi (Stability) çok düşük olduğu için devlet görevlileri kasadaki parayı hortumluyor. Hukuksuzluk hakim.</p>
                <p className="font-bold mt-1 text-green-300">Nasıl Çözülür?</p>
                <p>Ülkedeki İstikrarı (Stability) 50&apos;nin üzerine çıkarın, yolsuzluk tamamen bitecektir.</p>
              </div>
            </div>}

            {maintDetails.difficultyMultiplier !== 1 && (
              <div className="flex justify-between text-indigo-300">
                <span>Zorluk Çarpanı ({difficulty}):</span> 
                <span>x{maintDetails.difficultyMultiplier}</span>
              </div>
            )}

            {maintDetails.leaderDiscount > 0 && <div className="flex justify-between text-green-300 mt-1 pt-1 border-t border-slate-800"><span>Lider İndirimi (General):</span> <span>+${maintDetails.leaderDiscount.toLocaleString()} (Tasarruf)</span></div>}
            
            {budgetBreakdown.laws < 0 && <div className="flex justify-between text-red-300 mt-1 pt-1 border-t border-slate-800"><span>Aktif Yasa Maliyetleri:</span> <span>-${Math.abs(budgetBreakdown.laws).toLocaleString()}</span></div>}
            {budgetBreakdown.ministers < 0 && <div className="flex justify-between text-red-300"><span>Bakan Maaşları ve Bütçesi:</span> <span>-${Math.abs(budgetBreakdown.ministers).toLocaleString()}</span></div>}
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
