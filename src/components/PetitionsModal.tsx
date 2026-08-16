"use client";

import { useState } from "react";
import { PETITIONS } from "@/lib/petitions";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <div className="fixed top-20 right-2 md:top-24 md:right-4 z-50 flex flex-col gap-3 w-[90vw] sm:w-72 md:w-80 max-h-[75vh] overflow-y-auto hide-scrollbar pb-4">
      <AnimatePresence>
        {activePetitions.map(petition => (
          <motion.div
            key={petition.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className="bg-slate-800 border-l-4 border-yellow-500 shadow-2xl rounded-lg p-4"
          >
            <div className="flex items-start gap-2 mb-2">
              <span className="text-xl">📝</span>
              <h4 className="font-bold text-slate-100 text-sm leading-tight">
                Vatandaş Dilekçesi:<br/> {petition.title}
              </h4>
            </div>
            <p className="text-xs text-slate-400 mb-3">{petition.description}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleAction(petition.id, "accept")}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-1.5 rounded disabled:opacity-50"
              >
                Kabul Et
              </button>
              <button
                onClick={() => handleAction(petition.id, "reject")}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-1.5 rounded disabled:opacity-50"
              >
                Reddet
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
