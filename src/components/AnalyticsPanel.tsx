"use client";

import React, { useState } from "react";
import { GameState, HistoryRecord } from "@/lib/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from "recharts";

interface AnalyticsPanelProps {
  game: GameState;
}

export default function AnalyticsPanel({ game }: AnalyticsPanelProps) {
  const [activeMetric, setActiveMetric] = useState<"economy" | "population" | "stability">("economy");
  
  let historyData: HistoryRecord[] = [];
  try {
    historyData = JSON.parse(game.historicalData || "[]");
  } catch (error) {
    console.error("Failed to parse historical data", error);
  }

  if (historyData.length === 0) {
    return (
      <div className="glass-strong rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px] border border-white/5 animate-fade-in text-center">
        <span className="text-6xl mb-4 opacity-50">📉</span>
        <h2 className="text-2xl font-[family-name:var(--font-display)] font-bold text-white mb-2">Veri Bekleniyor</h2>
        <p className="text-slate-400">Tarihsel analizlerin oluşması için en az bir tur geçmesi gerekiyor.</p>
      </div>
    );
  }

  // Format tooltips safely
  const formatPercent = (value: number) => `%${value.toFixed(1)}`;
  const formatMillion = (value: number) => `${value.toFixed(1)}M`;
  const formatIndex = (value: number) => `${Math.round(value)}`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-strong rounded-xl p-6 border border-white/5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-[var(--color-accent-primary)]/5 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 p-32 bg-purple-500/5 rounded-full blur-[100px] -z-10" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-[family-name:var(--font-display)] font-bold text-white flex items-center gap-3">
              <span className="text-3xl">📉</span> Tarihsel Analitikler
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Ülkenizin yıllar içindeki gelişimini ve trendlerini analiz edin.
            </p>
          </div>
          
          <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-700/50">
            <button
              onClick={() => setActiveMetric("economy")}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${
                activeMetric === "economy" ? "bg-[var(--color-accent-primary)] text-black" : "text-slate-400 hover:text-white"
              }`}
            >
              Ekonomi
            </button>
            <button
              onClick={() => setActiveMetric("population")}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${
                activeMetric === "population" ? "bg-purple-500 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Demografi
            </button>
            <button
              onClick={() => setActiveMetric("stability")}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${
                activeMetric === "stability" ? "bg-blue-500 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              İstikrar
            </button>
          </div>
        </div>

        {/* ECONOMY CHART */}
        {activeMetric === "economy" && (
          <div className="space-y-6">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-accent-primary)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTax" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="turn" stroke="#475569" tickFormatter={(t) => `Tur ${t}`} />
                  <YAxis stroke="#475569" tickFormatter={(v) => `$${v >= 1000 ? (v/1000).toFixed(1)+'k' : v}`} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ fontWeight: 'bold' }}
                    labelFormatter={(t) => `Tur ${t}`}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="budget" name="Bütçe ($)" stroke="var(--color-accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorBudget)" />
                  <Area type="monotone" dataKey="taxIncome" name="Vergi Geliri ($)" stroke="#4ade80" strokeWidth={2} fillOpacity={1} fill="url(#colorTax)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="h-[200px] w-full mt-8 border-t border-white/5 pt-8">
              <h3 className="text-sm font-bold text-slate-400 mb-4 text-center uppercase tracking-widest">Enflasyon Trendi (%)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <XAxis dataKey="turn" stroke="#475569" hide />
                  <YAxis stroke="#475569" domain={['auto', 'auto']} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    formatter={(value: any) => [formatPercent(Number(value)), "Enflasyon"]}
                  />
                  <Line type="monotone" dataKey="inflation" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* POPULATION CHART */}
        {activeMetric === "population" && (
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="turn" stroke="#475569" tickFormatter={(t) => `Tur ${t}`} />
                <YAxis stroke="#475569" domain={['auto', 'auto']} tickFormatter={(v) => `${v}M`} />
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(value: any) => [formatMillion(Number(value)), "Nüfus"]}
                  labelFormatter={(t) => `Tur ${t}`}
                />
                <Legend />
                <Area type="monotone" dataKey="population" name="Toplam Nüfus (Milyon)" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorPop)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* STABILITY CHART */}
        {activeMetric === "stability" && (
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <XAxis dataKey="turn" stroke="#475569" tickFormatter={(t) => `Tur ${t}`} />
                <YAxis stroke="#475569" domain={[0, 100]} />
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(value: any) => [formatIndex(Number(value)), ""]}
                  labelFormatter={(t) => `Tur ${t}`}
                />
                <Legend />
                <Line type="monotone" dataKey="stability" name="İstikrar Endeksi" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="happiness" name="Halk Mutluluğu" stroke="#eab308" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>
    </div>
  );
}
