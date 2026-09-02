import { FactionId } from "./factions";
import { GameState, StatEffects } from "./types";

export type PolicyId = "free_healthcare" | "martial_law" | "tax_cuts" | "green_energy" | "censorship" | "welfare_state" | "conscription_expansion" | "military_modernization" | "education_reform" | "open_borders" | "resource_nationalization" | "digital_economy";

export interface Policy {
  id: PolicyId;
  name: string;
  description: string;
  politicalCost: number;
  factionImpactOnEnact: Partial<Record<FactionId, number>>;
  passiveEffects: StatEffects;
  passiveFactionEffects?: Partial<Record<FactionId, number>>;
}

export const POLICIES: Record<PolicyId, Policy> = {
  free_healthcare: {
    id: "free_healthcare",
    name: "Ücretsiz Sağlık Sistemi",
    description: "Tüm vatandaşlara bedava sağlık hizmeti. Her tur Sağlık +3, Mutluluk +2. Pandemi krizini çözer.",
    politicalCost: 80,
    factionImpactOnEnact: { workers: 15, capitalists: -10 },
    passiveEffects: { budget: -800, health: 3, happiness: 2 }
  },
  martial_law: {
    id: "martial_law",
    name: "Sıkıyönetim",
    description: "Ordu sokaklara iner. Her tur İstikrar +4, ancak Mutluluk -3 ve Eğitim -1.",
    politicalCost: 100,
    factionImpactOnEnact: { military: 20, nationalists: 10, intellectuals: -25, workers: -15 },
    passiveEffects: { stability: 4, happiness: -3, education: -1, budget: -500 },
    passiveFactionEffects: { intellectuals: -2, workers: -1 }
  },
  tax_cuts: {
    id: "tax_cuts",
    name: "Sermaye Vergi İndirimi",
    description: "Şirket vergileri düşürülür. Her tur Bütçe +2000 ve İstikrar +2, ancak Mutluluk -1.",
    politicalCost: 60,
    factionImpactOnEnact: { capitalists: 25, workers: -15 },
    passiveEffects: { budget: 2000, stability: 2, happiness: -1 }
  },
  green_energy: {
    id: "green_energy",
    name: "Yeşil Enerji Dönüşümü",
    description: "Fosil yakıtlar yasaklanır. Her tur Çevre +3 ve Enerji +5, ancak Bütçe -1000.",
    politicalCost: 90,
    factionImpactOnEnact: { intellectuals: 20, capitalists: -20 },
    passiveEffects: { environment: 3, energy: 5, happiness: 1, budget: -1000 }
  },
  censorship: {
    id: "censorship",
    name: "Medya Sansürü",
    description: "Muhalif sesler susturulur. Her tur İstikrar +3, ancak Eğitim -2 ve Dış İlişkiler -1.",
    politicalCost: 70,
    factionImpactOnEnact: { intellectuals: -30, nationalists: 10, military: 5 },
    passiveEffects: { stability: 3, education: -2, foreignRelations: -1, budget: -100 },
    passiveFactionEffects: { intellectuals: -1 }
  },
  welfare_state: {
    id: "welfare_state",
    name: "Sosyal Yardım Ağı",
    description: "Yoksullukla mücadele. Her tur Mutluluk +3 ve İstikrar +2, ancak Bütçe -1200.",
    politicalCost: 90,
    factionImpactOnEnact: { workers: 25, capitalists: -15 },
    passiveEffects: { budget: -1200, happiness: 3, stability: 2 }
  },
  conscription_expansion: {
    id: "conscription_expansion",
    name: "Zorunlu Askerlik Uzatımı",
    description: "Askerlik süresi uzatılır. Her tur Askeriye +3, ancak Mutluluk -2.",
    politicalCost: 70,
    factionImpactOnEnact: { military: 20, nationalists: 15, workers: -10, intellectuals: -15 },
    passiveEffects: { military: 3, happiness: -2, stability: 1, budget: -400 },
    passiveFactionEffects: { military: 1, intellectuals: -1 }
  },
  military_modernization: {
    id: "military_modernization",
    name: "Askeri Modernizasyon",
    description: "Ordunun teçhizatı yenilenir. Her tur Askeriye +3 ve Dış İlişkiler +1, ancak Bütçe -1500.",
    politicalCost: 85,
    factionImpactOnEnact: { military: 25, capitalists: 10, intellectuals: -10 },
    passiveEffects: { military: 3, foreignRelations: 1, budget: -1500 }
  },
  education_reform: {
    id: "education_reform",
    name: "Eğitim Reformu",
    description: "Eğitim sistemi baştan yenilenir. Her tur Eğitim +3, ancak Bütçe -1000.",
    politicalCost: 75,
    factionImpactOnEnact: { intellectuals: 25, workers: 5, nationalists: -10 },
    passiveEffects: { education: 3, budget: -1000, happiness: 1 },
    passiveFactionEffects: { intellectuals: 1 }
  },
  open_borders: {
    id: "open_borders",
    name: "Açık Kapı Politikası",
    description: "Sınırlar açılır, göç teşvik edilir. Her tur Dış İlişkiler +3, ancak İstikrar -2.",
    politicalCost: 80,
    factionImpactOnEnact: { capitalists: 15, intellectuals: 10, nationalists: -25, workers: -10 },
    passiveEffects: { foreignRelations: 3, budget: 800, stability: -2, happiness: -1 },
    passiveFactionEffects: { nationalists: -2 }
  },
  resource_nationalization: {
    id: "resource_nationalization",
    name: "Maden ve Enerji Kamulaştırma",
    description: "Doğal kaynaklar devlet kontrolüne alınır. Her tur Enerji +5 ve Materyal +5, ancak Dış İlişkiler -2.",
    politicalCost: 95,
    factionImpactOnEnact: { workers: 20, nationalists: 15, capitalists: -30 },
    passiveEffects: { energy: 5, materials: 5, foreignRelations: -2, budget: -500 },
    passiveFactionEffects: { capitalists: -2 }
  },
  digital_economy: {
    id: "digital_economy",
    name: "Dijital Ekonomi Dönüşümü",
    description: "E-ticaret ve fintech teşvik edilir. Her tur Bütçe +1500 ve Eğitim +1, ancak İstikrar -1.",
    politicalCost: 70,
    factionImpactOnEnact: { capitalists: 20, intellectuals: 15, workers: -10 },
    passiveEffects: { budget: 1500, education: 1, stability: -1 },
    passiveFactionEffects: { capitalists: 1 }
  }
};
