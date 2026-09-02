"use client";

import { FactionsState, INITIAL_FACTIONS } from "@/lib/factions";

interface FactionsPanelProps {
  factionsStr: string;
}

export default function FactionsPanel({ factionsStr }: FactionsPanelProps) {
  let factions: FactionsState = INITIAL_FACTIONS;
  try {
    factions = JSON.parse(factionsStr);
  } catch {
    return null;
  }

  const factionList = Object.values(factions);

  return (
    <div className="tutorial-factions glass p-6 rounded-2xl animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="text-3xl">👥</span> Toplumsal Fraksiyonlar
      </h2>
      <p className="text-gray-400 text-sm mb-6">
        Farklı sosyal sınıfların yönetiminize olan desteği. Desteği çok düşen gruplar krizlere yol açabilir.
      </p>

      <div className="space-y-6">
        {factionList.map((faction) => {
          let supportColor = "bg-green-500";
          if (faction.support < 30) supportColor = "bg-red-500";
          else if (faction.support < 60) supportColor = "bg-yellow-500";

          return (
            <div key={faction.id} className="bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-200">{faction.name}</h3>
                <span className="text-xl font-bold">{Math.round(faction.support)}%</span>
              </div>
              <p className="text-xs text-gray-400 mb-4">{faction.description}</p>
              
              <div className="stat-bar-track h-3 bg-black/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ease-out ${supportColor}`} 
                  style={{ width: `${faction.support}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
