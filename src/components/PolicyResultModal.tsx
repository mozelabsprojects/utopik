"use client";

import { motion, AnimatePresence } from "framer-motion";

interface PolicyResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  success: boolean;
  title: string;
  message: string;
}

export default function PolicyResultModal({
  isOpen,
  onClose,
  success,
  title,
  message
}: PolicyResultModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50, rotateX: 20 }}
          animate={{ scale: 1, y: 0, rotateX: 0 }}
          exit={{ scale: 0.8, y: 50, opacity: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative max-w-md w-full rounded-2xl p-8 shadow-2xl border-2 overflow-hidden ${
            success 
              ? "bg-gradient-to-br from-green-900/90 to-emerald-900/90 border-green-500/50 shadow-green-500/20" 
              : "bg-gradient-to-br from-red-900/90 to-rose-900/90 border-red-500/50 shadow-red-500/20"
          }`}
        >
          {/* Oylama Mührü Dekoru */}
          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
            <span className="text-[150px]">{success ? "✓" : "✗"}</span>
          </div>

          <div className="text-center relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                success ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              }`}
            >
              <span className="text-4xl">{success ? "⚖️" : "💥"}</span>
            </motion.div>
            
            <h2 className={`text-3xl font-black mb-2 uppercase tracking-widest ${
              success ? "text-green-300" : "text-red-300"
            }`}>
              {title}
            </h2>
            
            <div className="h-px w-16 mx-auto mb-6 bg-white/20" />
            
            <p className="text-slate-200 text-lg leading-relaxed mb-8 font-medium">
              {message}
            </p>
            
            <button
              onClick={onClose}
              className={`w-full py-3 px-6 rounded-xl font-bold tracking-widest uppercase transition-all ${
                success 
                  ? "bg-green-500 hover:bg-green-400 text-slate-900 shadow-[0_0_15px_rgba(34,197,94,0.4)]" 
                  : "bg-red-500 hover:bg-red-400 text-slate-900 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              }`}
            >
              Devam Et
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
