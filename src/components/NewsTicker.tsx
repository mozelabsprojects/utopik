"use client";

import React, { useState, useEffect } from "react";
import { GameState } from "@/lib/types";
import { generateNews } from "@/lib/news-generator";

interface NewsTickerProps {
  gameState: GameState;
}

export default function NewsTicker({ gameState }: NewsTickerProps) {
  const [newsList, setNewsList] = useState<string[]>([]);

  useEffect(() => {
    // Generate news whenever the turn changes
    const generated = generateNews(gameState);
    setNewsList(generated);
  }, [gameState.turn]);

  if (newsList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-8 bg-black/80 backdrop-blur-md border-t border-white/10 z-[40] flex items-center overflow-hidden">
      <div className="bg-cyan-500/20 text-cyan-400 font-bold px-4 h-full flex items-center border-r border-cyan-500/30 whitespace-nowrap z-10 shrink-0 uppercase tracking-widest text-xs">
        <span className="mr-2 animate-pulse text-red-500">●</span> CANLI
      </div>
      
      <div className="flex-1 overflow-hidden relative h-full">
        <div className="absolute whitespace-nowrap h-full flex items-center animate-ticker will-change-transform">
          {/* We duplicate the list to make the loop seamless */}
          {[...newsList, ...newsList].map((news, index) => (
            <span key={index} className="mx-8 text-slate-300 text-sm">
              {news}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
