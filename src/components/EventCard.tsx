"use client";

import { GameEvent } from "@/lib/types";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORY_LABELS: Record<string, string> = {
  ekonomi: "Ekonomi",
  kriz: "Kriz",
  dis_politika: "Dış Politika",
  ic_politika: "İç Politika",
  cevre: "Çevre",
  askeri: "Askeri",
  sosyal: "Sosyal",
};

const STAT_ICONS: Record<string, string> = {
  military: "⚔️",
  happiness: "😊",
  health: "🏥",
  environment: "🌿",
  education: "📚",
  stability: "🏛️",
  foreignRelations: "🌍",
  popularity: "👑",
  politicalCapital: "📜",
  energy: "⚡",
  food: "🌾",
  materials: "⚙️",
  tech: "🔬",
  inflation: "💹",
};

const STAT_LABELS: Record<string, string> = {
  military: "Askeriye",
  happiness: "Mutluluk",
  health: "Sağlık",
  environment: "Çevre",
  education: "Eğitim",
  stability: "İstikrar",
  foreignRelations: "Dış İlişkiler",
  popularity: "Popülarite",
  politicalCapital: "Siyasi Sermaye",
  energy: "Enerji",
  food: "Gıda",
  materials: "Materyal",
  tech: "Teknoloji",
  inflation: "Enflasyon",
};

interface EventCardProps {
  event: GameEvent;
  onChoice: (label: string) => void;
  disabled?: boolean;
  ministersJson?: string;
}

