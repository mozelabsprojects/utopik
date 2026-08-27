"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function ImhaEasterEgg() {
  const [triggered, setTriggered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let keyBuffer = "";
    const targetSequence = "imha";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (triggered) return;

      keyBuffer += e.key.toLowerCase();
      if (keyBuffer.length > targetSequence.length) {
        keyBuffer = keyBuffer.slice(-targetSequence.length);
      }

      if (keyBuffer === targetSequence) {
        setTriggered(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggered]);

  if (!mounted || !triggered) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-black overflow-hidden font-black">
      {/* Kırmızı Çakar Efekti */}
      <div className="absolute inset-0 animate-pulse bg-red-700/50 pointer-events-none mix-blend-overlay z-0"></div>
      
      {/* Kayan Yazılar (Meme Efektleri) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 opacity-80 text-white text-9xl whitespace-nowrap drop-shadow-[0_0_20px_red]">
        <div className="fly-text-1 absolute top-[10%] left-[-100%] text-red-500">ŞİİR</div>
        <div className="fly-text-2 absolute top-[30%] right-[-100%] text-yellow-500">ADAM</div>
        <div className="fly-text-3 absolute top-[50%] left-[-100%] text-orange-500">CREEDU</div>
        <div className="fly-text-4 absolute top-[70%] right-[-100%] text-red-500">ŞİİR</div>
        <div className="fly-text-5 absolute top-[85%] left-[-100%] text-yellow-500">ADAM</div>
      </div>

      {/* Ekran Sallantısı ve İçerik (Daha hafif sallantı) */}
      <div className="animate-mild-shake flex flex-col items-center w-full max-w-4xl px-4 relative z-30">
        <div className="bg-red-950/90 border-8 border-red-600 p-6 rounded-3xl shadow-[0_0_150px_rgba(255,0,0,1)] w-full text-center deep-fried-visuals">
          <h1 className="text-6xl md:text-8xl text-red-500 mb-4 tracking-tighter uppercase flex items-center justify-center gap-4 scale-y-150 drop-shadow-[0_0_10px_black]">
            <span className="animate-ping">⚠️</span> 
            İMHA PROTOKOLÜ 
            <span className="animate-ping">⚠️</span>
          </h1>
          
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border-4 border-red-500 shadow-2xl bg-black my-8">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/IFDAfSPXzNc?autoplay=1&rel=0&controls=0"
              title="İmha Easter Egg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
            {/* Boosted ses efekti için ekstra gizli iframe'ler (Aynı anda çalarak sesi katlarlar) */}
            <iframe className="hidden" src="https://www.youtube.com/embed/IFDAfSPXzNc?autoplay=1" allow="autoplay"></iframe>
            <iframe className="hidden" src="https://www.youtube.com/embed/IFDAfSPXzNc?autoplay=1" allow="autoplay"></iframe>
          </div>
          
          <button 
            onClick={() => setTriggered(false)}
            className="mt-4 bg-red-700 hover:bg-red-500 text-white font-black text-2xl py-4 px-12 rounded-xl uppercase tracking-widest border-b-8 border-red-900 active:border-b-0 active:translate-y-2 transition-all drop-shadow-xl hover:scale-110"
          >
            SİSTEMİ KURTAR
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes mildShake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-3px, -3px) rotate(-0.5deg); }
          50% { transform: translate(3px, -1px) rotate(0.5deg); }
          75% { transform: translate(-1px, 3px) rotate(-0.5deg); }
        }
        .animate-mild-shake {
          animation: mildShake 0.15s infinite;
        }

        .deep-fried-visuals {
          filter: contrast(150%) saturate(200%);
        }

        @keyframes flyRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(300vw); }
        }
        @keyframes flyLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-300vw); }
        }

        .fly-text-1 { animation: flyRight 3s linear infinite; }
        .fly-text-2 { animation: flyLeft 2.5s linear infinite; }
        .fly-text-3 { animation: flyRight 4s linear infinite; }
        .fly-text-4 { animation: flyLeft 3.5s linear infinite; }
        .fly-text-5 { animation: flyRight 2s linear infinite; }
      `}</style>
    </div>,
    document.body
  );
}
