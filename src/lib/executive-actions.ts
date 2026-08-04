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
    description: "Sermayedarlara bazı politik tavizler vererek hazineye anında sıcak para akışı sağlayın.",
    cost: 30,
    effects: { budget: 4000 },
    icon: "💼"
  },
  propaganda: {
    id: "propaganda",
    name: "Propaganda Kampanyası",
    description: "Devlet medyasını kullanarak halkın hükümete olan güvenini ve mutluluğunu anında artırın.",
    cost: 25,
    effects: { happiness: 10 },
    icon: "📺"
  },
  crackdown: {
    id: "crackdown",
    name: "Sokaklara Müdahale",
    description: "Polis gücüyle muhalif sesleri bastırarak istikrarı zorla sağlayın, ancak halkı kızdırın.",
    cost: 35,
    effects: { stability: 15, happiness: -5 },
    icon: "🛡️"
  },
  diplomatic_pressure: {
    id: "diplomatic_pressure",
    name: "Uluslararası Kulis",
    description: "Yurtdışındaki lobi şirketlerini kullanarak ülkenizin diplomatik itibarını anında toparlayın.",
    cost: 40,
    effects: { foreignRelations: 15 },
    icon: "🤝"
  },
  education_campaign: {
    id: "education_campaign",
    name: "Kariyer Seferberliği",
    description: "Gençleri meslek edindirme kurslarına zorunlu yönlendirerek eğitim seviyesini anında artırın.",
    cost: 35,
    effects: { education: 8 },
    icon: "🎓"
  }
};
