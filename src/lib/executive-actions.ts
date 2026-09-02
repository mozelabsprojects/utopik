import { GameState, StatEffects } from "./types";

export type ExecutiveActionId = "lobbying" | "propaganda" | "crackdown" | "diplomatic_pressure" | "education_campaign" | "military_drill" | "resource_mobilization";

export interface ExecutiveAction {
  id: ExecutiveActionId;
  name: string;
  description: string;
  cost: number; // PC cost
  effects: StatEffects;
  icon: string;
}

export const EXECUTIVE_ACTIONS: Record<ExecutiveActionId, ExecutiveAction> = {
  lobbying: {
    id: "lobbying",
    name: "Lobi Faaliyeti",
    description: "Sermayedarlara tavizler vererek hazineye sıcak para akışı sağlayın. Ancak enflasyon artar ve halk öfkelenir.",
    cost: 40,
    effects: { budget: 3000, happiness: -15, stability: -5, inflation: 1 },
    icon: "💼"
  },
  propaganda: {
    id: "propaganda",
    name: "Ulusal Propaganda",
    description: "Devlet bütçesini algı operasyonlarına harcayarak halk desteğini anında artırın. Dış dünyada itibar kaybına yol açar.",
    cost: 50,
    effects: { happiness: 10, popularity: 15, stability: 10, budget: -1500, foreignRelations: -10 },
    icon: "📺"
  },
  crackdown: {
    id: "crackdown",
    name: "Sokaklara Müdahale",
    description: "Polis gücüyle muhalif sesleri bastırarak istikrarı zorla sağlayın. Seçmen desteği düşer.",
    cost: 60,
    effects: { stability: 30, happiness: -15, popularity: -15, foreignRelations: -5 },
    icon: "🛡️"
  },
  diplomatic_pressure: {
    id: "diplomatic_pressure",
    name: "Uluslararası Kulis",
    description: "Yurtdışındaki lobi şirketlerini kullanarak ülkenizin diplomatik itibarını anında toparlayın.",
    cost: 65,
    effects: { foreignRelations: 25, budget: -2500 },
    icon: "🤝"
  },
  education_campaign: {
    id: "education_campaign",
    name: "Teknoloji Seferberliği",
    description: "Gençleri yurtdışı Ar-Ge programlarına göndererek eğitim seviyesini ve teknoloji gücünü artırın.",
    cost: 70,
    effects: { education: 20, tech: 10, budget: -2500 },
    icon: "🎓"
  },
  military_drill: {
    id: "military_drill",
    name: "Geniş Çaplı Tatbikat",
    description: "Sınırda veya uluslararası sularda büyük bir gövde gösterisi yapın. Askeri gücünüz ve milliyetçi ruh artar, ama dış dünyayı tedirgin edersiniz.",
    cost: 55,
    effects: { military: 20, popularity: 10, stability: 10, foreignRelations: -15, budget: -1500, energy: -20 },
    icon: "🪖"
  },
  resource_mobilization: {
    id: "resource_mobilization",
    name: "Ulusal Kaynak Seferberliği",
    description: "Tüm özel madenlere, gıda depolarına ve enerji santrallerine geçici olarak el koyun. Bütün kaynaklar tıka basa dolar, ancak ekonomi ve halk ağır yara alır.",
    cost: 80,
    effects: { energy: 40, food: 40, materials: 40, happiness: -25, stability: -15, environment: -10, inflation: 2 },
    icon: "🏭"
  }
};

