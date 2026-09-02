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
    description: "Sağlık ve çevre sisteminin çökmesiyle virüsler yayıldı. Çözüm: Sağlık seviyesini 50'nin üzerine çıkarın veya Ücretsiz Sağlık Sistemi yasasını geçirin.",
    triggerCondition: (state, factions, laws = []) => (state.health < 20 && state.environment < 30) && !(state.health > 50 || laws.includes("free_healthcare")),
    resolutionCondition: (state, laws) => state.health > 50 || laws.includes("free_healthcare"),
    passiveEffects: { health: -2, happiness: -3, budget: -500 }
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

export type QuestId = "please_workers" | "boost_military" | "economic_boom" | "green_country" | "global_power" | "education_reform";

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
    description: "Ordu, 10 tur içinde Askeri gücün 75'in üzerine çıkarılmasını istiyor.",
    deadlineTurns: 10,
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
  },
  economic_boom: {
    id: "economic_boom",
    title: "Ekonomik Mucize Hedefi",
    description: "Sermayedarlar, ülkenin hazinesini 15 tur içinde $100.000 seviyesine çıkarmanızı bekliyor.",
    deadlineTurns: 15,
    condition: (state) => state.budget >= 100000,
    onSuccess: (factions, state) => ({
      newFactions: modifyFactionSupport(factions, { capitalists: 30 }),
      newState: { ...state, politicalCapital: state.politicalCapital + 50 },
      message: "Ekonomik mucizeyi gerçekleştirdiniz! Hazine doldu, siyasi gücünüz zirvede."
    }),
    onFailure: (factions, state) => ({
      newFactions: modifyFactionSupport(factions, { capitalists: -40 }),
      newState: { ...state, stability: Math.max(0, state.stability - 15) },
      message: "Ekonomik hedeflere ulaşılamadı. Yatırımcılar ülkeyi terk etmeye başladı."
    })
  },
  green_country: {
    id: "green_country",
    title: "Yeşil Dönüşüm Kampanyası",
    description: "Aydınlar ve çevreciler, 10 tur içinde Çevre seviyesinin 80'in üzerine çıkması için baskı yapıyor.",
    deadlineTurns: 10,
    condition: (state) => state.environment >= 80,
    onSuccess: (factions, state) => ({
      newFactions: modifyFactionSupport(factions, { intellectuals: 30 }),
      newState: { ...state, happiness: Math.min(100, state.happiness + 10) },
      message: "Yeşil dönüşüm tamamlandı! Doğa nefes aldı, halk mutlu."
    }),
    onFailure: (factions, state) => ({
      newFactions: modifyFactionSupport(factions, { intellectuals: -40 }),
      newState: { ...state, happiness: Math.max(0, state.happiness - 10) },
      message: "Çevre politikalarınız yetersiz bulundu. Büyük iklim protestoları başladı."
    })
  },
  global_power: {
    id: "global_power",
    title: "Küresel Güç Vizyonu",
    description: "Milliyetçiler, uluslararası arenada itibarımızın artırılmasını istiyor. 8 tur içinde Dış İlişkileri 80'e çıkarın.",
    deadlineTurns: 8,
    condition: (state) => state.foreignRelations >= 80,
    onSuccess: (factions, state) => ({
      newFactions: modifyFactionSupport(factions, { nationalists: 20 }),
      newState: { ...state, budget: state.budget + 20000, stability: Math.min(100, state.stability + 10) },
      message: "Küresel bir diplomatik güç olduk! Yabancı yatırımlar ($20.000) ülkeye aktı."
    }),
    onFailure: (factions, state) => ({
      newFactions: modifyFactionSupport(factions, { nationalists: -30 }),
      newState: { ...state, popularity: Math.max(0, state.popularity - 10) },
      message: "Uluslararası arenada yalnızlaştık. Milliyetçiler hükümetin dış politikasını eleştiriyor."
    })
  },
  education_reform: {
    id: "education_reform",
    title: "Eğitim Reformu",
    description: "Halk, okulların modernizasyonunu bekliyor. 5 tur içinde Eğitim seviyesini 70'in üzerine taşıyın.",
    deadlineTurns: 5,
    condition: (state) => state.education >= 70,
    onSuccess: (factions, state) => ({
      newFactions: modifyFactionSupport(factions, { workers: 15, intellectuals: 15 }),
      newState: { ...state, politicalCapital: state.politicalCapital + 20 },
      message: "Eğitim reformu başarıyla tamamlandı. Gelecek nesiller umut vaat ediyor."
    }),
    onFailure: (factions, state) => ({
      newFactions: modifyFactionSupport(factions, { workers: -20, intellectuals: -20 }),
      newState: { ...state, popularity: Math.max(0, state.popularity - 10) },
      message: "Eğitim sistemi çökmüş durumda. Aileler ve aydınlar öfkeli."
    })
  }
};
