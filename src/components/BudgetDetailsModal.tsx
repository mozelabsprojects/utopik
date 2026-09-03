"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BudgetBreakdown } from "@/lib/game-engine";

interface BudgetDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetBreakdown: BudgetBreakdown | null;
  netIncome: number;
  projectedInvestments?: Record<string, number>;
}

export default function BudgetDetailsModal({ isOpen, onClose, budgetBreakdown, netIncome, projectedInvestments = {} }: BudgetDetailsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const totalInvestments = Object.values(projectedInvestments).reduce((a, b) => a + b, 0);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-premium border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl">📈</div>
              <div>
                <h2 className="text-2xl font-black font-[family-name:var(--font-display)] text-white uppercase tracking-widest">
                  Net Bütçe Dağılımı
                </h2>
                <div className={`text-sm font-bold uppercase tracking-widest ${netIncome >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  Durum: {netIncome >= 0 ? 'Kârda' : 'Açık Veriyor'}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/5 space-y-3">
              {budgetBreakdown && (
                <>
                  <div className="flex justify-between items-center text-green-400">
                    <span className="flex items-center gap-2">💰 Vergiler</span>
                    <span>+${budgetBreakdown.tax.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-px bg-white/5" />
                  
                  <div className="flex justify-between items-center text-red-400">
                    <span className="flex items-center gap-2">🏛️ Kamu Masrafları</span>
                    <span>-${budgetBreakdown.maintenance.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-px bg-white/5" />
                  
                  {budgetBreakdown.laws !== 0 && (
                    <>
                      <div className={`flex justify-between items-center ${budgetBreakdown.laws > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        <span className="flex items-center gap-2">📜 Yasalar</span>
                        <span>{budgetBreakdown.laws > 0 ? '+' : '-'}${Math.abs(budgetBreakdown.laws).toLocaleString()}</span>
                      </div>
                      <div className="w-full h-px bg-white/5" />
                    </>
                  )}
                  
                  {budgetBreakdown.techs !== 0 && (
                    <>
                      <div className={`flex justify-between items-center ${budgetBreakdown.techs > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        <span className="flex items-center gap-2">🔬 Teknolojiler</span>
                        <span>{budgetBreakdown.techs > 0 ? '+' : '-'}${Math.abs(budgetBreakdown.techs).toLocaleString()}</span>
                      </div>
                      <div className="w-full h-px bg-white/5" />
                    </>
                  )}
                  
                  {budgetBreakdown.ministers !== 0 && (
                    <>
                      <div className={`flex justify-between items-center ${budgetBreakdown.ministers > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        <span className="flex items-center gap-2">👔 Bakanlar</span>
                        <span>{budgetBreakdown.ministers > 0 ? '+' : '-'}${Math.abs(budgetBreakdown.ministers).toLocaleString()}</span>
                      </div>
                      <div className="w-full h-px bg-white/5" />
                    </>
                  )}
                  
                  {budgetBreakdown.crises !== 0 && (
                    <>
                      <div className="flex justify-between items-center text-red-400">
                        <span className="flex items-center gap-2">🚨 Aktif Krizler</span>
                        <span>-${Math.abs(budgetBreakdown.crises).toLocaleString()}</span>
                      </div>
                      <div className="w-full h-px bg-white/5" />
                    </>
                  )}
                  
                  {budgetBreakdown.special !== 0 && (
                    <>
                      <div className="flex justify-between items-center text-purple-400">
                        <span className="flex items-center gap-2">⭐ Ülkeye Özel Bonuslar</span>
                        <span>+${budgetBreakdown.special.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-px bg-white/5" />
                    </>
                  )}
                  
                  <div className="flex justify-between items-center font-bold text-white pt-2">
                    <span>Toplam Net (Tur Başına)</span>
                    <span className={netIncome >= 0 ? "text-green-400" : "text-red-400"}>
                      {netIncome > 0 ? "+" : ""}${netIncome.toLocaleString()}
                    </span>
                  </div>
                </>
              )}
            </div>

            {totalInvestments > 0 && (
              <div className="bg-slate-900/50 p-5 rounded-2xl border border-[var(--color-accent-primary)] mt-6">
                <h3 className="text-[var(--color-accent-primary)] font-bold uppercase tracking-wider mb-3 text-sm">
                  Aktif Tur Yatırımları
                </h3>
                <div className="space-y-2">
                  {Object.entries(projectedInvestments).map(([sector, amount]) => (
                    <div key={sector} className="flex justify-between items-center text-sm text-slate-300">
                      <span>{sector.charAt(0).toUpperCase() + sector.slice(1)} Yatırımı</span>
                      <span className="text-yellow-400 font-bold">-${amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="w-full h-px bg-white/10 my-2" />
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-white text-sm">Toplam Yatırım Gideri (Bu Tur)</span>
                    <span className="text-yellow-400">-${totalInvestments.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-6 p-4 bg-black/40 rounded-xl border border-white/5 text-xs text-slate-400">
              <p>💡 <strong>İpucu:</strong> Eğer net bütçe eksideyse iflas edebilirsiniz. İflas etmemek için harcamaları kısın veya vergi oranını artıracak yasalar geçirin.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
