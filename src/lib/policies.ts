import { FactionId } from "./factions";
import { GameState, StatEffects } from "./types";

export type PolicyId = "free_healthcare" | "martial_law" | "tax_cuts" | "green_energy" | "censorship" | "welfare_state";

export interface Policy {
  id: PolicyId;
  name: string;
  description: string;
  politicalCost: number; // Siyasi sermaye maliyeti (çıkarırken/iptal ederken)
  factionImpactOnEnact: Partial<Record<FactionId, number>>; // Geçirildiğinde fraksiyonlara anlık etki
  passiveEffects: StatEffects;
  passiveFactionEffects?: Partial<Record<FactionId, number>>; // Her tur fraksiyonlara etki
}

export const POLICIES: Record<PolicyId, Policy> = {
  free_healthcare: {
    id: "free_healthcare",
    name: "Ücretsiz Sağlık Sistemi",
    description: "Tüm vatandaşlara bedava sağlık hizmeti. İşçileri sevindirir, bütçeyi sarsar.",
    politicalCost: 80,
    factionImpactOnEnact: { workers: 15, capitalists: -10 },
    passiveEffects: { budget: -500, health: 1, happiness: 1 }
  },
  martial_law: {
    id: "martial_law",
    name: "Sıkıyönetim",
    description: "Ordu sokaklara iner. İstikrar artar ama mutluluk ve özgürlükler biter.",
    politicalCost: 100,
    factionImpactOnEnact: { military: 20, nationalists: 10, intellectuals: -25, workers: -15 },
    passiveEffects: { stability: 3, happiness: -2, budget: -300 },
    passiveFactionEffects: { intellectuals: -2, workers: -1 } // Added to match previous logic
  },
  tax_cuts: {
    id: "tax_cuts",
    name: "Sermaye Vergi İndirimi",
    description: "Şirketlerden alınan vergiler düşürülür. Yatırımları teşvik eder, bütçe açığı yaratır.",
    politicalCost: 60,
    factionImpactOnEnact: { capitalists: 25, workers: -15 },
    passiveEffects: { budget: -500, stability: 2, happiness: 1 }
  },
  green_energy: {
    id: "green_energy",
    name: "Yeşil Enerji Dönüşümü",
    description: "Fosil yakıtlar yasaklanır. Çevreciler coşar, sermaye zarar görür.",
    politicalCost: 90,
    factionImpactOnEnact: { intellectuals: 20, capitalists: -20 },
    passiveEffects: { environment: 1, happiness: 1, budget: -500 }
  },
  censorship: {
    id: "censorship",
    name: "Medya Sansürü",
    description: "Muhalif sesler susturulur. İstikrar korunur ama aydınlar isyan eder.",
    politicalCost: 70,
    factionImpactOnEnact: { intellectuals: -30, nationalists: 10, military: 5 },
    passiveEffects: { stability: 2, happiness: -1, budget: 200 },
    passiveFactionEffects: { intellectuals: -1 }
  },
  welfare_state: {
    id: "welfare_state",
    name: "Sosyal Yardım Ağı",
    description: "Yoksullukla mücadele için taban maaş yardımları.",
    politicalCost: 90,
    factionImpactOnEnact: { workers: 25, capitalists: -15 },
    passiveEffects: { budget: -600, happiness: 1, stability: 1 }
  }
};
