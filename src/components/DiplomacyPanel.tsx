"use client";

import { useState } from "react";
import { WorldCountryState } from "@/lib/types";

export default function DiplomacyPanel({
  gameId,
  worldCountries,
  politicalCapital,
  military,
  gameState,
  onUpdate
}: {
  gameId: string;
  worldCountries: WorldCountryState[];
  politicalCapital: number;
  military: number;
  gameState?: any;
  onUpdate: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  let dipState: any = { westernRelations: 50, easternRelations: 50, activeEmbargoes: [] };
  try {
    const gs = gameState;
    if (gs && gs.diplomacyState) {
      dipState = JSON.parse(gs.diplomacyState);
      if (dipState.westernRelations === undefined) dipState.westernRelations = 50;
      if (dipState.easternRelations === undefined) dipState.easternRelations = 50;
    }
  } catch {}

  const handleAction = async (targetCountryId: string, action: "alliance" | "embargo" | "war" | "lift_embargo" | "peace") => {
    if (action === "war" && !confirm("Bu ülkeye savaş açmak istediğinizden emin misiniz? Ağır kayıplar yaşayabilirsiniz!")) return;
    if (action === "embargo" && !confirm("Ambargo uygulamak ilişkileri bozar. Emin misiniz?")) return;
    
    const targetCountry = worldCountries.find(c => c.id === targetCountryId);
    if (!targetCountry) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/game/diplomacy-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: gameId, partnerName: targetCountry.name, action })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onUpdate();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const aiCountries = worldCountries.filter((c: any) => !c.isPlayer);

  return (
    <div className="tutorial-diplomacy glass-strong p-8 rounded-3xl shadow-2xl border border-white/5 animate-fade-in relative overflow-hidden">
      
      {/* Background World Map SVG / Accents */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)' }}></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 relative z-10">
        <div>
          <h2 className="text-3xl font-black font-[family-name:var(--font-display)] text-white flex items-center gap-3">
            🌍 Küresel Diplomasi
          </h2>
          <p className="text-slate-400 mt-1">Süper güçler arasındaki dengeyi koruyun veya tarafınızı seçin.</p>
        </div>
        <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/10">
          <span className="text-xl">📜</span>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Siyasi Sermaye</span>
            <span className="font-bold text-lg text-white leading-tight">{politicalCapital}</span>
          </div>
        </div>
      </div>
      
      {error && <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-xl mb-6 shadow-lg">{error}</div>}

      {/* East vs West Global Balance */}
      <div className="bg-black/30 rounded-2xl p-6 border border-white/5 mb-8 relative z-10">
        <h3 className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Küresel Güç Dengesi</h3>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-900/50 rounded-full border-2 border-blue-500 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              🦅
            </div>
            <div>
              <div className="font-bold text-blue-400">Batı İttifakı</div>
              <div className="text-xs text-slate-400">Teknoloji & Finans</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center px-4">
            <span className="text-2xl font-black text-white mix-blend-overlay opacity-50">VS</span>
          </div>

          <div className="flex items-center gap-3 text-right">
            <div>
              <div className="font-bold text-red-400">Doğu Bloku</div>
              <div className="text-xs text-slate-400">Enerji & Sanayi</div>
            </div>
            <div className="w-12 h-12 bg-red-900/50 rounded-full border-2 border-red-500 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(239,68,68,0.5)]">
              🐻
            </div>
          </div>
        </div>

        {/* Tug of War Bar */}
        <div className="relative h-6 bg-slate-800 rounded-full overflow-hidden border border-slate-700 mt-4 flex shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000 ease-out flex items-center px-2"
            style={{ width: `${dipState.westernRelations}%` }}
          >
            <span className="text-[10px] font-bold text-white drop-shadow-md">%{Math.round(dipState.westernRelations)}</span>
          </div>
          
          <div className="h-full w-0.5 bg-white/50 absolute left-1/2 top-0 transform -translate-x-1/2 shadow-[0_0_10px_rgba(255,255,255,1)] z-10"></div>
          
          <div 
            className="h-full bg-gradient-to-l from-red-600 to-red-400 transition-all duration-1000 ease-out ml-auto flex items-center justify-end px-2"
            style={{ width: `${dipState.easternRelations}%` }}
          >
            <span className="text-[10px] font-bold text-white drop-shadow-md">%{Math.round(dipState.easternRelations)}</span>
          </div>
        </div>
        
        <div className="flex justify-between mt-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
          <span className={dipState.westernRelations >= 70 ? "text-blue-400" : ""}>
            {dipState.westernRelations >= 70 ? "Güçlü Müttefik" : dipState.westernRelations <= 30 ? "Düşmanca" : "Nötr"}
          </span>
          <span className={dipState.easternRelations >= 70 ? "text-red-400" : ""}>
            {dipState.easternRelations >= 70 ? "Güçlü Müttefik" : dipState.easternRelations <= 30 ? "Düşmanca" : "Nötr"}
          </span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-4 relative z-10 flex items-center gap-2">
        <span className="text-2xl">🗺️</span> Bölgesel Ülkeler
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {aiCountries.map((country: any) => {
          const isEmbargoed = dipState.activeEmbargoes?.includes(country.name);
          const allianceState = dipState[country.name];
          const isAlly = allianceState?.type === 'alliance';
          const isWar = allianceState?.type === 'war';

          return (
          <div key={country.id} className={`bg-black/30 border ${isAlly ? 'border-blue-500/50' : isWar ? 'border-red-500/50' : isEmbargoed ? 'border-orange-500/50' : 'border-white/5'} hover:border-white/20 hover:bg-white/5 transition-all rounded-2xl p-5 flex flex-col justify-between group`}>
            <div>
              <h3 className="font-bold text-lg text-white flex justify-between items-center mb-3">
                <span className="flex items-center gap-2">
                  {country.name}
                  {isEmbargoed && <span className="text-[10px] bg-orange-500/20 border border-orange-500/50 text-orange-300 px-2 py-1 rounded-full uppercase tracking-widest">Ambargo</span>}
                  {isAlly && <span className="text-[10px] bg-blue-500/20 border border-blue-500/50 text-blue-300 px-2 py-1 rounded-full uppercase tracking-widest">Müttefik</span>}
                  {isWar && <span className="text-[10px] bg-red-500/20 border border-red-500/50 text-red-300 px-2 py-1 rounded-full uppercase tracking-widest">Savaşta</span>}
                </span>
                {country.military === 0 && <span className="text-[10px] bg-red-500/20 border border-red-500/50 text-red-300 px-2 py-1 rounded-full uppercase tracking-widest">İşgal Altında</span>}
              </h3>
              
              <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-400">
                <div className="bg-white/5 rounded-lg p-2 flex justify-between">
                  <span>💰 Bütçe</span>
                  <span className="text-white">${Math.round(country.budget)}</span>
                </div>
                <div className="bg-white/5 rounded-lg p-2 flex justify-between">
                  <span>⚔️ Askeri</span>
                  <span className={military >= country.military ? "text-green-400" : "text-red-400"}>{Math.round(country.military)}</span>
                </div>
                <div className="bg-white/5 rounded-lg p-2 flex justify-between col-span-2">
                  <span>🏛️ İstikrar</span>
                  <span className="text-white">%{Math.round(country.stability)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-2">
              {!isAlly && !isWar && (
                <button
                  onClick={() => handleAction(country.id, "alliance")}
                  disabled={loading || country.military === 0 || politicalCapital < 30}
                  className="col-span-2 py-2 text-xs font-bold bg-blue-500/10 hover:bg-blue-500/30 text-blue-300 rounded-xl transition border border-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  🤝 Müttefik Ol (📜 30)
                </button>
              )}
              {isWar && (
                <button
                  onClick={() => handleAction(country.id, "peace")}
                  disabled={loading || politicalCapital < 50}
                  className="col-span-2 py-2 text-xs font-bold bg-green-500/10 hover:bg-green-500/30 text-green-300 rounded-xl transition border border-green-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  🕊️ Barış İlan Et (📜 50, $1k)
                </button>
              )}
              {isAlly && (
                <button
                  onClick={() => handleAction(country.id, "peace")}
                  disabled={loading || politicalCapital < 50}
                  className="col-span-2 py-2 text-xs font-bold bg-slate-500/10 hover:bg-slate-500/30 text-slate-300 rounded-xl transition border border-slate-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  💔 İttifakı Boz (📜 50)
                </button>
              )}
              {isEmbargoed ? (
                <button
                  onClick={() => handleAction(country.id, "lift_embargo")}
                  disabled={loading || country.military === 0 || politicalCapital < 20}
                  className="py-2 text-xs font-bold bg-green-500/10 hover:bg-green-500/30 text-green-300 rounded-xl transition border border-green-500/20 disabled:opacity-50 flex flex-col items-center justify-center"
                >
                  <span>🔓 Ambargoyu</span>
                  <span>Kaldır (📜 20)</span>
                </button>
              ) : (
                <button
                  onClick={() => handleAction(country.id, "embargo")}
                  disabled={loading || country.military === 0 || politicalCapital < 20}
                  className="py-2 text-xs font-bold bg-orange-500/10 hover:bg-orange-500/30 text-orange-300 rounded-xl transition border border-orange-500/20 disabled:opacity-50"
                >
                  🚫 Ambargo (20)
                </button>
              )}
              {!isWar && (
                <button
                  onClick={() => handleAction(country.id, "war")}
                  disabled={loading || country.military === 0 || politicalCapital < 100}
                  className="py-2 text-xs font-bold bg-red-500/10 hover:bg-red-500/30 text-red-400 rounded-xl transition border border-red-500/20 disabled:opacity-50"
                >
                  ⚔️ Savaş Aç (100)
                </button>
              )}
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
