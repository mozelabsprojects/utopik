"use client";

import React from "react";
import { motion } from "framer-motion";

export type SidebarTab = 
  | "dashboard" 
  | "decisions" 
  | "ministers" 
  | "factions" 
  | "policies" 
  | "projects" 
  | "crises" 
  | "world" 
  | "diplomacy"
  | "market"
  | "tech";

interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}

const MENU_ITEMS: { id: SidebarTab; label: string; icon: string; className?: string }[] = [
  { id: "dashboard", label: "Ana Merkez", icon: "🏛️", className: "tutorial-dashboard" },
  { id: "decisions", label: "Kararlar", icon: "📜", className: "tutorial-event" },
  { id: "ministers", label: "Kabine", icon: "👔", className: "tutorial-ministers" },
  { id: "factions", label: "Toplum", icon: "👥", className: "tutorial-factions" },
  { id: "policies", label: "Politikalar", icon: "⚖️", className: "tutorial-policies" },
  { id: "projects", label: "Mega Projeler", icon: "🏗️", className: "tutorial-projects" },
  { id: "crises", label: "Krizler", icon: "⚠️", className: "tutorial-crises" },
  { id: "world", label: "Dünya Haritası", icon: "🌍", className: "tutorial-world" },
  { id: "diplomacy", label: "Diplomasi", icon: "🤝", className: "tutorial-diplomacy" },
  { id: "market", label: "Borsa & Kaynaklar", icon: "📈", className: "tutorial-market" },
  { id: "tech", label: "Ar-Ge & Teknoloji", icon: "🔬", className: "tutorial-tech" },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 md:relative w-full md:w-64 h-auto md:h-full glass-strong border-t md:border-t-0 md:border-r border-[var(--color-border)] flex flex-col shrink-0 z-[100] md:z-40">
      {/* Brand / Logo Area */}
      <div className="hidden md:flex p-6 border-b border-[var(--color-border)] items-center gap-3">
        <span className="text-3xl">👑</span>
        <div>
          <h1 className="text-xl font-[family-name:var(--font-display)] font-black text-[var(--color-accent-primary)] tracking-wider">
            ÜTOPİK
          </h1>
          <p className="text-[10px] text-[var(--color-text-muted)] font-bold tracking-widest uppercase">
            Başkanlık Ofisi
          </p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto hide-scrollbar p-2 md:p-4 flex flex-row md:flex-col gap-2 md:space-y-1">
        {MENU_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-auto md:w-full flex flex-col md:flex-row shrink-0 items-center justify-center md:justify-start gap-1 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-xl transition-all duration-300 relative group overflow-hidden ${item.className || ""} ${
                isActive
                  ? "bg-[var(--color-accent-glow)] text-[var(--color-accent-primary)] border border-[var(--color-accent-primary)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-main)] border border-transparent"
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 md:top-0 md:bottom-0 w-1/2 h-1 md:w-1 md:h-auto bg-[var(--color-accent-primary)] shadow-none"
                />
              )}
              
              <span className={`text-xl transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                {item.icon}
              </span>
              <span className={`font-medium text-[10px] md:text-sm whitespace-nowrap tracking-wide ${isActive ? "font-bold" : ""}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer Area / Settings or Profile could go here in the future */}
      <div className="hidden md:block p-4 border-t border-white/5 text-center text-xs text-slate-500">
        Ütopik OS v1.0
      </div>
    </div>
  );
}
