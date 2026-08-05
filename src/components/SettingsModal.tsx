"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  uiScale: number;
  setUiScale: (scale: number) => void;
}

export default function SettingsModal({ isOpen, onClose, uiScale, setUiScale }: SettingsModalProps) {
  const [localScale, setLocalScale] = useState(uiScale);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundVolume, setSoundVolume] = useState(100);

  // Easter Egg State
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalScale(uiScale);
    const savedSound = localStorage.getItem("utopik_sound_enabled");
    if (savedSound === "true") setSoundEnabled(true);
    
    const savedVolume = localStorage.getItem("utopik_sound_volume");
    if (savedVolume) setSoundVolume(parseInt(savedVolume, 10));
  }, [uiScale, isOpen]);

  const handleApply = () => {
    setUiScale(localScale);
    localStorage.setItem("utopik_ui_scale", localScale.toString());
    localStorage.setItem("utopik_sound_enabled", soundEnabled.toString());
    localStorage.setItem("utopik_sound_volume", soundVolume.toString());
    
    // Play a test sound if enabled
    if (soundEnabled) {
      import('@/lib/audio').then(module => module.playClickSound());
    }
    
    onClose();
  };

  const handleSoundToggleClick = () => {
    const now = Date.now();
    
    if (now - lastClickTime < 1000) {
      // 1 saniye içinde tekrar tıklanmış
      const newCount = clickCount + 1;
      setClickCount(newCount);
      
      if (newCount >= 10) {
        setShowEasterEgg(true);
        setClickCount(0); // Reset after trigger
      }
    } else {
      // 1 saniyeden uzun sürmüş, sıfırla
      setClickCount(1);
    }
    
    setLastClickTime(now);
    setSoundEnabled(!soundEnabled);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-premium border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-[family-name:var(--font-display)] text-white mb-6 flex items-center gap-2">
              <span className="text-cyan-400">⚙️</span> Ayarlar
            </h2>

            <div className="space-y-6">
              {/* UI Scale Setting */}
              <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-slate-200">Ekran Büyüklüğü (Yakınlaştırma)</h3>
                    <p className="text-xs text-slate-400">Oyun arayüzünün boyutunu cihazınıza göre ayarlayın.</p>
                  </div>
                  <div className="text-cyan-400 font-bold bg-cyan-500/10 px-2 py-1 rounded-md">
                    {localScale}%
                  </div>
                </div>
                
                <input
                  type="range"
                  min="60"
                  max="140"
                  step="10"
                  value={localScale}
                  onChange={(e) => setLocalScale(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>%60</span>
                  <span>%100</span>
                  <span>%140</span>
                </div>
              </div>

              {/* Audio Setting */}
              <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 transition-colors">
                <div 
                  className="flex justify-between items-center mb-4 cursor-pointer select-none"
                  onClick={handleSoundToggleClick}
                >
                  <div>
                    <h3 className="font-bold text-slate-200">Ses Efektleri</h3>
                    <p className="text-xs text-slate-400">UI tıklamaları ve kriz anı sesleri.</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{soundEnabled ? "🔊" : "🔇"}</span>
                    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${soundEnabled ? 'bg-cyan-500' : 'bg-slate-700'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                </div>

                {soundEnabled && (
                  <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-bold text-slate-300">Ses Seviyesi</h4>
                      <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">%{soundVolume}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={soundVolume}
                      onChange={(e) => setSoundVolume(parseInt(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                )}
              </div>

            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                Uygula
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* EASTER EGG OVERLAY */}
      {showEasterEgg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.1 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-black/95 backdrop-blur-3xl"
        >
          <div className="bg-red-600 animate-pulse text-white font-black text-6xl md:text-8xl p-10 rounded-3xl shadow-[0_0_100px_rgba(220,38,38,1)] border-8 border-yellow-400 rotate-[-5deg] mb-10 uppercase tracking-widest text-center">
            PİÇİ SOY
          </div>

          <div className="w-full max-w-2xl aspect-video rounded-xl overflow-hidden border-4 border-white shadow-2xl">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&modestbranding=1" 
              title="Never Gonna Give You Up" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>

          <button 
            onClick={() => setShowEasterEgg(false)}
            className="mt-10 px-8 py-4 bg-white text-black font-bold text-xl rounded-full hover:bg-gray-200 transition-all hover:scale-110"
          >
            Tamam Sustur Şunu 😅
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
