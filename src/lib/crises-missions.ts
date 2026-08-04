import { FactionId, FactionsState, modifyFactionSupport } from "./factions";
import { GameState } from "./types";
import { PolicyId } from "./policies";

export type CrisisId = "economic_depression" | "civil_unrest" | "pandemic" | "military_coup_threat";

export interface Crisis {
  id: CrisisId;
  name: string;
  description: string;
  triggerCondition: (state: GameState, factions: FactionsState, activeLaws: PolicyId[]) => boolean;
  resolutionCondition: (state: GameState, activeLaws: PolicyId[], factions: FactionsState) => boolean;
  passiveEffects: {
    budget?: number;
    stability?: number;
    happiness?: number;
    health?: number;
  };
}

export const CRISES: Record<CrisisId, Crisis> = {
  economic_depression: {
    id: "economic_depression",
    name: "Ekonomik Buhran",
    description: "Bütçe uzun süre ekside kaldığı için piyasalar kilitlendi. Her tur bütçeniz ve istikrarınız daha da kan kaybediyor. Çözüm: Bütçeyi 5000'in üzerine çıkarın veya Sermaye Vergi İndirimi yasasını geçirin.",
    triggerCondition: (state, factions, laws = []) => state.budget < -10000 && !(state.budget > 5000 || laws.includes("tax_cuts")),
    resolutionCondition: (state, laws) => state.budget > 5000 || laws.includes("tax_cuts"),
    passiveEffects: { budget: -1500, stability: -2 }
  },
  civil_unrest: {
    id: "civil_unrest",
    name: "Sivil İtaatsizlik ve Protestolar",
    description: "Halk ve işçiler sokaklara döküldü. Çözüm: Mutluluğu 50'nin üzerine çıkarın veya Sıkıyönetim ilan edin.",
    triggerCondition: (state, factions, laws = []) => (state.happiness < 25 || factions.workers.support < 20) && !(state.happiness > 50 || laws.includes("martial_law")),
    resolutionCondition: (state, laws) => state.happiness > 50 || laws.includes("martial_law"),
    passiveEffects: { stability: -4, budget: -500 }
  },
  pandemic: {
    id: "pandemic",
    name: "Salgın Hastalık (Pandemi)",
    description: "Sağlık ve çevre sisteminin çökmesiyle ölümcül bir virüs yayıldı. Çözüm: Sağlık seviyesini 70'in üzerine çıkarın veya Ücretsiz Sağlık Sistemi yasasını geçirin.",
    triggerCondition: (state, factions, laws = []) => (state.health < 25 && state.environment < 40) && !(state.health > 70 || laws.includes("free_healthcare")),
    resolutionCondition: (state, laws) => state.health > 70 || laws.includes("free_healthcare"),
    passiveEffects: { health: -5, happiness: -3, budget: -1000 }
  },
  military_coup_threat: {
    id: "military_coup_threat",
    name: "Askeri Darbe Tehdidi",
    description: "Ordu yönetime el koymaya hazırlanıyor! Çözüm: Askeriyenin desteğini %50'nin üzerine çıkarın veya Sıkıyönetim ilan ederek onlara yetki verin.",
    triggerCondition: (state, factions, laws = []) => factions.military.support < 15 && !(factions.military.support > 50 || laws.includes("martial_law")),
    resolutionCondition: (state, laws, factions) => factions.military.support > 50 || laws.includes("martial_law"),
    passiveEffects: { stability: -5 }
  }
};

export type QuestId = "please_workers" | "boost_military";

export interface Quest {
  id: QuestId;
  title: string;
  description: string;
  deadlineTurns: number;
  condition: (state: GameState, factions: FactionsState) => boolean;
  onSuccess: (factions: FactionsState, state: GameState) => { newFactions: FactionsState, newState: GameState, message: string };
  onFailure: (factions: FactionsState, state: GameState) => { newFactions: FactionsState, newState: GameState, message: string };
}

// Side Quests
export const QUESTS: Record<QuestId, Quest> = {
  please_workers: {
    id: "please_workers",
    title: "İşçi Sendikalarının Talebi",
    description: "İşçiler, önümüzdeki 3 tur içinde Sağlık seviyesinin 60'ın üzerine çıkmasını talep ediyor.",
    deadlineTurns: 3,
    condition: (state) => state.health >= 60,
    onSuccess: (factions, state) => ({
      newFactions: modifyFactionSupport(factions, { workers: 20 }),
      newState: { ...state, politicalCapital: state.politicalCapital + 10 },
      message: "İşçilerin talebini yerine getirdiniz! Destekleri arttı."
    }),
    onFailure: (factions, state) => ({
      newFactions: modifyFactionSupport(factions, { workers: -30, capitalists: 10 }),
      newState: { ...state, stability: Math.max(0, state.stability - 10) },
      message: "İşçilerin talebini görmezden geldiniz. Sendikalar greve gitti! İstikrar düştü."
    })
  },
  boost_military: {
    id: "boost_military",
    title: "Ordunun Modernizasyonu",
    description: "Ordu, 4 tur içinde Askeri gücün 75'in üzerine çıkarılmasını istiyor.",
    deadlineTurns: 4,
    condition: (state) => state.military >= 75,
    onSuccess: (factions, state) => ({
      newFactions: modifyFactionSupport(factions, { military: 25, nationalists: 10 }),
      newState: { ...state },
      message: "Ordu modernize edildi, generaller size minnettar."
    }),
    onFailure: (factions, state) => ({
      newFactions: modifyFactionSupport(factions, { military: -30 }),
      newState: { ...state, popularity: Math.max(0, state.popularity - 10) },
      message: "Ordunun isteklerini reddettiniz. Generaller size güvenmiyor."
    })
  }
};
