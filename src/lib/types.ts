// =============================================
// YourUtopia — Core Type Definitions
// =============================================

export interface MarketState {
  prices: { energy: number; food: number; tech: number };
  inventory: { energy: number; food: number; tech: number };
}

export type EventCategory =
  | "ekonomi"
  | "kriz"
  | "dis_politika"
  | "ic_politika"
  | "cevre"
  | "askeri"
  | "sosyal";

export type Sector =
  | "military"
  | "health"
  | "education"
  | "environment"
  | "stability"
  | "foreignRelations";

export type Difficulty = "Kolay" | "Orta" | "Zor" | "Çok Zor";

export interface StatEffects {
  budget?: number;
  military?: number;
  happiness?: number;
  health?: number;
  environment?: number;
  education?: number;
  stability?: number;
  foreignRelations?: number;
  popularity?: number;
  politicalCapital?: number;
}

import { FactionId } from "./factions";

export interface Choice {
  label: string; // "A", "B", "C", "D"
  text: string;
  effects: StatEffects;
  factionEffects?: Partial<Record<FactionId, number>>;
  flagsToSet?: string[]; // Kelebek Etkisi: Bu seçim yapılırsa hangi bayraklar eklenecek
  hint: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  choices: Choice[];
  requiredFlags?: string[]; // Sadece bu bayraklar varsa tetiklenir
  forbiddenFlags?: string[]; // Bu bayraklar varsa ASLA tetiklenmez
  condition?: (state: GameState) => boolean; // Belirli stat şartlarına göre tetiklenmesi için
}

export interface CountryTemplate {
  name: string;
  flag: string;
  budget: number;
  military: number;
  happiness: number;
  health: number;
  environment: number;
  education: number;
  stability: number;
  foreignRelations: number;
  difficulty: Difficulty;
  description: string;
}

export interface GameState {
  id: string;
  countryName: string;
  turn: number;
  budget: number;
  military: number;
  happiness: number;
  health: number;
  environment: number;
  education: number;
  stability: number;
  foreignRelations: number;
  
  popularity: number;
  politicalCapital: number;
  activeQuests: string;
  nextElectionTurn: number;

  turnReports: string;
  activeCrises: string;
  factions: string;
  activeLaws: string;
  megaProjects: string;
  ministers: string;
  activePetitions: string;
  diplomacyState: string;
  marketState: string;

  isGameOver: boolean;
  gameOverReason: string | null;
  isBankrupt: boolean;
  bankruptTurns: number;
  currentEventId: string | null;
  usedEventIds?: string;
  eventFlags?: string; // JSON string array of flags
}

export interface TurnResult {
  taxIncome: number;
  maintenanceCost: number;
  dominoEffects: DominoEffect[];
  tradeIncome: number;
  newEvents: GameEvent[];
  gameState: GameState;
}

export interface DominoEffect {
  type: string;
  description: string;
  statChanges: StatEffects;
}

export interface InvestmentRequest {
  gameId: string;
  sector: Sector;
  amount: number;
}

export interface WorldCountryState {
  id: string;
  name: string;
  budget: number;
  military: number;
  happiness: number;
  health: number;
  environment: number;
  education: number;
  stability: number;
  foreignRelations: number;
  isPlayer: boolean;
}

export interface TradeDeal {
  id: string;
  partnerName: string;
  incomePerTurn: number;
  turnsRemaining: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  targetSector: Sector | "budget" | "popularity";
  targetValue: number; // e.g. reach 80 health
  turnsRemaining: number;
  rewardText: string;
  rewardEffects: StatEffects;
}

export const STAT_LABELS: Record<string, string> = {
  budget: "Bütçe",
  military: "Askeri Güç",
  happiness: "Halk Mutluluğu",
  health: "Sağlık",
  environment: "Çevre",
  education: "Eğitim",
  stability: "İstikrar",
  foreignRelations: "Dış İlişkiler",
  popularity: "Başkanlık Desteği",
  politicalCapital: "Siyasi Sermaye",
};

export const STAT_ICONS: Record<string, string> = {
  budget: "💰",
  military: "⚔️",
  happiness: "😊",
  health: "🏥",
  environment: "🌿",
  education: "📚",
  stability: "🏛️",
  foreignRelations: "🌍",
  popularity: "👑",
  politicalCapital: "📜",
};

export const SECTOR_LABELS: Record<Sector, string> = {
  military: "Askeri Güç",
  health: "Sağlık Altyapısı",
  education: "Eğitim & Ar-Ge",
  environment: "Çevre & Sürdürülebilirlik",
  stability: "İç Güvenlik",
  foreignRelations: "Diplomasi",
};
