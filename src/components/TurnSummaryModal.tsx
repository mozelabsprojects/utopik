"use client";

import { useEffect, useState } from "react";
import { DominoEffect } from "@/lib/types";
import { AdvisorHint } from "@/lib/advisor";

interface TurnSummaryModalProps {
  isVisible: boolean;
  isDataReady: boolean;
  turnNumber: number;
  taxIncome: number;
  maintenanceCost: number;
  dominoEffects: DominoEffect[];
  reports: string[];
  hints: AdvisorHint[];
  onComplete: () => void;
}

export default function TurnSummaryModal({
  isVisible,
  isDataReady,
  turnNumber,
  taxIncome,
  maintenanceCost,
  dominoEffects,
  reports,
  hints,
  onComplete,
}: TurnSummaryModalProps) {
  const [phase, setPhase] = useState<"loading" | "results" | "hidden">("hidden");

  useEffect(() => {
    if (isVisible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("loading");
    }
  }, [isVisible]);

  useEffect(() => {
    if (phase === "loading" && isDataReady) {
      const timer = setTimeout(() => setPhase("results"), 400); // 1200ms -> 400ms (Oyun akıcılığı için hızlandırıldı)
      return () => clearTimeout(timer);
    }
  }, [phase, isDataReady]);

  if (phase === "hidden") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      {phase === "loading" && (
        <div className="text-center animate-slide-up">
          {/* Spinning gear */}
          <div className="text-6xl mb-4 animate-spin-gear">⚙️</div>
          <h2 className="text-2xl font-[family-name:var(--font-display)] font-bold text-[var(--color-neon-cyan)] mb-2">
            TUR {turnNumber}
          </h2>
          <p className="text-gray-400 text-sm">Hesaplamalar yapılıyor ve raporlar derleniyor...</p>
          {/* Loading bar */}
          <div className="mt-4 w-64 h-1 mx-auto rounded-full overflow-hidden bg-gray-800">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-neon-cyan)] to-[var(--color-neon-blue)] rounded-full"
              style={{
                animation: "loadingBar 0.4s ease-out forwards",
              }}
            />
          </div>
          <style jsx>{`
            @keyframes loadingBar {
              from { width: 0%; }
              to { width: 100%; }
            }
          `}</style>
        </div>
      )}

      {phase === "results" && (
        <div className="glass-strong rounded-2xl w-full max-w-4xl max-h-[85vh] md:max-h-[80vh] flex flex-col overflow-hidden border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.15)] animate-slide-up">
          <div className="p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-cyan-900/40 to-transparent flex justify-between items-center shrink-0">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">📋</span> TUR {turnNumber} KAPSAMLI RAPORU
            </h2>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* SOL SÜTUN: Finansal Durum ve Danışman */}
            <div className="space-y-6">
              {/* Finansal Sonuçlar */}
              <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700">
                <h3 className="text-lg font-bold text-slate-200 mb-3 border-b border-slate-700 pb-2">Ekonomik Bilanço</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">📈 Vergi Geliri</span>
                    <span className="text-sm font-bold text-green-400">
                      +${taxIncome}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">🔧 Bakım Gideri</span>
                    <span className="text-sm font-bold text-red-400">
                      -${maintenanceCost}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                    <span className="text-sm text-gray-300 font-bold">Net Dönem Karı</span>
                    <span className={`text-xl font-bold ${taxIncome - maintenanceCost >= 0 ? "text-green-400 animate-pop-in" : "text-red-400 animate-pop-in"}`}>
                      {taxIncome - maintenanceCost >= 0 ? "+" : ""}${taxIncome - maintenanceCost}
                    </span>
                  </div>
                </div>
              </div>

              {/* Danışman Uyarıları */}
              <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/20 to-transparent rounded-bl-full pointer-events-none"></div>
                <h3 className="text-lg font-bold text-slate-200 mb-3 border-b border-slate-700 pb-2 flex items-center gap-2">
                  <span>💡</span> Danışman Görüşü
                </h3>
                <div className="space-y-2">
                  {hints.length > 0 ? (
                    hints.map((hint, i) => (
                      <div key={i} className={`p-3 rounded-lg text-sm border ${
                        hint.type === 'danger' ? 'bg-red-500/10 border-red-500/20 text-red-200' :
                        hint.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-200' :
                        hint.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-200' :
                        'bg-blue-500/10 border-blue-500/20 text-blue-200'
                      }`}>
                        {hint.type === 'danger' && '🚨 '}
                        {hint.type === 'warning' && '⚠️ '}
                        {hint.type === 'success' && '✨ '}
                        {hint.type === 'info' && 'ℹ️ '}
                        {hint.text}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 italic">Danışmanların şu an için bir uyarısı bulunmuyor.</p>
                  )}
                </div>
              </div>
            </div>

            {/* SAĞ SÜTUN: Domino ve Siyasi Raporlar */}
            <div className="space-y-6">
              {dominoEffects.length > 0 && (
                <div className="bg-slate-900/50 p-5 rounded-xl border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                  <h3 className="text-lg font-bold text-yellow-500 mb-3 border-b border-yellow-500/30 pb-2 flex items-center gap-2">
                    <span>⚡</span> Domino Etkileri
                  </h3>
                  <div className="space-y-2">
                    {dominoEffects.map((effect, i) => (
                      <div key={i} className="text-sm text-gray-300 py-1 animate-slide-in">
                        {effect.description}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700 flex-1">
                <h3 className="text-lg font-bold text-slate-200 mb-3 border-b border-slate-700 pb-2">Olaylar ve Gelişmeler</h3>
                <div className="space-y-3">
                  {reports && reports.length > 0 ? (
                    reports.map((report, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-xl border whitespace-pre-line text-sm ${
                          report.includes("⚠️") || report.includes("🚨") || report.includes("☠️") || report.includes("📉") 
                            ? "bg-red-500/10 border-red-500/20 text-red-100" 
                            : report.includes("✅") || report.includes("💰") 
                            ? "bg-green-500/10 border-green-500/20 text-green-100"
                            : "bg-white/5 border-white/10 text-gray-300"
                        }`}
                      >
                        {report}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic text-center py-4">Kayıda değer önemli bir gelişme yaşanmadı.</p>
                  )}
                </div>
              </div>
            </div>

          </div>

          <div className="p-4 sm:p-6 border-t border-white/10 bg-black/40 shrink-0">
            <button 
              onClick={() => {
                setPhase("hidden");
                onComplete();
              }}
              className="w-full btn-primary py-3 text-lg font-bold tracking-wide transition-transform hover:scale-[1.02] active:scale-95"
            >
              Raporu Onayla ve Devam Et
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
