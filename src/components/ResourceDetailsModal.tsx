"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface ResourceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceId: "energy" | "food" | "materials" | "popularity" | "politicalCapital" | null;
  value: number;
}

export default function ResourceDetailsModal({ isOpen, onClose, resourceId, value }: ResourceDetailsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !resourceId || !mounted) return null;

  let title = "";
  let icon = "";
  let description = "";
  let mechanics = "";
  let effects = "";
  let abundance = "";
  let crisis = "";

  switch (resourceId) {
    case "energy":
      title = "Enerji";
      icon = "⚡";
      description = "Ülkenin endüstriyel ve teknolojik gücünü yansıtan temel kaynak.";
      mechanics = "Enerjiniz Eğitim ve İstikrar yüksekse artar; ancak devasa ordu ve nüfus çok fazla enerji tüketir. Mega projeleri inşa etmek için yüksek miktarda enerji gerekir.";
      effects = "Eğer 0'a düşerse elektrikler kesilir, bütçe inanılmaz zarar görür ve istikrar hızla düşer.";
      abundance = "Eğer 90'ın üzerindeyse (Enerji Bolluğu), fazla enerjiyi satıp bütçe kazanırsınız ve eğitim kaliteniz artar.";
      crisis = "Borsadan satın alın veya enerji üreten yasalar çıkarın.";
      break;
    case "food":
      title = "Gıda";
      icon = "🍞";
      description = "Halkın temel besin kaynağı. Aç bir halk isyan eder.";
      mechanics = "Gıda üretimi Çevre kalitesine bağlıdır. Nüfus arttıkça gıda tüketimi katlanarak artar.";
      effects = "Eğer 0'a düşerse Açlık Krizi başlar. Sağlık ve Mutluluk her tur -5 düşer.";
      abundance = "Eğer 90'ın üzerindeyse (Gıda Bolluğu), sağlık ve mutluluk her tur +1 artar.";
      crisis = "Borsadan satın alın, çevreye yatırım yapın veya ithalat anlaşmaları imzalayın.";
      break;
    case "materials":
      title = "Materyal";
      icon = "⛏️";
      description = "Sanayi, inşaat ve ordu için gerekli ağır hammadde rezervi.";
      mechanics = "Dış ilişkileriniz iyiyse ithalat yoluyla daha rahat üretilir. Ordu ve çevre koruma projeleri çok fazla materyal tüketir.";
      effects = "Eğer 0'a düşerse ordu bakımı yapılamaz (Askeriye -5) ve inşaatlar durduğu için Eğitim (-2) düşer.";
      abundance = "Eğer 90'ın üzerindeyse (Materyal Bolluğu), bol hammadde sayesinde Askeriye ve İstikrar her tur +1 artar.";
      crisis = "Borsadan satın alın veya Dış İlişkileri geliştirerek daha fazla malzeme ithal edin.";
      break;
    case "popularity":
      title = "Popülarite";
      icon = "👑";
      description = "Halkın size olan kişysel sevgisi ve güveni.";
      mechanics = "Toplumdaki tüm fraksiyonların (İşçiler, Kapitalistler, Aydınlar vb.) desteklerinin ortalaması alınarak hesaplanır.";
      effects = "Popülariteniz çok düşükse (<30) Siyasi Sermaye (PC) kazanamazsınız ve yasaları geçiremezsiniz.";
      abundance = "Popülariteniz yüksekse (>80), halk sizi koşulsuz destekler ve normalden %50 daha fazla Siyasi Sermaye (PC) kazanırsınız.";
      crisis = "Popülariteyi artırmak için halkı mutlu eden kararlar alın ve fraksiyonların isteklerini yerine getirin.";
      break;
    case "politicalCapital":
      title = "Siyasi Sermaye (PC)";
      icon = "📜";
      description = "Meclisten yasa geçirmek, krizleri çözmek ve bakan atamak için harcanan siyasi güç.";
      mechanics = "Oyunun zorluk seviyesine ve Popülaritenize bağlı olarak her tur otomatik kazanılır.";
      effects = "Eğer tükenirse, mecliste eliniz kolunuz bağlanır, hiçbir politika uygulayamazsınız.";
      abundance = "Daha fazla siyasi sermaye, ülkeyi çok daha hızlı ve radikal şekilde değiştirmenize olanak tanır.";
      crisis = "Kazanamıyorsanız Popülaritenizi artırmaya çalışın veya size Siyasi Sermaye getiren özel Kriz kararlarını seçin.";
      break;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
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
                  {title}
                </h2>
                <div className={`text-sm font-bold uppercase tracking-widest ${value < 20 ? 'text-red-400' : value > 80 ? 'text-green-400' : 'text-[var(--color-accent-primary)]'}`}>
                  Durum: {value < 20 ? 'Kritik' : value > 80 ? 'Bolluk' : 'Normal'}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Mevcut Seviye</span>
                <span className={`text-2xl font-black ${value < 20 ? 'text-red-400' : value > 80 ? 'text-green-400' : 'text-white'}`}>
                  {resourceId === 'politicalCapital' ? value : `%${Math.round(value)}`}
                </span>
              </div>
              
              {resourceId !== 'politicalCapital' && (
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${value >= 50 ? 'bg-[var(--color-accent-primary)]' : 'bg-red-500'}`} 
                    style={{ width: `${Math.max(0, Math.min(100, value))}%` }} 
                  />
                </div>
              )}
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {description}
            </p>

            <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/5 space-y-3">
              <div className="flex gap-3 items-start">
                <span className="text-[var(--color-accent-secondary)] mt-0.5">⚙️</span>
                <p className="text-sm text-slate-300"><strong className="text-slate-100 block mb-0.5">Mekanik:</strong> {mechanics}</p>
              </div>
              
              <div className="w-full h-px bg-white/5" />
              
              <div className="flex gap-3 items-start">
                <span className="text-red-400 mt-0.5">⚠️</span>
                <p className="text-sm text-slate-300"><strong className="text-red-400 block mb-0.5">Tehlike:</strong> {effects}</p>
              </div>
              
              <div className="w-full h-px bg-white/5" />
              
              <div className="flex gap-3 items-start">
                <span className="text-green-400 mt-0.5">✅</span>
                <p className="text-sm text-slate-300"><strong className="text-green-400 block mb-0.5">Bolluk:</strong> {abundance}</p>
              </div>
              
              <div className="w-full h-px bg-white/5" />
              
              <div className="flex gap-3 items-start">
                <span className="text-yellow-400 mt-0.5">💡</span>
                <p className="text-sm text-slate-300"><strong className="text-yellow-400 block mb-0.5">Ne Yapmalı:</strong> {crisis}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
