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

interface EventCardProps {
  event: GameEvent;
  onChoice: (label: string) => void;
  disabled?: boolean;
}

export default function EventCard({ event, onChoice, disabled }: EventCardProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const handleChoice = (label: string) => {
    if (disabled || selectedChoice) return;
    setSelectedChoice(label);
    setTimeout(() => onChoice(label), 600); // Wait for stamp animation
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="tutorial-event bg-slate-900/80 rounded-3xl p-5 shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-700 backdrop-blur-md relative overflow-hidden"
    >
      {/* Holographic accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 opacity-50"></div>

      {/* Category Badge */}
      <div className="flex justify-between items-center mb-4">
        <span className={`badge-${event.category} text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg`}>
          {CATEGORY_LABELS[event.category] || event.category}
        </span>
        <span className="text-slate-500 text-xs font-mono">DOKÜMAN NO: {event.id.split('_')[1] || Math.floor(Math.random()*9000)+1000}</span>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-slate-100 mb-4 leading-tight">
        {event.title}
      </h3>

      {/* Description */}
      <p className="text-slate-300 leading-relaxed mb-4 text-sm border-l-2 border-slate-600 pl-4 py-1">
        {event.description}
      </p>

      {/* Choices */}
      <div className="space-y-2">
        {event.choices.map((choice) => {
          const isSelected = selectedChoice === choice.label;

          return (
            <motion.button
              key={choice.label}
              whileHover={!selectedChoice && !disabled ? { scale: 1.02, backgroundColor: "rgba(30, 41, 59, 0.8)" } : {}}
              whileTap={!selectedChoice && !disabled ? { scale: 0.98 } : {}}
              onClick={() => handleChoice(choice.label)}
              disabled={disabled || !!selectedChoice}
              className={`w-full text-left relative p-3 rounded-xl border transition-all duration-300 ${
                isSelected
                  ? "border-cyan-500 bg-cyan-900/20"
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
                  <p className={`text-[13px] ${isSelected ? "text-cyan-100 font-semibold" : "text-slate-200"}`}>
                    {choice.text}
                  </p>
                  
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
                    <div className="border-4 border-red-500 text-red-500 text-3xl font-black uppercase tracking-widest p-2 rounded shadow-[0_0_15px_rgba(239,68,68,0.5)] bg-slate-900/40 backdrop-blur-sm transform -rotate-12">
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