export default function EventCard({ event, onChoice, disabled, ministersJson }: EventCardProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  let hiredMinisters: string[] = [];
  try {
    if (ministersJson) {
      const parsed = JSON.parse(ministersJson);
      hiredMinisters = Object.values(parsed);
    }
  } catch {}

  const handleChoice = (label: string) => {
    if (disabled || selectedChoice) return;
    setSelectedChoice(label);
    setTimeout(() => onChoice(label), 300); // Wait for stamp animation (Hızlandırıldı)
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`tutorial-event rounded-3xl p-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] border backdrop-blur-md relative overflow-hidden ${
        event.isSnowball 
          ? "bg-gradient-to-br from-red-950/90 to-orange-950/90 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.4)]" 
          : "bg-slate-900/80 border-slate-700"
      }`}
    >
      {/* Holographic accent */}
      <div className={`absolute top-0 left-0 w-full h-1 opacity-50 ${
        event.isSnowball 
          ? "bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 h-2" 
          : "bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500"
      }`}></div>

      {/* Category Badge */}
      <div className="flex justify-between items-center mb-4">
        <span className={`badge-${event.category} text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg ${
          event.isSnowball ? "ring-2 ring-red-500 animate-pulse bg-red-600 text-white" : ""
        }`}>
          {event.isSnowball ? "⚠️ KARTOPU KARARI" : (CATEGORY_LABELS[event.category] || event.category)}
        </span>
        <span className={`${event.isSnowball ? 'text-red-300' : 'text-slate-500'} text-xs font-mono font-bold`}>
          {event.isSnowball ? "KIRMIZI KOD" : `DOKÜMAN NO: ${event.id.split('_')[1] || (event.id.length * 777).toString().slice(0, 4)}`}
        </span>
      </div>

      {/* Title */}
      <h3 className={`text-xl font-bold mb-2 leading-tight ${event.isSnowball ? 'text-red-100' : 'text-slate-100'}`}>
        {event.title}
      </h3>

      {/* Description */}
      <p className={`leading-relaxed mb-3 text-[13px] border-l-2 pl-3 py-1 ${
        event.isSnowball ? 'text-red-200/90 border-red-500/50 bg-red-950/30' : 'text-slate-300 border-slate-600'
      }`}>
        {event.description}
      </p>

      {/* Choices */}
      <div className="space-y-2">
        {event.choices.map((choice) => {
          const isSelected = selectedChoice === choice.label;
          const isMinisterMissing = choice.requiredMinister ? !hiredMinisters.includes(choice.requiredMinister) : false;
          const isBtnDisabled = disabled || !!selectedChoice || isMinisterMissing;

          return (
            <motion.button
              key={choice.label}
              whileHover={!selectedChoice && !isBtnDisabled ? { scale: 1.02, backgroundColor: "rgba(30, 41, 59, 0.8)" } : {}}
              whileTap={!selectedChoice && !isBtnDisabled ? { scale: 0.98 } : {}}
              onClick={() => !isBtnDisabled && handleChoice(choice.label)}
              disabled={isBtnDisabled}
              className={`w-full text-left relative p-3 rounded-xl border transition-all duration-300 ${
                isSelected
                  ? "border-cyan-500 bg-cyan-900/20"
                  : isMinisterMissing
                  ? "border-red-900/40 bg-slate-900/40 opacity-60 cursor-not-allowed"
                  : "border-slate-700 bg-slate-800/50 hover:border-slate-500"
              } ${
                selectedChoice && !isSelected ? "opacity-30 grayscale" : ""
              }`}
            >
              <div className="flex gap-4 relative z-10">
                <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold ${
                  isSelected ? "bg-cyan-500 text-slate-900" : "bg-slate-700 text-slate-300"
                }`}>
                  {choice.label}
                </span>

                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <p className={`text-[13px] ${isSelected ? "text-cyan-100 font-semibold" : "text-slate-200"}`}>
                      {choice.text}
                    </p>
                    {/* Required Minister Warning Badge */}
                    {isMinisterMissing && (
                      <span className="flex-shrink-0 text-[10px] px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        ⚠️ Bakan Gerekli
                      </span>
                    )}
                    {/* Budget Badge */}
                    {!isMinisterMissing && choice.effects.budget !== undefined && choice.effects.budget !== 0 && (
                      <span className={`flex-shrink-0 text-[11px] px-2 py-0.5 rounded font-bold ${
                        choice.effects.budget > 0 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {choice.effects.budget > 0 ? `+$${choice.effects.budget}` : `-$${Math.abs(choice.effects.budget)}`}
                      </span>
                    )}
                  </div>
                  
                  {/* Stat Etkileri (Sayısal Değerler) */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Object.entries(choice.effects).map(([key, val]) => {
                      if (key === "budget" || val === 0) return null;
                      const isPos = val > 0;
                      const icon = STAT_ICONS[key] || "⚙️";
                      const label = STAT_LABELS[key] || key;
                      return (
                        <span key={key} title={`${label}: ${isPos ? '+' : ''}${val}`} className={`text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1 ${
                          isPos 
                            ? 'bg-green-500/10 text-green-300 border border-green-500/20' 
                            : 'bg-red-500/10 text-red-300 border border-red-500/20'
                        }`}>
                          {icon} {isPos ? '+' : ''}{val}
                        </span>
                      );
                    })}
                    
                    {/* Fraksiyon Etkileri (Toplum) */}
                    {choice.factionEffects && Object.entries(choice.factionEffects).map(([key, val]) => {
                      if (val === 0) return null;
                      const isPos = val > 0;
                      
                      const factionNames: Record<string, string> = {
                        capitalists: "Sermayedarlar",
                        workers: "İşçiler",
                        military: "Ordu",
                        intellectuals: "Aydınlar",
                        nationalists: "Milliyetçiler"
                      };
                      
                      const factionIcons: Record<string, string> = {
                        capitalists: "💼",
                        workers: "👷",
                        military: "🎖️",
                        intellectuals: "🎓",
                        nationalists: "🦅"
                      };

                      return (
                        <span key={`fac_${key}`} title={isPos ? "Bu kesimin desteği artacak" : "Bu kesimin desteği düşecek"} className={`text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1 ${
                          isPos 
                            ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' 
                            : 'bg-orange-500/10 text-orange-300 border border-orange-500/20'
                        }`}>
                          {factionIcons[key]} {factionNames[key]} {isPos ? '⬆️' : '⬇️'}
                        </span>
                      );
                    })}
                  </div>
                  
                  {/* Hint is always visible but subtle */}
                  <p className="text-[11px] text-slate-500 italic mt-2">
                    {choice.hint}
                  </p>
                </div>
              </div>

              {/* Stamp Animation on Select */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 3, opacity: 0, rotate: -15 }}
                    animate={{ scale: 1, opacity: 1, rotate: -5 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                  >
                    <div className="border-[3px] border-red-500 text-red-500 text-xl font-black uppercase tracking-widest px-2 py-1 rounded shadow-[0_0_10px_rgba(239,68,68,0.5)] bg-slate-900/40 backdrop-blur-sm transform -rotate-12">
                      ONAYLANDI
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
