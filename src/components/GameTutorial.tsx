"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GameTutorialProps {
  activeTab: string;
  setActiveTab: (tab: "overview" | "world" | "politics") => void;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
  turn?: number;
}

import { SidebarTab } from "@/components/Sidebar";

const TUTORIAL_STEPS = [
  {
    title: "🏛️ Başkanlığa Hoş Geldiniz!",
    icon: "👑",
    tab: "dashboard" as SidebarTab,
    target: "", // Modal welcome step
    description:
      "Sayın Başkan, Ütopik simülasyonuna hoş geldiniz. Ülkenizi başarıyla yönetmek, krizleri aşmak ve dengeleri korumak için hızlı bir tura çıkalım."
  },
  {
    title: "📊 Ana Merkez & Göstergeler",
    icon: "📈",
    tab: "dashboard" as SidebarTab,
    target: ".tutorial-dashboard",
    description:
      "Ana Merkezde 7 temel göstergeyi (Askeri Güç, Mutluluk, Sağlık, Çevre, Eğitim, İstikrar, Dış İlişkiler), nüfusu ve bütçeyi takip edersiniz. Göstergelerin kritik seviyelere düşmesi halkı isyana sürükleyebilir!"
  },
  {
    title: "⚖️ Kararlar & Yatırımlar",
    icon: "📜",
    tab: "decisions" as SidebarTab,
    target: ".tutorial-event",
    description:
      "Her tur masanıza ülkenin geleceğini şekillendirecek bir Olay kartı gelir. Seçimlerinizi dikkatli yapın; her kararın kelebek etkisi vardır. Olayı çözdükten sonra kalan bütçenizle sektörel yatırımlar (Eğitim, Sağlık vb.) yapabilirsiniz."
  },
  {
    title: "👔 Kabine Yönetimi",
    icon: "👔",
    tab: "ministers" as SidebarTab,
    target: ".tutorial-ministers",
    description:
      "Siyasi Sermayenizi (📜) kullanarak alanında uzman Bakanlar atayın. Her bakanın size her tur kalıcı getirileri veya kriz anında bonusları olacaktır. Doğru kabine sizi felaketlerden korur."
  },
  {
    title: "👥 Toplum ve Fraksiyonlar",
    icon: "👥",
    tab: "factions" as SidebarTab,
    target: ".tutorial-factions",
    description:
      "Ülkeniz İşçiler, Kapitalistler, Milliyetçiler, Aydınlar gibi çeşitli çıkar gruplarından oluşur. Kararlarınız ve yasalarınız bu grupları memnun edebilir veya kızdırıp darbe/isyan tetikleyebilir."
  },
  {
    title: "⚖️ Politikalar ve Yasalar",
    icon: "⚖️",
    tab: "policies" as SidebarTab,
    target: ".tutorial-policies",
    description:
      "Politik Sermayenizi kullanarak kalıcı yasalar (Örn: Sıkıyönetim, Ücretsiz Sağlık Sistemi) çıkarabilirsiniz. Yasalar hem bütçenizi tüketir hem de fraksiyon desteklerini kalıcı olarak etkiler."
  },
  {
    title: "🏗️ Mega Projeler",
    icon: "🏗️",
    tab: "projects" as SidebarTab,
    target: ".tutorial-projects",
    description:
      "Tarihe geçmek ister misiniz? Yüksek bütçe ve uzun inşaat süreleri gerektiren Mega Projeler (Uzay Ajansı, Nükleer Santral vb.) inşa ederek ülkenize devasa kalıcı bonuslar sağlayabilirsiniz."
  },
  {
    title: "⚠️ Krizler ve Acil Durumlar",
    icon: "⚠️",
    tab: "crises" as SidebarTab,
    target: ".tutorial-crises",
    description:
      "Kötü yönetim; Ekonomik Buhran, Pandemi veya Askeri Darbe gibi krizleri tetikler. Bir kriz patlak verdiğinde çözülene kadar ülkenize her tur ağır hasar verir. Şartlarını yerine getirip derhal çözmelisiniz!"
  },
  {
    title: "🌍 Dünya Haritası",
    icon: "🌐",
    tab: "world" as SidebarTab,
    target: ".tutorial-world",
    description:
      "Sınırlarınızın ötesine bakın. Dünya haritasındaki diğer ülkelerin gücünü, ekonomisini ve liderlerini analiz edip küresel konumunuzu belirleyin."
  },
  {
    title: "📈 Küresel Borsa ve Ekonomi",
    icon: "📈",
    tab: "market" as SidebarTab,
    target: ".tutorial-market",
    description:
      "Dünya piyasasında Enerji, Gıda ve Teknoloji gibi kaynakların fiyatları sürekli değişir. Krizleri fırsata çevirip ucuza alıp pahalıya satarak devasa bir bütçe oluşturabilirsiniz."
  },
  {
    title: "🤝 Diplomasi ve Savaş",
    icon: "🤝",
    tab: "diplomacy" as SidebarTab,
    target: ".tutorial-diplomacy",
    description:
      "Güçlü müttefikler edinin veya zayıf komşularınızı işgal edin. Ancak dikkatli olun; düşmanlarınız da sizin zayıf anınızı kolluyor. Başarı şansınız askeri gücünüze ve iç istikrarınıza bağlıdır."
  }
];

