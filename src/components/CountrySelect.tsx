"use client";

import { CountryTemplate } from "@/lib/types";
import { COUNTRIES } from "@/lib/countries-data";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountrySelectProps {
  onSelect: (countryName: string, leaderProfile: string) => void;
  onContinue?: () => void;
  saveId?: string | null;
  loading?: boolean;
}

const DIFFICULTY_BADGES: Record<string, string> = {
  Kolay: "badge-easy",
  Orta: "badge-medium",
  Zor: "badge-hard",
  "Çok Zor": "badge-extreme",
};

export default function CountrySelect({ onSelect, onContinue, saveId, loading }: CountrySelectProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [leaderProfile, setLeaderProfile] = useState<string>("default");
  const [isStarting, setIsStarting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelect = (name: string) => {
    setSelected(name);
    setLeaderProfile("default");
  };

  const handleStart = () => {
    if (selected) {
      setIsStarting(true);
      setTimeout(() => {
        onSelect(selected, leaderProfile);
      }, 800);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 relative overflow-hidden bg-bureaucracy">
      <div className="absolute inset-0 bg-slate-950/75 z-0 pointer-events-none" />
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--color-accent-glow)] rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--color-bg-panel)] rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Header */}
      <div className="text-center mb-8 z-10 animate-slide-in">
        <h1 className="text-6xl md:text-8xl font-[family-name:var(--font-display)] font-black text-[var(--color-accent-primary)] mb-4 tracking-tighter drop-shadow-md">
          ÜTOPİK
        </h1>
        <p className="text-[var(--color-text-main)] text-lg md:text-xl font-medium tracking-wide max-w-2xl mx-auto px-4">
          Bir ulusun kaderini seçin. Alacağınız her karar, kelebek etkisiyle tarihi yeniden yazacak.
        </p>
      </div>

      {/* Continue Game Button */}
      {saveId && onContinue && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-20 mb-8"
        >
          <button
            onClick={onContinue}
            disabled={loading}
            className="group relative px-8 py-3 rounded-2xl bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-400/50 text-indigo-300 font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] disabled:opacity-50"
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl group-hover:scale-110 transition-transform">💾</span>
              KALDIĞIN YERDEN DEVAM ET
            </span>
          </button>
        </motion.div>
      )}

      {/* Main Content Area */}
      <div className="w-full max-w-[1600px] relative z-10 px-4 md:px-12 flex flex-col items-center">
        
        {/* Navigation Arrows & Scroll Container */}
        <div className="w-full relative group">
          
          {/* Left Arrow */}
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-8 z-20 p-3 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:block backdrop-blur-md"
          >
            <span className="text-2xl font-bold">←</span>
          </button>

          {/* Horizontal Scroll Area */}
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 pt-4 px-4 custom-scrollbar hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {mounted && COUNTRIES.map((country, i) => (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={country.name}
                onClick={() => handleSelect(country.name)}
                className={`group flex-none w-[300px] md:w-[340px] snap-center cursor-pointer transition-all duration-300 rounded-3xl p-6 relative overflow-hidden border-2 ${
                  country.name === "Kuzey Kore"
                    ? selected === country.name
                      ? "bg-slate-900 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.8)] scale-105 z-10"
                      : "bg-slate-900/80 border-red-900/50 hover:bg-slate-900 hover:border-red-500/80 hover:-translate-y-4 hover:shadow-[0_20px_40px_rgba(239,68,68,0.5)] opacity-80 hover:opacity-100"
                    : selected === country.name 
                      ? "glass-strong border-[var(--color-accent-primary)] shadow-2xl scale-105 z-10" 
                      : "glass border-transparent hover:bg-white/5 hover:border-[var(--color-accent-primary)] hover:-translate-y-4 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] opacity-80 hover:opacity-100"
                }`}
              >
                {/* Active Indicator Glow */}
                {selected === country.name && (
                  <div className={`absolute inset-0 bg-gradient-to-b ${country.name === 'Kuzey Kore' ? 'from-red-600/20' : 'from-[var(--color-accent-glow)]'} to-transparent pointer-events-none`} />
                )}

                <div className="flex flex-col h-full relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-20 h-14 bg-[#e5d9c5] border-4 border-double border-slate-700/60 rounded-sm shadow-md overflow-hidden flex items-center justify-center p-0.5">
                      <img 
                        src={`https://flagcdn.com/w160/${country.code}.png`} 
                        alt={country.name} 
                        className="w-full h-full object-cover sepia-[.5] saturate-[.4] contrast-125 brightness-90"
                      />
                    </div>
                    <span className={`${DIFFICULTY_BADGES[country.difficulty]} text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg`}>
                      {country.difficulty}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-100 mb-2 font-[family-name:var(--font-display)] tracking-wide">
                    {country.name}
                  </h3>
                  
                  <p className="text-sm text-slate-400 mb-6 flex-grow leading-relaxed">
                    {country.description}
                  </p>

                  <div className="grid grid-cols-4 gap-2 mt-auto pt-4 border-t border-slate-700/50">
                    {[
                      { icon: "⚔️", val: country.military, label: "Ask" },
                      { icon: "😊", val: country.happiness, label: "Mut" },
                      { icon: "🏥", val: country.health, label: "Sağ" },
                      { icon: "🌿", val: country.environment, label: "Çev" },
                      { icon: "📚", val: country.education, label: "Eği" },
                      { icon: "🏛️", val: country.stability, label: "İst" },
                      { icon: "🌍", val: country.foreignRelations, label: "Dış" },
                      { icon: "💰", val: Math.round(country.budget / 100), label: "Para" },
                    ].map((stat, j) => (
                      <div key={j} className="flex flex-col items-center justify-center bg-slate-950/40 rounded-lg py-1.5 border border-white/5 transition-colors group-hover:bg-slate-900/60">
                        <span className="text-xs mb-0.5 stat-icon" title={stat.label}>{stat.icon}</span>
                        <span className={`text-xs font-bold ${
                          stat.val < 30 ? "text-red-400" : stat.val < 50 ? "text-yellow-400" : "text-emerald-400"
                        }`}>
                          {stat.val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Arrow */}
          <button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-8 z-20 p-3 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:block backdrop-blur-md"
          >
            <span className="text-2xl font-bold">→</span>
          </button>

        </div>
      </div>

      {/* Start Game Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => !loading && setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`glass-strong rounded-3xl p-8 max-w-md w-full relative shadow-2xl flex flex-col items-center text-center overflow-hidden ${isStarting ? 'animate-warp' : ''}`}
            >
              {!loading && (
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  ✕
                </button>
              )}
              
              <div className="w-28 h-20 bg-[#e5d9c5] border-4 border-double border-[var(--color-border)] rounded-sm shadow-xl overflow-hidden flex items-center justify-center mb-4 p-1 transform -rotate-2">
                <img 
                  src={`https://flagcdn.com/w160/${COUNTRIES.find(c => c.name === selected)?.code}.png`} 
                  alt={selected} 
                  className="w-full h-full object-cover sepia-[.6] saturate-[.4] contrast-125 brightness-90"
                />
              </div>
              <h2 className={`text-3xl font-black font-[family-name:var(--font-display)] mb-2 ${selected === 'Kuzey Kore' ? 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 'text-white'}`}>
                {selected}
              </h2>
              <p className="text-slate-400 mb-6">
                {selected === 'Kuzey Kore' 
                  ? "Tüm dünya sana düşman. Hayatta kalmak için ne kadar ileri gideceksin?"
                  : "Bu ulusun kaderi senin ellerinde. Nasıl bir lider olacaksın?"}
              </p>

              {/* Lider Profili Seçimi */}
              <div className="w-full text-left mb-8 space-y-2">
                <label className="text-sm font-bold text-[var(--color-accent-primary)] uppercase tracking-widest ml-1">Lider Profili</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "default", icon: "👤", name: "Dengeli", desc: "Sıradan bir yönetim. Özel mekanik yok." },
                    { id: "technocrat", icon: "🧠", name: "Teknokrat", desc: "Her tur pasif Eğitim artar ama Mutluluk kalıcı düşer." },
                    { id: "general", icon: "🎖️", name: "General", desc: "Tüm altyapı bakım masrafları -%20, ama Dış İlişkiler pasif düşer." },
                    { id: "economist", icon: "💼", name: "Ekonomist", desc: "Tüm vergi gelirleri +%25, ama Çevre her tur kirlenir." },
                    { id: "populist", icon: "🤝", name: "Halk Adamı", desc: "Her tur pasif Mutluluk artar ama Siyasi Sermaye erir." },
                  ].map(profile => (
                    <button
                      key={profile.id}
                      onClick={() => setLeaderProfile(profile.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                        leaderProfile === profile.id
                          ? "bg-[var(--color-accent-glow)] border-[var(--color-accent-primary)] text-white"
                          : "bg-slate-800/50 border-slate-700 text-[var(--color-text-muted)] hover:border-[var(--color-border)] hover:text-white"
                      }`}
                    >
                      <span className="text-2xl mb-1">{profile.icon}</span>
                      <span className="font-bold text-sm">{profile.name}</span>
                      <span className="text-[10px] opacity-70">{profile.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStart}
                disabled={loading}
                className={`w-full relative group px-8 py-4 rounded-xl font-black text-xl transition-all disabled:opacity-70 disabled:cursor-wait ${
                  selected === 'Kuzey Kore'
                    ? "bg-red-600 hover:bg-red-500 text-white shadow-xl hover:shadow-2xl"
                    : "btn-primary"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="animate-spin-gear text-2xl">⚙️</span>
                    Ülke Kuruluyor...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    🚀 Oyunu Başlat
                  </span>
                )}
                {!loading && (
                  <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer / Credits */}
      <div className="absolute bottom-4 right-6 z-20 text-right opacity-60 hover:opacity-100 transition-opacity">
        <p className="text-xs text-slate-400 font-medium">Geliştirici:</p>
        <p className="text-sm font-bold text-cyan-400 tracking-wide font-[family-name:var(--font-display)] drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">
          <a href="https://mozelabs.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">mozelabs.com</a>
        </p>
        <p className="text-[10px] text-slate-500 font-mono tracking-widest mt-0.5">by Mox</p>
      </div>

    </div>
  );
}
