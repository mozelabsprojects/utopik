"use client";

import { useState } from "react";
import { WorldCountryState } from "@/lib/types";

export default function DiplomacyPanel({
  gameId,
  worldCountries,
  politicalCapital,
  military,
  onUpdate
}: {
  gameId: string;
  worldCountries: WorldCountryState[];
  politicalCapital: number;
  military: number;
  onUpdate: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAction = async (targetCountryId: string, action: "alliance" | "embargo" | "war") => {
    if (action === "war" && !confirm("Bu ülkeye savaş açmak istediğinizden emin misiniz? Ağır kayıplar yaşayabilirsiniz!")) return;
    if (action === "embargo" && !confirm("Ambargo uygulamak ilişkileri bozar. Emin misiniz?")) return;
    
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/game/diplomacy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, targetCountryId, action })
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

  const aiCountries = worldCountries.filter(c => !c.isPlayer);

  return (
    <div className="tutorial-diplomacy bg-slate-800/80 p-6 rounded-2xl shadow-xl border border-slate-700 backdrop-blur-sm">
      <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2 mb-4">
        🌍 Dünya Haritası ve Diplomasi
        <span className="text-sm font-normal bg-slate-700 px-3 py-1 rounded-full text-slate-300">
          Siyasi Sermaye: 📜 {politicalCapital}
        </span>
      </h2>
      
      {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aiCountries.map(country => (
          <div key={country.id} className="bg-slate-900/50 border border-slate-600 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-slate-100 flex justify-between items-center">
                {country.name}
                {country.military === 0 && <span className="text-xs bg-red-900 text-red-300 px-2 py-1 rounded">İşgal Altında</span>}
              </h3>
              <div className="mt-2 text-xs font-mono text-slate-400 space-y-1">
                <p>💰 Bütçe: {Math.round(country.budget)}</p>
                <p className={military >= country.military ? "text-green-400" : "text-red-400"}>
                  ⚔️ Askeri Güç: {Math.round(country.military)} 
                </p>
                <p>🏛️ İstikrar: {Math.round(country.stability)}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
              <button
                onClick={() => handleAction(country.id, "alliance")}
                disabled={loading || country.military === 0 || politicalCapital < 30}
                className="w-full py-1 text-xs font-bold bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white rounded transition border border-blue-500/30 disabled:opacity-50"
              >
                🤝 Müttefik Ol (📜 30)
              </button>
              <button
                onClick={() => handleAction(country.id, "embargo")}
                disabled={loading || country.military === 0 || politicalCapital < 20}
                className="w-full py-1 text-xs font-bold bg-orange-600/30 hover:bg-orange-600 text-orange-300 hover:text-white rounded transition border border-orange-500/30 disabled:opacity-50"
              >
                🚫 Ambargo (📜 20)
              </button>
              <button
                onClick={() => handleAction(country.id, "war")}
                disabled={loading || country.military === 0 || politicalCapital < 100}
                className="w-full py-1 text-xs font-bold bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white rounded transition border border-red-500/30 disabled:opacity-50"
              >
                ⚔️ Savaş Aç (📜 100)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
