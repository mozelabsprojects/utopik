"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameState } from "@/lib/types";
import PartyLogo from "./PartyLogo";

interface NewspaperIntroProps {
  game: any;
  onComplete: () => void;
}

export default function NewspaperIntro({ game, onComplete }: NewspaperIntroProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    console.log("📰 NewspaperIntro mounted!");
    // 5 saniye sonra animasyonu bitir
    const timer = setTimeout(() => {
      console.log("📰 NewspaperIntro fading out...");
      setShow(false);
      setTimeout(onComplete, 1000); // fade out için 1 saniye bekle
    }, 5000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
        >
          <motion.div
            initial={{ scale: 0, rotate: -720 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 40, delay: 0.5 }}
            className="w-full max-w-2xl bg-[#e5d9c5] shadow-[0_0_50px_rgba(255,255,255,0.2)] p-8 md:p-12 relative overflow-hidden"
            style={{
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/old-wall.png")',
            }}
          >
            {/* Eskitilmiş gazete efektleri */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#b59b72] opacity-50 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-30 pointer-events-none" />
            
            <div className="relative z-10 text-center flex flex-col items-center">
              <h1 className="text-4xl md:text-6xl font-black text-[#2a2a2a] uppercase tracking-tighter mb-2 font-serif border-b-4 border-double border-[#2a2a2a] pb-4 w-full">
                ÜTOPİA POSTASI
              </h1>
              
              <div className="flex justify-between w-full text-xs font-bold text-[#555] uppercase tracking-widest border-b border-[#2a2a2a] pb-2 mb-8">
                <span>{new Date().toLocaleDateString('tr-TR')}</span>
                <span>ÖZEL BASIM</span>
                <span>FİYAT: 5 ¢</span>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
                {(() => {
                  const LEADER_AVATARS = [
                    { id: "leader_1", row: 0, col: 0 },
                    { id: "leader_2", row: 0, col: 1 },
                    { id: "leader_3", row: 0, col: 2 },
                    { id: "leader_4", row: 1, col: 0 },
                    { id: "leader_5", row: 1, col: 1 },
                    { id: "leader_6", row: 1, col: 2 },
                  ];
                  const PARTY_LOGOS_DATA = [
                    { id: "logo_bulb", col: 0 },
                    { id: "logo_arrows", col: 1 },
                    { id: "logo_crescent", col: 2 },
                    { id: "logo_phoenix", col: 3 },
                    { id: "logo_scales", col: 4 },
                    { id: "logo_wheat", col: 5 },
                    { id: "logo_shield", col: 6 },
                  ];
                  const avatar = LEADER_AVATARS.find(a => a.id === game.presidentAvatar);
                  const logo = PARTY_LOGOS_DATA.find(l => l.id === game.partyLogo);
                  
                  return (
                    <>
                      <div 
                        className="w-32 h-32 rounded-sm border-2 border-[#555] shadow-inner shrink-0 transform -rotate-3"
                        style={
                          avatar ? {
                            backgroundImage: 'url("/assets/leader_portraits.jpg")',
                            backgroundSize: '300%',
                            backgroundPosition: `${avatar.col * 50}% ${avatar.row * 100}%`,
                          } : {
                            backgroundColor: '#d5c5ad',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '4.5rem',
                          }
                        }
                      >
                        {!avatar && <span>{game.presidentAvatar || "👤"}</span>}
                      </div>
                    </>
                  );
                })()}
                
                <div className="text-left">
                  <h2 className="text-3xl md:text-5xl font-black text-[#2a2a2a] uppercase leading-none mb-4 font-serif">
                    {game.presidentName || "YENİ LİDER"}, {game.countryName || "ÜLKENİN"} BAŞKANI OLDU!
                  </h2>
                  <h3 className="text-xl font-bold text-[#333] italic mb-4 flex items-center gap-3 flex-wrap">
                    <PartyLogo logoId={game.partyLogo} color={game.partyColor || '#3b82f6'} size={52} className="shadow-md shrink-0 border-2 border-[#444]" />
                    <span className="text-2xl font-black text-[#2a2a2a] not-italic underline decoration-amber-700/40">
                      {game.partyName || "Bağımsız Parti"}
                    </span>
                    <span className="text-base text-[#444] font-medium">iktidara yürürken, halk yeni dönemi coşkuyla karşılıyor.</span>
                  </h3>
                </div>
              </div>

              <div className="columns-1 md:columns-2 gap-8 text-justify text-[#333] text-sm leading-relaxed font-serif">
                <p className="mb-4">
                  Aylardır süren siyasi çalkantıların ardından nihayet beklenen gün geldi. {game.countryName} halkı yeni liderini seçti. 
                  Sokaklarda sevinç gösterileri düzenlenirken, bir yandan da geleceğe dair belirsizlikler devam ediyor. 
                  Ülkenin ekonomik ve askeri durumu göz önüne alındığında yeni hükümetin omuzlarında ağır bir yük var.
                </p>
                <p>
                  İlk açıklamalarında reform sözü veren {game.presidentName}, ülkeyi hak ettiği seviyeye taşıyacaklarını belirtti. 
                  Uluslararası arenada dengelerin değişeceği bu yeni dönemde tüm dünyanın gözü {game.countryName} üzerinde. 
                  Tarih bu anı unutmayacak...
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