export default function GameTutorial({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  turn = 1
}: {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  isOpen: boolean;
  onClose: () => void;
  turn?: number;
}) {
  const [currentStep, setCurrentStep] = useState(0);

  // Reset step when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  // Handle activeTab switching and element highlighting for steps > 0
  useEffect(() => {
    if (!isOpen) return;

    const step = TUTORIAL_STEPS[currentStep];
    if (step.tab) {
      setActiveTab(step.tab);
    }

    if (step.target) {
      const timer = setTimeout(() => {
        document.querySelectorAll(".tutorial-highlight-glow").forEach((el) => {
          el.classList.remove("tutorial-highlight-glow");
        });

        const targetEl = document.querySelector(step.target);
        if (targetEl) {
          targetEl.classList.add("tutorial-highlight-glow");
          targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 150);

      return () => {
        clearTimeout(timer);
        document.querySelectorAll(".tutorial-highlight-glow").forEach((el) => {
          el.classList.remove("tutorial-highlight-glow");
        });
      };
    } else {
      document.querySelectorAll(".tutorial-highlight-glow").forEach((el) => {
        el.classList.remove("tutorial-highlight-glow");
      });
    }
  }, [isOpen, currentStep, setActiveTab]);

  const handleClose = () => {
    localStorage.setItem("utopik_tutorial_seen", "true");
    document.querySelectorAll(".tutorial-highlight-glow").forEach((el) => {
      el.classList.remove("tutorial-highlight-glow");
    });
    onClose();
  };

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  const step = TUTORIAL_STEPS[currentStep];

  // STEP 0: Welcome Pop-up Modal
  if (currentStep === 0) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-slate-900/95 border-2 border-cyan-500/60 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.3)] relative overflow-hidden text-center"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />
            
            <span className="text-5xl mb-3 block">🏛️</span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-100 mb-2">
              Başkanlığa Hoş Geldiniz!
            </h2>
            <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4">
              Ülkenizin Geleceği Sizin Ellerinizde
            </p>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 mb-6 text-slate-300 text-sm leading-relaxed">
              {step.description}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all"
              >
                Atla / Oyuna Başla
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center gap-2"
              >
                🚀 Turu Başlat
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  // STEPS 1-5: Floating Spotlight Guide Card
  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[480px] z-50 pointer-events-auto">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-slate-900/95 border-2 border-cyan-500/80 rounded-2xl p-5 shadow-[0_0_40px_rgba(6,182,212,0.4)] backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 animate-pulse" />

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{step.icon}</span>
              <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase bg-cyan-950/80 border border-cyan-500/40 px-2.5 py-0.5 rounded-full">
                ADIM {currentStep} / {TUTORIAL_STEPS.length - 1}
              </span>
            </div>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-white text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-md transition-all"
            >
              Kapat ✕
            </button>
          </div>

          <h3 className="text-lg font-bold text-slate-100 mb-2">
            {step.title}
          </h3>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            {step.description}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1">
              {TUTORIAL_STEPS.slice(1).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    currentStep - 1 === idx
                      ? "w-4 bg-cyan-400"
                      : "w-1.5 bg-slate-700"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all"
              >
                Geri
              </button>

              <button
                onClick={handleClose}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-950/30 transition-all"
              >
                Atla
              </button>

              <button
                onClick={handleNext}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              >
                {currentStep === TUTORIAL_STEPS.length - 1
                  ? "Tamamla 🚀"
                  : "İlerle ➔"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
