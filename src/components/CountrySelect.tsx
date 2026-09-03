"use client";

import { CountryTemplate } from "@/lib/types";
import { COUNTRIES } from "@/lib/countries-data";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountrySelectProps {
  onSelect: (countryName: string, leaderProfile: string, customData?: any) => void;
  onContinue?: () => void;
  saveId?: string | null;
  loading?: boolean;
}

const DIFFICULTY_BADGES: Record<string, string> = {
  Kolay: "badge-easy",
  Dengeli: "badge-medium",
  Zor: "badge-hard",
  "Çok Zor": "badge-extreme",
};

// ── Sprite-based Avatar & Logo Data ──
// Leader portraits from the sprite sheet (3x2 grid)
const LEADER_AVATARS = [
  { id: "leader_1", label: "Genç Lider", row: 0, col: 0 },
  { id: "leader_2", label: "Kadın Lider", row: 0, col: 1 },
  { id: "leader_3", label: "Tecrübeli Devlet Adamı", row: 0, col: 2 },
  { id: "leader_4", label: "Başörtülü Lider", row: 1, col: 0 },
  { id: "leader_5", label: "Karizmatik Lider", row: 1, col: 1 },
  { id: "leader_6", label: "Akademisyen Lider", row: 1, col: 2 },
];

// Party logos from the sprite sheet (1x7 grid)
const PARTY_LOGOS = [
  { id: "logo_bulb", label: "Ampül Partisi", col: 0, color: "#f97316" },
  { id: "logo_arrows", label: "Ok Partisi", col: 1, color: "#ef4444" },
  { id: "logo_crescent", label: "Hilal Partisi", col: 2, color: "#22c55e" },
  { id: "logo_phoenix", label: "Anka Partisi", col: 3, color: "#a855f7" },
  { id: "logo_scales", label: "Adalet Partisi", col: 4, color: "#3b82f6" },
  { id: "logo_wheat", label: "Başak Partisi", col: 5, color: "#eab308" },
  { id: "logo_shield", label: "Kalkan Partisi", col: 6, color: "#dc2626" },
];

