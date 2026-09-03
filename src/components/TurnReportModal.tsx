"use client";

interface TurnReportModalProps {
  reports: string[];
  onClose: () => void;
}

export default function TurnReportModal({ reports, onClose }: TurnReportModalProps) {
  if (!reports || reports.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-strong rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.15)]">
        
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-cyan-900/40 to-transparent">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">📋</span> Tur Sonu Raporu
          </h2>
          <p className="text-gray-400 text-sm mt-1">Geçtiğimiz turun mali ve siyasi bilançosu</p>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
          {reports.map((report, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-xl border whitespace-pre-line ${
                report.includes("⚠️") || report.includes("🚨") || report.includes("☠️") || report.includes("📉") 
                  ? "bg-red-500/10 border-red-500/20 text-red-100" 
                  : report.includes("✅") || report.includes("💰") 
                  ? "bg-green-500/10 border-green-500/20 text-green-100"
                  : "bg-white/5 border-white/10 text-gray-200"
              }`}
            >
              {report}
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-white/10 bg-black/20">
          <button 
            onClick={onClose}
            className="w-full btn-primary py-3 text-lg"
          >
            Anladım, tamam.
          </button>
        </div>
      </div>
    </div>
  );
}
