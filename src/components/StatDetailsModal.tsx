"use client";

import { motion, AnimatePresence } from "framer-motion";
import { StatPressure } from "@/lib/game-engine";

interface StatDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  statKey: string;
  label: string;
  value: number;
  icon: string;
  pressures: StatPressure[];
}

export default function StatDetailsModal({
  isOpen,
  onClose,
  statKey,
  label,
  value,
  icon,
  pressures
}: StatDetailsModalProps) {
  const totalPressure = pressures?.reduce((acc, p) => acc + p.value, 0) || 0;

  const getStatusText = () => {
    if (value >= 80) return "Mükemmel";
    if (value >= 60) return "İyi";
    if (value >= 40) return "Ortalama";
    if (value >= 20) return "Kritik";
    return "Çökmüş Durumda";
  };

  const getStatusColor = () => {
    if (value >= 80) return "text-green-400";
    if (value >= 60) return "text-green-300";
    if (value >= 40) return "text-yellow-400";
    if (value >= 20) return "text-red-400";
    return "text-red-600 animate-pulse";
  };

  const getDescription = () => {
    switch (statKey) {
      case "military": return "Silahlı kuvvetlerin kapasitesi, dış tehditlere karşı caydırıcılığınızı ve sınır güvenliğinizi belirler.";
      case "happiness": return "Halkın genel memnuniyeti. Düşük olması isyanlara, yüksek olması verimliliğe yol açar.";
      case "health": return "Sağlık sistemi ve ortalama yaşam süresi. Salgın hastalıklara karşı direncinizi gösterir.";
      case "education": return "Eğitim seviyesi, ülkenizin teknoloji geliştirme (Ar-Ge) hızını ve entelektüel seviyesini doğrudan etkiler.";
      case "environment": return "Çevre kirliliği ve doğa koruma. Düşük çevre puanı sağlık sorunlarına ve uluslararası ambargolara neden olabilir.";
      case "stability": return "İç güvenlik ve devlet otoritesi. Çöktüğü an ülke iflas edebilir veya devrim olabilir.";
      case "foreignRelations": return "Diğer devletlerin size bakış açısı. Ticaret anlaşmalarının kârlılığını belirler.";
      default: return "";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-premium border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl">{icon}</div>
              <div>
                <h2 className="text-2xl font-black font-[family-name:var(--font-display)] text-white uppercase tracking-widest">
                  {label}
                </h2>
                <div className={`text-sm font-bold uppercase tracking-widest ${getStatusColor()}`}>
                  Durum: {getStatusText()}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Mevcut Seviye</span>
                <span className={`text-2xl font-black ${getStatusColor()}`}>%{Math.round(value)}</span>
              </div>
              
              {/* ProgressBar */}
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${value >= 50 ? 'bg-green-500' : 'bg-red-500'}`} 
                  style={{ width: `${Math.max(0, Math.min(100, value))}%` }} 
                />
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {getDescription()}
            </p>

            <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pasif Etkiler (Tur Başına)</h3>
                <span className={`text-sm font-black ${totalPressure > 0 ? 'text-green-400' : totalPressure < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                  {totalPressure > 0 ? '+' : ''}{totalPressure}
                </span>
              </div>

              {pressures.length === 0 ? (
                <div className="text-center text-slate-500 text-xs italic py-2">
                  Şu anda bu değeri etkileyen aktif bir yasa veya kriz yok.
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                  {pressures.map((p, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-slate-300 truncate pr-4">{p.source}</span>
                      <span className={`font-bold shrink-0 ${p.value > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {p.value > 0 ? '+' : ''}{p.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