export default function CountrySelect({ onSelect, onContinue, saveId, loading }: CountrySelectProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [leaderProfile, setLeaderProfile] = useState<string>("default");
  
  // Customization States
  const [step, setStep] = useState<1 | 2>(1);
  const [presidentName, setPresidentName] = useState("Başkan");
  const [presidentAvatar, setPresidentAvatar] = useState("leader_1");
  const [partyName, setPartyName] = useState("Yeni Parti");
  const [partyLogo, setPartyLogo] = useState("logo_bulb");
  const [partyColor, setPartyColor] = useState("#f97316");

  const [isStarting, setIsStarting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelect = (name: string) => {
    setSelected(name);
    setLeaderProfile("default");
    setStep(1);
  };

  const handleStart = () => {
    if (selected) {
      setIsStarting(true);
      setTimeout(() => {
        // Map avatar & logo IDs to their sprite position data for rendering elsewhere
        const avatarData = LEADER_AVATARS.find(a => a.id === presidentAvatar);
        const logoData = PARTY_LOGOS.find(l => l.id === partyLogo);
        onSelect(selected, leaderProfile, {
          presidentName,
          presidentAvatar: presidentAvatar,
          partyName,
          partyLogo: partyLogo,
          partyColor
        });
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

  // ── Sprite renderers ──
  const renderLeaderAvatar = (avatarId: string, size: number = 80) => {
    const avatar = LEADER_AVATARS.find(a => a.id === avatarId);
    if (!avatar) return null;
    // 3 columns x 2 rows sprite sheet
    const bgPosX = -(avatar.col * (100 / 2)); // percentage based
    const bgPosY = -(avatar.row * (100)); // percentage based
    return (
      <div 
        className="rounded-xl overflow-hidden border-2 border-slate-600/50 shadow-lg"
        style={{
          width: size,
          height: size,
          backgroundImage: 'url("/assets/leader_portraits.jpg")',
          backgroundSize: '300%',
          backgroundPosition: `${avatar.col * 50}% ${avatar.row * 100}%`,
        }}
      />
    );
  };

  const renderPartyLogo = (logoId: string, size: number = 48) => {
    const logo = PARTY_LOGOS.find(l => l.id === logoId);
    if (!logo) return null;
    return (
      <div 
        className="rounded-full overflow-hidden border-2 border-slate-600/50 shadow-lg bg-white"
        style={{
          width: size,
          height: size,
          backgroundImage: 'url("/assets/party_logos.jpg")',
          backgroundSize: '700%',
          backgroundPosition: `${(logo.col / 6) * 100}% 50%`,
        }}
      />
    );
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
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
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

      {/* ════════════════════════════════════════════════════════ */}
      {/* ═══ CHARACTER CREATION MODAL ═══ */}
      {/* ════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
            onClick={() => !loading && setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-3xl max-w-lg w-full shadow-[0_0_80px_rgba(6,182,212,0.15)] overflow-hidden border border-slate-700/50 ${isStarting ? 'animate-warp' : ''}`}
            >
              {/* Top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" />
              
              {/* Close button */}
              {!loading && (
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-red-500/60 transition-all"
                >
                  ✕
                </button>
              )}

              {/* Header with flag */}
              <div className="relative px-8 pt-6 pb-4 text-center">
                <div className="flex items-center justify-center gap-4 mb-3">
                  <div className="w-16 h-11 bg-[#e5d9c5] border-2 border-double border-slate-600 rounded-sm shadow-xl overflow-hidden flex items-center justify-center p-0.5 transform -rotate-2">
                    <img 
                      src={`https://flagcdn.com/w160/${COUNTRIES.find(c => c.name === selected)?.code}.png`} 
                      alt={selected} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-black font-[family-name:var(--font-display)] ${selected === 'Kuzey Kore' ? 'text-red-500' : 'text-white'}`}>
                      {selected}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
                      {step === 1 ? "Karakter Oluştur" : "Lider Profili Seç"}
                    </p>
                  </div>
                </div>

                {/* Step indicator */}
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 1 ? 'w-12 bg-cyan-400' : 'w-6 bg-slate-700'}`} />
                  <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 2 ? 'w-12 bg-cyan-400' : 'w-6 bg-slate-700'}`} />
                </div>
              </div>

              {/* Step Content */}
              <div className="px-8 pb-8">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-5"
                  >
                    {/* ── President Name ── */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold text-cyan-400/80 uppercase tracking-[0.2em] mb-2">
                        <span className="w-5 h-5 flex items-center justify-center rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-black">1</span>
                        Başkan İsmi
                      </label>
                      <input 
                        type="text" 
                        value={presidentName} 
                        onChange={(e) => setPresidentName(e.target.value)}
                        className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-lg font-semibold focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder:text-slate-600"
                        placeholder="İsminizi girin"
                        maxLength={30}
                      />
                    </div>

                    {/* ── President Avatar (Sprite-based) ── */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold text-cyan-400/80 uppercase tracking-[0.2em] mb-2">
                        <span className="w-5 h-5 flex items-center justify-center rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-black">2</span>
                        Başkan Görseli
                      </label>
                      <div className="grid grid-cols-6 gap-2">
                        {LEADER_AVATARS.map(avatar => (
                          <button
                            key={avatar.id}
                            onClick={() => setPresidentAvatar(avatar.id)}
                            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 group/avatar ${
                              presidentAvatar === avatar.id 
                                ? "border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)] scale-105 ring-2 ring-cyan-400/30" 
                                : "border-slate-700 opacity-60 hover:opacity-100 hover:border-slate-500 hover:scale-105"
                            }`}
                            title={avatar.label}
                          >
                            <div 
                              className="w-full h-full"
                              style={{
                                backgroundImage: 'url("/assets/leader_portraits.jpg")',
                                backgroundSize: '300%',
                                backgroundPosition: `${avatar.col * 50}% ${avatar.row * 100}%`,
                              }}
                            />
                            {presidentAvatar === avatar.id && (
                              <div className="absolute bottom-0 left-0 right-0 bg-cyan-400/90 text-[8px] font-bold text-slate-900 text-center py-0.5">
                                SEÇİLDİ
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ── Party Name ── */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold text-cyan-400/80 uppercase tracking-[0.2em] mb-2">
                        <span className="w-5 h-5 flex items-center justify-center rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-black">3</span>
                        Parti İsmi
                      </label>
                      <input 
                        type="text" 
                        value={partyName} 
                        onChange={(e) => setPartyName(e.target.value)}
                        className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-lg font-semibold focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder:text-slate-600"
                        placeholder="Parti adı"
                        maxLength={30}
                      />
                    </div>

                    {/* ── Party Logo (Sprite-based) & Color ── */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-cyan-400/80 uppercase tracking-[0.2em] mb-2">
                          <span className="w-5 h-5 flex items-center justify-center rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-black">4</span>
                          Parti Logosu
                        </label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {PARTY_LOGOS.map(logo => (
                            <button
                              key={logo.id}
                              onClick={() => {
                                setPartyLogo(logo.id);
                                setPartyColor(logo.color);
                              }}
                              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 bg-white ${
                                partyLogo === logo.id 
                                  ? "border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-110" 
                                  : "border-slate-700 opacity-50 hover:opacity-100 hover:border-slate-500"
                              }`}
                              title={logo.label}
                            >
                              <div 
                                className="w-full h-full"
                                style={{
                                  backgroundImage: 'url("/assets/party_logos.jpg")',
                                  backgroundSize: '700%',
                                  backgroundPosition: `${(logo.col / 6) * 100}% 50%`,
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-cyan-400/80 uppercase tracking-[0.2em] mb-2">
                          <span className="w-5 h-5 flex items-center justify-center rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-black">5</span>
                          Parti Rengi
                        </label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[
                            { color: "#f97316", name: "Turuncu" },
                            { color: "#ef4444", name: "Kırmızı" },
                            { color: "#22c55e", name: "Yeşil" },
                            { color: "#3b82f6", name: "Mavi" },
                            { color: "#a855f7", name: "Mor" },
                            { color: "#eab308", name: "Sarı" },
                            { color: "#ec4899", name: "Pembe" },
                            { color: "#14b8a6", name: "Turkuaz" },
                          ].map(c => (
                            <button
                              key={c.color}
                              onClick={() => setPartyColor(c.color)}
                              className={`aspect-square rounded-lg border-2 transition-all duration-200 ${
                                partyColor === c.color 
                                  ? "border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.4)]" 
                                  : "border-transparent opacity-50 hover:opacity-100"
                              }`}
                              style={{ backgroundColor: c.color }}
                              title={c.name}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ── Preview Card ── */}
                    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex items-center gap-4">
                      <div className="shrink-0">
                        {(() => {
                          const avatar = LEADER_AVATARS.find(a => a.id === presidentAvatar);
                          if (!avatar) return null;
                          return (
                            <div 
                              className="w-16 h-16 rounded-xl overflow-hidden border-2 shadow-lg"
                              style={{
                                borderColor: partyColor,
                                backgroundImage: 'url("/assets/leader_portraits.jpg")',
                                backgroundSize: '300%',
                                backgroundPosition: `${avatar.col * 50}% ${avatar.row * 100}%`,
                              }}
                            />
                          );
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm truncate">{presidentName || "İsimsiz Başkan"}</p>
                        <p className="text-xs truncate" style={{ color: partyColor }}>{partyName || "Partisiz"}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{selected} • Başkomutan</p>
                      </div>
                      <div className="shrink-0">
                        {(() => {
                          const logo = PARTY_LOGOS.find(l => l.id === partyLogo);
                          if (!logo) return null;
                          return (
                            <div 
                              className="w-10 h-10 rounded-full overflow-hidden border-2 bg-white shadow-lg"
                              style={{
                                borderColor: partyColor,
                                backgroundImage: 'url("/assets/party_logos.jpg")',
                                backgroundSize: '700%',
                                backgroundPosition: `${(logo.col / 6) * 100}% 50%`,
                              }}
                            />
                          );
                        })()}
                      </div>
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => setStep(2)}
                      className="w-full relative group px-8 py-4 rounded-xl font-black text-lg transition-all bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)]"
                    >
                      <span className="flex items-center justify-center gap-2">
                        İleri
                        <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    {/* Leader Profile Selection */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold text-cyan-400/80 uppercase tracking-[0.2em] mb-3">
                        <span className="w-5 h-5 flex items-center justify-center rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-black">6</span>
                        Lider Profili
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { id: "default", icon: "⚖️", name: "Dengeli", desc: "Sıradan bir yönetim. Özel mekanik yok.", color: "from-slate-700 to-slate-800" },
                          { id: "technocrat", icon: "🧠", name: "Teknokrat", desc: "Her tur pasif Eğitim artar ama Mutluluk kalıcı düşer.", color: "from-blue-900/60 to-slate-800" },
                          { id: "general", icon: "🎖️", name: "General", desc: "Tüm altyapı bakım masrafları -%20, ama Dış İlişkiler düşer.", color: "from-green-900/60 to-slate-800" },
                          { id: "economist", icon: "💼", name: "Ekonomist", desc: "Tüm vergi gelirleri +%25, ama Çevre her tur kirlenir.", color: "from-yellow-900/60 to-slate-800" },
                          { id: "populist", icon: "🤝", name: "Halk Adamı", desc: "Her tur pasif Mutluluk artar ama Siyasi Sermaye erir.", color: "from-rose-900/60 to-slate-800" },
                        ].map(profile => (
                          <button
                            key={profile.id}
                            onClick={() => setLeaderProfile(profile.id)}
                            className={`flex items-center gap-4 p-3.5 rounded-xl border-2 transition-all text-left ${
                              leaderProfile === profile.id
                                ? "border-cyan-400/60 bg-gradient-to-r " + profile.color + " shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                                : "border-slate-700/50 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/60"
                            }`}
                          >
                            <span className="text-3xl shrink-0">{profile.icon}</span>
                            <div className="flex-1 min-w-0">
                              <span className="font-bold text-white text-sm">{profile.name}</span>
                              <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{profile.desc}</p>
                            </div>
                            {leaderProfile === profile.id && (
                              <div className="shrink-0 w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center">
                                <span className="text-slate-900 text-xs font-black">✓</span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => setStep(1)} 
                        className="w-1/3 py-3.5 rounded-xl font-bold border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <span className="text-lg">←</span> Geri
                      </button>
                      <button
                        onClick={handleStart}
                        disabled={loading}
                        className={`w-2/3 relative group px-8 py-3.5 rounded-xl font-black text-lg transition-all disabled:opacity-70 disabled:cursor-wait ${
                          selected === 'Kuzey Kore'
                            ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                            : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)]"
                        }`}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-3">
                            <span className="animate-spin-gear text-2xl">⚙️</span>
                            Kuruluyor...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-3">
                            🚀 Oyunu Başlat
                          </span>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
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
