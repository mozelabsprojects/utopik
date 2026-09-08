"use client";

import { useState } from "react";
import { PETITIONS } from "@/lib/petitions";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

export default function PetitionsModal({
  gameId,
  activePetitionsJson,
  onUpdate
}: {
  gameId: string;
  activePetitionsJson: string;
  onUpdate: () => void;
}) {
  const [loading, setLoading] = useState(false);

  let activePetitionIds: string[] = [];
  try {
    activePetitionIds = JSON.parse(activePetitionsJson);
  } catch (e) {}

  if (activePetitionIds.length === 0) return null;

  const handleAction = async (petitionId: string, action: "accept" | "reject") => {
    setLoading(true);
    try {
      const res = await fetch("/api/game/petition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, petitionId, action })
      });
      if (res.ok) {
        onUpdate();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activePetitions = PETITIONS.filter(p => activePetitionIds.includes(p.id));
  if (activePetitions.length === 0) return null;

  // Sadece en üstteki dilekçeyi göster
  const petition = activePetitions[0];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
      <div className="relative w-[90vw] sm:w-80 h-96 flex flex-col items-center justify-center">
        <div className="absolute top-4 text-center text-white/50 text-xs uppercase tracking-widest font-bold">
          {activePetitions.length} Bekleyen Dilekçe
        </div>
        
        <AnimatePresence mode="popLayout">
          <SwipeableCard
            key={petition.id}
            petition={petition}
            loading={loading}
            onAccept={() => handleAction(petition.id, "accept")}
            onReject={() => handleAction(petition.id, "reject")}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

function SwipeableCard({ petition, loading, onAccept, onReject }: any) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  const acceptOpacity = useTransform(x, [0, 100], [0, 1]);
  const rejectOpacity = useTransform(x, [0, -100], [0, 1]);

  const handleDragEnd = (e: any, info: any) => {
    if (loading) return;
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset > 100 || velocity > 500) {
      onAccept();
    } else if (offset < -100 || velocity < -500) {
      onReject();
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.8, y: 50, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.2 } }}
      className="absolute w-full h-72 bg-slate-800 border-2 border-slate-700 shadow-2xl rounded-2xl p-6 flex flex-col justify-between cursor-grab active:cursor-grabbing"
    >
      {/* Etiketler (Kabul/Red) */}
      <motion.div style={{ opacity: acceptOpacity }} className="absolute top-4 left-4 border-2 border-green-500 text-green-500 font-bold px-3 py-1 rounded-lg transform -rotate-12 text-2xl z-10 pointer-events-none">
        KABUL
      </motion.div>
      <motion.div style={{ opacity: rejectOpacity }} className="absolute top-4 right-4 border-2 border-red-500 text-red-500 font-bold px-3 py-1 rounded-lg transform rotate-12 text-2xl z-10 pointer-events-none">
        RED
      </motion.div>

      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">📝</span>
          <h4 className="font-[family-name:var(--font-display)] font-bold text-slate-100 text-lg leading-tight">
            {petition.title}
          </h4>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{petition.description}</p>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={(e) => { e.stopPropagation(); onReject(); }}
          disabled={loading}
          className="flex-1 bg-red-600/20 hover:bg-red-600 border border-red-500/50 text-red-400 hover:text-white transition-colors text-sm font-bold py-3 rounded-xl disabled:opacity-50"
        >
          Sola Kaydır (Red)
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onAccept(); }}
          disabled={loading}
          className="flex-1 bg-green-600/20 hover:bg-green-600 border border-green-500/50 text-green-400 hover:text-white transition-colors text-sm font-bold py-3 rounded-xl disabled:opacity-50"
        >
          Sağa Kaydır (Kabul)
        </button>
      </div>
    </motion.div>
  );
}
