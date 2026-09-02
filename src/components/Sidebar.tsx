"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";

export type SidebarTab = 
  | "dashboard" 
  | "decisions" 
  | "crises" 
  | "ministers" 
  | "factions" 
  | "policies" 
  | "bank"
  | "market"
  | "tech"
  | "projects" 
  | "world" 
  | "diplomacy"
  | "analytics"; // Yeni sekme

interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}

type MenuFolder = {
  id: string;
  label: string;
  icon: string;
  items: { id: SidebarTab; label: string; icon: string; className?: string }[];
};

const MENU_FOLDERS: MenuFolder[] = [
  {
    id: "management",
    label: "Yönetim",
    icon: "🏛️",
    items: [
      { id: "dashboard", label: "Ana Merkez", icon: "📊", className: "tutorial-dashboard" },
      { id: "decisions", label: "Kararlar", icon: "📜", className: "tutorial-event" },
      { id: "crises", label: "Krizler", icon: "⚠️", className: "tutorial-crises" },
    ]
  },
  {
    id: "politics",
    label: "Siyaset",
    icon: "⚖️",
    items: [
      { id: "ministers", label: "Kabine", icon: "👔", className: "tutorial-ministers" },
      { id: "factions", label: "Toplum", icon: "👥", className: "tutorial-factions" },
      { id: "policies", label: "Politikalar", icon: "🗳️", className: "tutorial-policies" },
    ]
  },
  {
    id: "economy",
    label: "Ekonomi",
    icon: "💰",
    items: [
      { id: "bank", label: "Merkez Bankası", icon: "🏦", className: "tutorial-bank" },
      { id: "market", label: "Borsa & Kaynaklar", icon: "📈", className: "tutorial-market" },
      { id: "tech", label: "Ar-Ge & Teknoloji", icon: "🔬", className: "tutorial-tech" },
      { id: "projects", label: "Mega Projeler", icon: "🏗️", className: "tutorial-projects" },
    ]
  },
  {
    id: "foreign",
    label: "Dış Politika",
    icon: "🌍",
    items: [
      { id: "world", label: "Dünya Haritası", icon: "🗺️", className: "tutorial-world" },
      { id: "diplomacy", label: "Diplomasi", icon: "🤝", className: "tutorial-diplomacy" },
    ]
  },
  {
    id: "analytics",
    label: "Analiz",
    icon: "📉",
    items: [
      { id: "analytics", label: "Tarihçe & Grafikler", icon: "📉" },
    ]
  }
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  // Varsayılan olarak aktif sekmenin bulunduğu klasörü açık tut
  const initialOpenFolder = MENU_FOLDERS.find(f => f.items.some(i => i.id === activeTab))?.id || "management";
  const [pinnedFolders, setPinnedFolders] = useState<string[]>([initialOpenFolder]);
  const [hoveredFolders, setHoveredFolders] = useState<string[]>([]);

  const toggleFolder = (folderId: string) => {
    setPinnedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId) 
        : [...prev, folderId]
    );
  };

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

      {/* Menu Folders */}
      <div className="flex-1 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto hide-scrollbar p-2 md:p-3 flex flex-row md:flex-col gap-2 md:space-y-2">
        {MENU_FOLDERS.map((folder) => {
          const hasActiveChild = folder.items.some(item => item.id === activeTab);
          const isOpen = pinnedFolders.includes(folder.id) || hoveredFolders.includes(folder.id) || hasActiveChild;

          return (
            <div 
              key={folder.id} 
              className="flex flex-col shrink-0 min-w-fit md:min-w-0"
              onMouseEnter={() => setHoveredFolders(prev => Array.from(new Set([...prev, folder.id])))}
              onMouseLeave={() => setHoveredFolders(prev => prev.filter(id => id !== folder.id))}
            >
              {/* Folder Header (Desktop Hoverable, Mobile only icon) */}
              <button
                onClick={() => toggleFolder(folder.id)}
                className={`hidden md:flex w-full items-center justify-between px-3 py-2 rounded-lg transition-colors duration-200 ${
                  hasActiveChild && !isOpen ? "bg-white/5 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{folder.icon}</span>
                  <span className={`text-xs font-bold uppercase tracking-wider ${hasActiveChild && !isOpen ? 'text-[var(--color-accent-primary)]' : ''}`}>
                    {folder.label}
                  </span>
                </div>
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {/* Items in Folder */}
              <AnimatePresence initial={false}>
                {(isOpen || typeof window !== 'undefined' && window.innerWidth < 768) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="flex flex-row md:flex-col gap-1 md:gap-1 md:pl-2 md:mt-1 overflow-hidden"
                  >
                    {folder.items.map((item) => {
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => onTabChange(item.id)}
                          className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-2 px-3 py-2 md:px-3 md:py-2.5 rounded-xl transition-all duration-300 relative group overflow-hidden ${item.className || ""} ${
                            isActive
                              ? "bg-[var(--color-accent-glow)] text-[var(--color-accent-primary)] border border-[var(--color-accent-primary)]/50 shadow-[0_0_15px_rgba(var(--color-accent-primary-rgb),0.2)]"
                              : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-main)] border border-transparent"
                          }`}
                        >
                          {isActive && (
                            <motion.div 
                              layoutId="sidebar-active-indicator"
                              className="absolute top-0 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 md:top-0 md:bottom-0 w-1/2 h-1 md:w-1 md:h-auto bg-[var(--color-accent-primary)] shadow-none"
                            />
                          )}
                          
                          <span className={`text-lg md:text-base transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                            {item.icon}
                          </span>
                          <span className={`font-medium text-[10px] md:text-sm whitespace-nowrap tracking-wide ${isActive ? "font-bold" : ""}`}>
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="hidden md:block p-4 border-t border-white/5 text-center text-xs text-slate-500">
        Ütopik OS v1.0
      </div>
    </div>
  );
}
