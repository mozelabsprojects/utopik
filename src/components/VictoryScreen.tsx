"use client";

import React, { useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { GameState } from "@/lib/types";

interface GameData extends GameState {
  countryName: string;
}

interface VictoryScreenProps {
  game: GameData;
  onRestart: () => void;
}

export default function VictoryScreen({ game, onRestart }: VictoryScreenProps) {
  // Skor hesaplamaları
  const scores = useMemo(() => {
    const popScore = Math.floor((game.population || 10) * 1000);
    const ecoScore = Math.floor(Math.max(0, game.budget) / 100);
    const statSum = (game.happiness || 50) + (game.stability || 50) + (game.health || 50) + (game.education || 50) + (game.environment || 50);
    const utopiaScore = Math.floor(statSum * 50);
    const total = popScore + ecoScore + utopiaScore;

    let tier = "C";
    let title = "Sıradan Bir Devlet";
    let color = "text-gray-400";
    let glow = "shadow-gray-500/50";

    if (total > 200000) {
      tier = "S+";
      title = "Gezegenin Efendisi";
      color = "text-purple-400";
      glow = "shadow-purple-500/50";
    } else if (total > 100000) {
      tier = "S";
      title = "Kusursuz Ütopya";
      color = "text-yellow-400";
      glow = "shadow-yellow-500/50";
    } else if (total > 75000) {
      tier = "A";
      title = "Küresel Süper Güç";
      color = "text-cyan-400";
      glow = "shadow-cyan-500/50";
    } else if (total > 40000) {
      tier = "B";
      title = "Gelişmiş Ulus";
      color = "text-green-400";
      glow = "shadow-green-500/50";
    }

    return { popScore, ecoScore, utopiaScore, total, tier, title, color, glow };
  }, [game]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.5 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 overflow-hidden">
      {/* Arka plan parlama efekti */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 0.15, scale: 1 }} 
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500 via-slate-900 to-black"
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 glass-premium border border-yellow-500/30 p-8 md:p-12 rounded-3xl max-w-2xl w-full mx-4 shadow-[0_0_50px_rgba(234,179,8,0.15)] flex flex-col items-center text-center"
      >
        <motion.div variants={itemVariants} className="mb-4">
          <span className="text-6xl md:text-8xl drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">🏛️</span>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-[family-name:var(--font-display)] font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 mb-2 uppercase tracking-widest">
          Ütopya Kuruldu
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-slate-300 mb-8 max-w-lg mx-auto leading-relaxed">
          Tebrikler Başkan! <strong>{game.countryName}</strong>, {game.turn}. Turda bilim, ekonomi ve sosyal adaleti en üst seviyeye çıkararak insanlık tarihinin zirvesine ulaştı. Yeni çağın lideri sizsiniz.
        </motion.p>

        {/* Skor Tablosu */}
        <motion.div variants={itemVariants} className="w-full bg-slate-900/60 rounded-2xl p-6 border border-white/5 mb-8">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Başarı Dökümü</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm md:text-base">
              <span className="text-slate-300 flex items-center gap-2">👥 Nüfus Skoru</span>
              <span className="font-[family-name:var(--font-display)] font-bold text-white">{scores.popScore.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm md:text-base">
              <span className="text-slate-300 flex items-center gap-2">💰 Ekonomi Skoru</span>
              <span className="font-[family-name:var(--font-display)] font-bold text-white">{scores.ecoScore.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm md:text-base">
              <span className="text-slate-300 flex items-center gap-2">✨ Ütopya (Refah) Skoru</span>
              <span className="font-[family-name:var(--font-display)] font-bold text-white">{scores.utopiaScore.toLocaleString()}</span>
            </div>
            
            <div className="pt-3 mt-3 border-t border-white/10 flex justify-between items-center">
              <span className="text-yellow-500 font-bold uppercase tracking-wider">Toplam Skor</span>
              <span className="font-[family-name:var(--font-display)] text-2xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                {scores.total.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Rank / Tier */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          className={`flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-white/10 mb-8 shadow-lg ${scores.glow}`}
        >
          <div className={`w-16 h-16 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center font-[family-name:var(--font-display)] text-4xl font-black ${scores.color}`}>
            {scores.tier}
          </div>
          <div className="text-left">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Nihai Derece</div>
            <div className={`text-xl md:text-2xl font-bold ${scores.color}`}>{scores.title}</div>
          </div>
        </motion.div>

        <motion.button
          variants={itemVariants}
          onClick={onRestart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-black font-bold uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-slate-200 transition-colors w-full md:w-auto"
        >
          Ana Menüye Dön
        </motion.button>
      </motion.div>
    </div>
  );
}
