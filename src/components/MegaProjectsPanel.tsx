"use client";

import { useState } from "react";
import { MEGA_PROJECTS, MegaProjectId } from "@/lib/mega-projects";

export default function MegaProjectsPanel({
  gameId,
  turn,
  budget,
  completedProjectsJson,
  onUpdate
}: {
  gameId: string;
  turn: number;
  budget: number;
  completedProjectsJson: string;
  onUpdate: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  let completed: string[] = [];
  try {
    completed = JSON.parse(completedProjectsJson);
  } catch (e) {}

  const handleStart = async (projectId: MegaProjectId) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/game/mega-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, projectId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onUpdate();
    } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tutorial-projects bg-slate-800/80 p-6 rounded-2xl shadow-xl border border-slate-700 backdrop-blur-sm">
      <h2 className="text-2xl font-bold text-yellow-500 flex items-center gap-2 mb-4">
        🚀 Mega Projeler
        <span className="text-sm font-normal bg-slate-700 px-3 py-1 rounded-full text-slate-300">
          Devlet Bütçesi: 💰 {budget.toLocaleString()}
        </span>
      </h2>
      
      {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(MEGA_PROJECTS).map((project) => {
          const isCompleted = completed.includes(project.id);
          const isTurnMet = turn >= project.requiredTurn;
          const isBudgetMet = budget >= project.cost;

          return (
            <div key={project.id} className={`border rounded-xl p-4 transition-all duration-300 ${isCompleted ? 'bg-yellow-500/10 border-yellow-500/50' : 'bg-slate-900/50 border-slate-600'}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className={`font-bold ${isCompleted ? 'text-yellow-400' : 'text-slate-100'}`}>
                  {project.name} {isCompleted && "🏆"}
                </h3>
                <span className="text-xs font-semibold bg-slate-700 text-slate-300 px-2 py-1 rounded">
                  {project.cost.toLocaleString()}$
                </span>
              </div>
              
              <p className="text-sm text-slate-400 mb-4">{project.description}</p>
              
              {!isCompleted && (
                <div className="space-y-1 mb-4 text-xs font-mono text-slate-500">
                  <p className={isTurnMet ? "text-green-400" : "text-red-400"}>
                    {isTurnMet ? "✔" : "✘"} Min. Tur: {project.requiredTurn}
                  </p>
                  <p className={isBudgetMet ? "text-green-400" : "text-red-400"}>
                    {isBudgetMet ? "✔" : "✘"} Yeterli Bütçe
                  </p>
                  <p>Diğer koşullar statlerinize bağlıdır.</p>
                </div>
              )}

              <button
                onClick={() => handleStart(project.id)}
                disabled={loading || isCompleted || !isTurnMet || !isBudgetMet}
                className={`w-full py-2 rounded-lg font-bold transition-colors ${
                  isCompleted 
                    ? 'bg-yellow-600/30 text-yellow-300 cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {isCompleted ? "Tamamlandı" : "Projeyi Başlat"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
