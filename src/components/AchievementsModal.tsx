"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ACHIEVEMENTS_DATA } from "@/lib/game-engine";

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedIdsStr?: string;
}

export default function AchievementsModal({ isOpen, onClose, unlockedIdsStr }: AchievementsModalProps) {
  const unlockedIds: string[] = useMemo(() => {
    try {
      return JSON.parse(unlockedIdsStr || "[]");
    } catch {
      return [];
    }
  }, [unlockedIdsStr]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-premium border border-yellow-500/30 rounded-2xl p-6 max-w-2xl w-full shadow-[0_0_50px_rgba(234,179,8,0.15)] relative max-h-[80vh] flex flex-col"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>
            <h2 className="text-3xl font-[family-name:var(--font-display)] text-white mb-2 flex items-center gap-3">
              <span className="text-yellow-400">🏆</span> Zafer Karnesi
            </h2>
            <p className="text-sm text-slate-400 mb-6 border-b border-white/10 pb-4">
              Ülke yönetiminde gösterdiğiniz üstün başarılar tarihe altın harflerle kazındı.
            </p>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
              {ACHIEVEMENTS_DATA.map((achievement) => {
                const isUnlocked = unlockedIds.includes(achievement.id);
                return (
                  <div
                    key={achievement.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                      isUnlocked
                        ? "bg-yellow-500/10 border-yellow-500/30 shadow-[inset_0_0_20px_rgba(234,179,8,0.05)]"
                        : "bg-slate-900/50 border-white/5 opacity-50 grayscale"
                    }`}
                  >
                    <div className="text-4xl shrink-0 p-2 bg-black/40 rounded-lg border border-white/5">
                      {isUnlocked ? achievement.icon : "🔒"}
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${isUnlocked ? "text-yellow-400" : "text-slate-500"}`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-sm mt-1 ${isUnlocked ? "text-slate-300" : "text-slate-600"}`}>
                        {achievement.description}
                      </p>
                      {isUnlocked && (
                        <div className="mt-2 text-xs font-bold text-yellow-500/70 uppercase tracking-wider">
                          ✓ Kazanıldı
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-yellow-500 text-slate-950 font-bold hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.4)]"
              >
                Kapat
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
