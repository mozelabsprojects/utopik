"use client";

import { useEffect, useState } from "react";
import { DominoEffect } from "@/lib/types";

interface TurnTransitionProps {
  isVisible: boolean;
  isDataReady: boolean;
  turnNumber: number;
  taxIncome: number;
  maintenanceCost: number;
  dominoEffects: DominoEffect[];
  onComplete: () => void;
}

export default function TurnTransition({
  isVisible,
  isDataReady,
  turnNumber,
  taxIncome,
  maintenanceCost,
  dominoEffects,
  onComplete,
}: TurnTransitionProps) {
  const [phase, setPhase] = useState<"loading" | "results" | "hidden">("hidden");

  useEffect(() => {
    if (isVisible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("loading");
    }
  }, [isVisible]);

  useEffect(() => {
    if (phase === "loading" && isDataReady) {
      const timer = setTimeout(() => setPhase("results"), 400); // Hızlandırıldı (1200 -> 400)
      return () => clearTimeout(timer);
    }
  }, [phase, isDataReady]);

  useEffect(() => {
    if (phase === "results") {
      const timer = setTimeout(() => {
        setPhase("hidden");
        onComplete();
      }, 1500); // Hızlandırıldı (3500 -> 1500)
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  if (phase === "hidden") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      {phase === "loading" && (
        <div className="text-center animate-slide-up">
          {/* Spinning gear */}
          <div className="text-6xl mb-4 animate-spin-gear">⚙️</div>
          <h2 className="text-2xl font-[family-name:var(--font-display)] font-bold text-[var(--color-neon-cyan)] mb-2">
            TUR {turnNumber}
          </h2>
          <p className="text-gray-400 text-sm">Hesaplamalar yapılıyor...</p>
          {/* Loading bar */}
          <div className="mt-4 w-64 h-1 mx-auto rounded-full overflow-hidden bg-gray-800">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-neon-cyan)] to-[var(--color-neon-blue)] rounded-full"
              style={{
                animation: "loadingBar 1.5s ease-out forwards",
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
        <div className={`glass-strong rounded-2xl p-8 max-w-md w-full mx-4 animate-slide-up ${
          taxIncome - maintenanceCost < 0 || dominoEffects.some(e => e.description.includes("DÜŞÜYOR") || e.description.includes("AZALIYOR"))
            ? "animate-shake"
            : "animate-juice-bounce"
        }`}>
          <h2 className="text-xl font-[family-name:var(--font-display)] font-bold text-[var(--color-neon-cyan)] mb-4 text-center">
            TUR {turnNumber} SONUÇLARI
          </h2>

          <div className="space-y-3 mb-4">
            {/* Tax income */}
            <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
              <span className="text-sm text-gray-300">📈 Vergi Geliri</span>
              <span className="text-sm font-bold text-green-400">
                +${taxIncome}
              </span>
            </div>

            {/* Maintenance */}
            <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
              <span className="text-sm text-gray-300">🔧 Bakım Gideri</span>
              <span className="text-sm font-bold text-red-400">
                -${maintenanceCost}
              </span>
            </div>

            {/* Net */}
            <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
              <span className="text-sm text-gray-300 font-bold">Net</span>
              <span
                className={`text-xl font-bold ${
                  taxIncome - maintenanceCost >= 0
                    ? "text-green-400 animate-pop-in"
                    : "text-red-400 animate-pop-in"
                }`}
              >
                {taxIncome - maintenanceCost >= 0 ? "+" : ""}$
                {taxIncome - maintenanceCost}
              </span>
            </div>

            {/* Domino effects */}
            {dominoEffects.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-bold text-yellow-400 mb-2 uppercase tracking-wider">
                  Domino Etkileri
                </p>
                {dominoEffects.map((effect, i) => (
                  <div
                    key={i}
                    className="text-xs text-gray-300 py-1 animate-slide-in"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  >
                    {effect.description}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setPhase("hidden");
              onComplete();
            }}
            className="w-full btn-primary text-center text-sm"
          >
            Devam Et
          </button>
        </div>
      )}
    </div>
  );
}
