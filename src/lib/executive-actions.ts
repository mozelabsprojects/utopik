import { GameState, StatEffects } from "./types";

export type ExecutiveActionId = "lobbying" | "propaganda" | "crackdown" | "diplomatic_pressure" | "education_campaign";

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
    description: "Sermayedarlara devlet ihalelerinde ve yasalarda tavizler vererek hazineye anında sıcak para akışı sağlayın. Ancak yolsuzluk söylentileri halkı öfkelendirir.",
    cost: 50,
    effects: { budget: 5000, happiness: -10 },
    icon: "💼"
  },
  propaganda: {
    id: "propaganda",
    name: "Propaganda Kampanyası",
    description: "Devlet bütçesini devasa algı operasyonlarına harcayarak halk desteğini ve mutluluğunu anında artırın. Dış dünyada otoriter bir algı yaratır.",
    cost: 45,
    effects: { happiness: 15, budget: -1500, foreignRelations: -5 },
    icon: "📺"
  },
  crackdown: {
    id: "crackdown",
    name: "Sokaklara Müdahale",
    description: "Polis gücüyle muhalif sesleri bastırarak istikrarı zorla sağlayın. Halk öfkelenir ve dış dünyadan tepki çeker.",
    cost: 60,
    effects: { stability: 25, happiness: -10, foreignRelations: -5 },
    icon: "🛡️"
  },
  diplomatic_pressure: {
    id: "diplomatic_pressure",
    name: "Uluslararası Kulis",
    description: "Yurtdışındaki lobi şirketlerini kullanarak ülkenizin diplomatik itibarını anında toparlayın. Bu işlem hazineye çok pahalıya mal olur.",
    cost: 75,
    effects: { foreignRelations: 20, budget: -3000 },
    icon: "🤝"
  },
  education_campaign: {
    id: "education_campaign",
    name: "Kariyer Seferberliği",
    description: "Gençleri mesleki edindirme kurslarına ve yurtdışı eğitim programlarına göndererek eğitim seviyesini anında artırın. Bütçeden çok büyük bir pay ayrılır.",
    cost: 65,
    effects: { education: 15, budget: -2000 },
    icon: "🎓"
  }
};
