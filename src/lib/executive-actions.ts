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
    description: "Sermayedarlara bazı politik tavizler vererek hazineye anında sıcak para akışı sağlayın. Halk bu duruma tepki gösterir.",
    cost: 50,
    effects: { budget: 4000, happiness: -10, stability: -5 },
    icon: "💼"
  },
  propaganda: {
    id: "propaganda",
    name: "Propaganda Kampanyası",
    description: "Devlet medyasını kullanarak halkın hükümete olan güvenini ve mutluluğunu anında artırın. Aydınlar ve dünya basını size sırt çevirir.",
    cost: 45,
    effects: { happiness: 12, education: -10, foreignRelations: -5 },
    icon: "📺"
  },
  crackdown: {
    id: "crackdown",
    name: "Sokaklara Müdahale",
    description: "Polis gücüyle muhalif sesleri bastırarak istikrarı zorla sağlayın. Halk öfkelenir ve uluslararası ambargo tehlikesi doğar.",
    cost: 60,
    effects: { stability: 20, happiness: -15, foreignRelations: -10 },
    icon: "🛡️"
  },
  diplomatic_pressure: {
    id: "diplomatic_pressure",
    name: "Uluslararası Kulis",
    description: "Yurtdışındaki lobi şirketlerini kullanarak ülkenizin diplomatik itibarını anında toparlayın. Bu işlem hazineye çok pahalıya mal olur.",
    cost: 75,
    effects: { foreignRelations: 15, budget: -3000 },
    icon: "🤝"
  },
  education_campaign: {
    id: "education_campaign",
    name: "Kariyer Seferberliği",
    description: "Gençleri zorunlu meslek edindirme kurslarına yönlendirerek eğitim seviyesini anında artırın. Ancak devlet bütçesi sarsılır ve gençler mutsuz olur.",
    cost: 65,
    effects: { education: 10, budget: -2000, happiness: -5 },
    icon: "🎓"
  }
};
