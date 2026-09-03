// =============================================
// YourUtopia — Core Type Definitions
// =============================================

export interface MarketPrices {
  energy: number;
  food: number;
  tech: number;
  medical: number;
  arms: number;
  minerals: number;
}

export interface MarketState {
  prices: MarketPrices;
  inventory: MarketPrices;
  history: {
    turn: number;
    prices: MarketPrices;
  }[];
  trends?: {
    [key in keyof MarketPrices]?: {
      direction: 'up' | 'down' | 'flat';
      turnsRemaining: number;
    }
  };
  activeExpertLevel?: number; // 0: None, 1: Stajyer, 2: Çaylak, 3: Kıdemli, 4: Wall Street Kurdu
  expertTurnsRemaining?: number;
  expertVisibleKeys?: string[];
  lastBoughtTurn?: {
    [key in keyof MarketPrices]?: number;
  };
}

export interface DiplomacyState {
  westernRelations: number; // 0-100 (NATO/Batı İttifakı)
  easternRelations: number; // 0-100 (Doğu Bloku)
  activeEmbargoes: string[]; // e.g., "west", "east"
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

export type Difficulty = "Kolay" | "Dengeli" | "Zor" | "Çok Zor";

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
  energy?: number;
  food?: number;
  materials?: number;
  tech?: number;
  inflation?: number;
  westernRelations?: number;
  easternRelations?: number;
}

import { FactionId } from "./factions";

export interface SnowballEffect {
  id: string;
  name: string;
  themeColor: string; // e.g., 'red', 'purple', 'yellow'
  description: string;
  turnsRemaining: number;
  statModifiers: StatEffects;
}

export interface Choice {
  label: string; // "A", "B", "C", "D"
  text: string;
  effects: StatEffects;
  factionEffects?: Partial<Record<FactionId, number>>;
  marketEffects?: Partial<Record<keyof MarketPrices, number>>;
  flagsToSet?: string[]; // Kelebek Etkisi: Bu seçim yapılırsa hangi bayraklar eklenecek
  hint: string;
  requiredMinister?: string; // Bu seçenek sadece bu bakan ID'si kabinenizde varsa aktif olur
  triggerSnowball?: SnowballEffect; // Eğer bu şık seçilirse kartopu etkisi başlat
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
  minTurn?: number; // Hangi turdan sonra çıkabileceği (Oyun zorluk eğrisi)
  isSnowball?: boolean; // Bu event'in özel renkli bir Kartopu Eventi olup olmadığı
}

export interface CountryTemplate {
  name: string;
  flag: string;
  population: number; // Milyon cinsinden
  budget: number;
  military: number;
  happiness: number;
  health: number;
  environment: number;
  education: number;
  stability: number;
  foreignRelations: number;
  energy?: number;
  food?: number;
  materials?: number;
  regime?: "Demokrasi" | "Otokrasi";
  difficulty: Difficulty;
  description: string;
  alignment?: "western" | "eastern" | "neutral";
}

export interface GameState {
  id: string;
  countryName: string;
  turn: number;
  population: number;
  budget: number;
  military: number;
  happiness: number;
  health: number;
  environment: number;
  education: number;
  stability: number;
  foreignRelations: number;
  
  // Resources
  energy: number;
  food: number;
  materials: number;

  popularity: number;
  politicalCapital: number;
  activeQuests: string;
  nextElectionTurn: number;

  turnReports: string;
  activeCrises: string;
  factions: string;
  activeLaws: string;
  historicalData?: string;
  megaProjects: string;
  ministers: string;
  activePetitions: string;
  diplomacyState: string;
  marketState: string;
  researchPoints: number;
  unlockedTechs: string;
  inflation: number;
  activeBonds: string;

  isGameOver: boolean;
  gameOverReason: string | null;
  isBankrupt: boolean;
  bankruptTurns: number;
  currentEventId: string | null;
  usedEventIds?: string;
  eventFlags?: string; // JSON string array of flags
  achievements?: string; // JSON string array of unlocked achievements
  activeSnowballEffect?: string; // JSON string of SnowballEffect or "null"
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAtTurn?: number;
}

export interface HistoryRecord {
  turn: number;
  budget: number;
  population: number;
  inflation: number;
  stability: number;
  happiness: number;
  taxIncome?: number;
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
  alignment: "western" | "eastern" | "neutral";
  isPlayer: boolean;
}

export interface Bond {
  id: string;
  amount: number;
  interestRate: number;
  totalToRepay: number;
  turnIssued: number;
  duration: number; // in turns
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
  failureText?: string;
  failureEffects?: StatEffects;
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
