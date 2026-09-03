// =============================================
// YourUtopia — Oyun Motoru (Game Engine)
// Tüm hesaplamalar, domino etkileri ve denge
// =============================================
import { StatEffects, DominoEffect, TurnResult, GameState } from "./types";
import { getRandomEvents, EVENTS } from "./events-data";
import { FactionsState, modifyFactionSupport, INITIAL_FACTIONS, FactionId } from "./factions";
import { CRISES, CrisisId, QUESTS, QuestId } from "./crises-missions";
import { POLICIES, PolicyId } from "./policies";
import { MINISTERS, MinisterId } from "./ministers";
import { getRandomPetition } from "./petitions";
import { MEGA_PROJECTS } from "./mega-projects";
import { TECH_TREE, TechId } from "./tech-tree";

// ============================================
// SABITLER
// ============================================
const BASE_INCOME = 3000; // Dengelendi (Eskiden 4500)
const CRITICAL_THRESHOLD = 30;
const BANKRUPTCY_BUDGET_LIMIT = -5000;
const BANKRUPTCY_DURATION = 3;

// ============================================
// A. BAKIM MALİYETLERİ
import { COUNTRIES } from "./countries-data";

export function getDetailedMaintenanceCost(
  military: number, 
  health: number, 
  education: number, 
  environment: number, 
  stability: number, 
  eventFlags: string[] = [], 
  budget: number = 0, 
  difficulty: string = "Orta", 
  unlockedTechs: string[] = [], 
  inflation: number = 5.0, 
  population: number = 10.0,
  factions?: FactionsState
) {
  // Nüfus ölçeklendirmesi: Karesel kök (Square Root) yaklaşımı ve Soft-Cap
  // Maksimum çarpan 3.0 ile sınırlandırıldı (Çin, Hindistan gibi devler iflas etmesin diye)
  let popScale = Math.max(0.8, Math.sqrt(population / 10));
  popScale = Math.min(3.0, popScale);
  
  let militaryCost = military * 8 * popScale;
  let healthCost = health * 6 * popScale;
  let educationCost = education * 6 * popScale;
  let environmentCost = environment * 5 * popScale; // Çevre koruma maliyeti
  
  if (military > 50) militaryCost += Math.pow(military - 50, 1.5) * 2 * popScale; 
  if (health > 50) healthCost += Math.pow(health - 50, 1.5) * 1.5 * popScale;
  if (education > 50) educationCost += Math.pow(education - 50, 1.5) * 1.5 * popScale;
  if (environment > 50) environmentCost += Math.pow(environment - 50, 1.5) * 1 * popScale;

  // Askeriye Fraksiyon Bonusu (>75 Destek) -> Askeri bakımda %15 indirim
  let militaryFactionDiscount = 0;
  if (factions && factions.military && factions.military.support >= 75) {
    militaryFactionDiscount = militaryCost * 0.15;
    militaryCost -= militaryFactionDiscount;
  }

  let total = militaryCost + healthCost + educationCost + environmentCost;
  
  if (unlockedTechs.includes("ai_infrastructure")) {
    total = total * 0.85; // %15 bakım masrafı indirimi
  }
  
  let leaderDiscount = 0;
  if (eventFlags.includes("LEADER_GENERAL")) {
    leaderDiscount = total * 0.2;
    total -= leaderDiscount; 
  }

  let sickPenalty = 0;
  if (health < 40) {
    sickPenalty = (40 - health) * 2 * popScale;
    total += sickPenalty;
  }

  let corruptionPenalty = 0;
  // Yolsuzluk Mekaniği: İstikrar 60'ın altındaysa ceza başlar. Ölüm sarmalını engellemek için max ceza kısıtlandı.
  if (stability < 60) {
    const instabilityFactor = (60 - stability); // 1 ile 60 arası
    // Max ceza stabilitesi 0 iken -> 60 * 5 = 300 * popScale. (Eskiden 15 çarpanı vardı, çok agresifti)
    corruptionPenalty = instabilityFactor * 5 * popScale; 
    
    // Milliyetçiler Fraksiyon Bonusu (>75 Destek) -> Yolsuzluk cezasını %50 azaltır
    if (factions && factions.nationalists && factions.nationalists.support >= 75) {
      corruptionPenalty = corruptionPenalty * 0.5;
    }
    
    total += corruptionPenalty;
  }

  let difficultyMultiplier = 1.0;
  if (difficulty === "Kolay") difficultyMultiplier = 0.8;
  if (difficulty === "Zor") difficultyMultiplier = 1.2;
  if (difficulty === "Çok Zor") difficultyMultiplier = 1.5;

  const baseTotal = total;
  total = total * difficultyMultiplier;

  // Enflasyon Etkisi: %5 enflasyon nötr (veya %5 zamlı), yüksek enflasyon maliyetleri uçurur
  const inflationMultiplier = 1 + (inflation / 100);
  let inflationPenalty = total * (inflationMultiplier - 1);
  total = total * inflationMultiplier;

  return {
    total: Math.round(total),
    militaryCost: Math.round(militaryCost),
    healthCost: Math.round(healthCost),
    educationCost: Math.round(educationCost),
    environmentCost: Math.round(environmentCost),
    leaderDiscount: Math.round(leaderDiscount),
    sickPenalty: Math.round(sickPenalty),
    corruptionPenalty: Math.round(corruptionPenalty),
    inflationPenalty: Math.round(inflationPenalty),
    difficultyMultiplier: Number(difficultyMultiplier.toFixed(2))
  };
}

export function calculateMaintenanceCost(
  military: number, 
  health: number, 
  education: number, 
  environment: number, 
  stability: number, 
  eventFlags: string[] = [], 
  budget: number = 0, 
  difficulty: string = "Orta", 
  unlockedTechs: string[] = [], 
  inflation: number = 5.0, 
  population: number = 10.0,
  factions?: FactionsState
): number {
  return getDetailedMaintenanceCost(military, health, education, environment, stability, eventFlags, budget, difficulty, unlockedTechs, inflation, population, factions).total;
}

// ============================================
// B. VERGİ GELİRİ
// ============================================
export function getDetailedTaxIncome(
  education: number,
  health: number,
  environment: number,
  military: number,
  stability: number,
  happiness: number,
  capitalistsSupport: number,
  eventFlags: string[] = [],
  difficulty: string = "Orta",
  inflation: number = 5.0,
  population: number = 10.0
) {
  // Nüfus ölçeklendirmesi: Karesel kök (Square Root) yaklaşımı ve Soft-Cap
  let popScale = Math.max(0.8, Math.sqrt(population / 10));
  popScale = Math.min(3.0, popScale);

  // Statların kalıcı getiri (Passive Income) sağlaması
  const educationBonus = (education > 50 ? (education - 50) * 25 : 0) * popScale; // İnovasyon
  const healthBonus = (health > 50 ? (health - 50) * 20 : 0) * popScale; // Sağlıklı iş gücü verimliliği
  const environmentBonus = (environment > 50 ? (environment - 50) * 15 : 0) * popScale; // Yeşil ekonomi / Eko Turizm
  const militaryBonus = (military > 60 ? (military - 60) * 12 : 0) * popScale; // Silah sanayisi ihracatı

  const statBonusTotal = educationBonus + healthBonus + environmentBonus + militaryBonus;

  const stabilityMultiplier = 0.5 + (stability / 200); 
  let happinessMultiplier = 0.5 + (happiness / 200); 

  // İFLAS VEYA KRİZ DURUMUNDA ÖLÜM SARMALINI (DEATH SPIRAL) ÖNLEME
  // Eğer mutluluk çok düşükse, minimum vergi çarpanını daha yüksek bir değerde tut.
  if (happiness < 40) {
    happinessMultiplier = Math.max(0.7, happinessMultiplier);
  }

  const capitalistsBonus = capitalistsSupport > 70 ? 1.2 : (capitalistsSupport < 30 ? 0.8 : 1);

  const baseTotal = BASE_INCOME * popScale + statBonusTotal;
  let total = baseTotal * stabilityMultiplier * happinessMultiplier * capitalistsBonus;

  let leaderBonus = 0;
  if (eventFlags.includes("LEADER_ECONOMIST")) {
    leaderBonus = total * 0.25; 
    total += leaderBonus;
  }

  let difficultyMultiplier = 1.0;
  if (difficulty === "Kolay") difficultyMultiplier = 1.2;
  if (difficulty === "Zor") difficultyMultiplier = 0.8;
  if (difficulty === "Çok Zor") difficultyMultiplier = 0.7;

  total = total * difficultyMultiplier;

  // Enflasyon Etkisi: Enflasyon yükseldikçe halkın alım gücü ve vergi geliri DÜŞER
  const inflationPenaltyMultiplier = Math.max(0.5, 1 - (inflation / 100)); // En fazla %50 düşürebilir
  total = total * inflationPenaltyMultiplier;

  return {
    total: Math.round(total),
    baseIncome: Math.round(BASE_INCOME * popScale),
    educationBonus: Math.round(educationBonus),
    healthBonus: Math.round(healthBonus),
    environmentBonus: Math.round(environmentBonus),
    militaryBonus: Math.round(militaryBonus),
    stabilityMultiplier: Number(stabilityMultiplier.toFixed(2)),
    happinessMultiplier: Number(happinessMultiplier.toFixed(2)),
    capitalistsBonus: Number(capitalistsBonus.toFixed(2)),
    leaderBonus: Math.round(leaderBonus),
    multipliersCombined: Number((stabilityMultiplier * happinessMultiplier * capitalistsBonus).toFixed(2)),
    difficultyMultiplier: Number(difficultyMultiplier.toFixed(2)),
    inflationPenaltyMultiplier: Number(inflationPenaltyMultiplier.toFixed(2))
  };
}

export function calculateTaxIncome(
  education: number,
  health: number,
  environment: number,
  military: number,
  stability: number,
  happiness: number,
  capitalistsSupport: number,
  eventFlags: string[] = [],
  difficulty: string = "Orta",
  inflation: number = 5.0,
  population: number = 10.0
): number {
  return getDetailedTaxIncome(education, health, environment, military, stability, happiness, capitalistsSupport, eventFlags, difficulty, inflation, population).total;
}

// ============================================
// HESAPLAMA: NET BÜTÇE BİLANÇOSU
// ============================================
export interface BudgetBreakdown {
  tax: number;
  maintenance: number;
  laws: number;
  techs: number;
  ministers: number;
  crises: number;
  special: number;
  totalNet: number;
}

export function calculateNetBudget(
  state: GameState & { inflation?: number },
  factions: FactionsState,
  activeLaws: string[],
  unlockedTechs: string[],
  ministers: Record<string, string>,
  activeCrises: string[],
  eventFlags: string[] = []
): BudgetBreakdown {
  const countryTemplate = COUNTRIES.find(c => c.name === state.countryName);
  const difficulty = countryTemplate?.difficulty || "Orta";
  const currentInflation = state.inflation !== undefined ? state.inflation : 5.0;

  let tax = calculateTaxIncome(
    state.education, state.health, state.environment, state.military, state.stability, state.happiness, 
    factions.capitalists?.support || 50, eventFlags, difficulty, currentInflation, state.population
  );

  let maintenance = calculateMaintenanceCost(
    state.military, state.health, state.education, state.environment, state.stability, 
    eventFlags, state.budget, difficulty, unlockedTechs, currentInflation, state.population, factions
  );

  let special = 0;
  if (state.countryName === "Kuzey Kore") {
    // Zorunlu askerlik indirimi
    const conscriptionDiscount = Math.round(maintenance * 0.5);
    maintenance -= conscriptionDiscount;
    if (state.stability >= 85) special += 1500; // Juche bonus
  }

  // Mega Proje Bonusları
  let completedProjects: string[] = [];
  try { completedProjects = JSON.parse(state.megaProjects || "[]"); } catch {}
  
  if (completedProjects.includes("nuclear_fusion")) {
    special += 20000; // Sınırsız Enerji (Nükleer Füzyon)
  }

  let laws = 0;
  activeLaws.forEach(lawId => {
    const law = POLICIES[lawId as import("./policies").PolicyId];
    if (law && law.passiveEffects.budget) laws += law.passiveEffects.budget;
  });

  let techs = 0;
  unlockedTechs.forEach(techId => {
    const tech = TECH_TREE[techId as import("./tech-tree").TechId];
    if (tech && tech.passiveEffects?.budget) techs += tech.passiveEffects.budget;
  });

  let ministerEffects = 0;
  Object.values(ministers).forEach(ministerId => {
    const min = MINISTERS[ministerId as import("./ministers").MinisterId];
    if (min && min.passiveEffects.budget) ministerEffects += min.passiveEffects.budget;
  });

  let crises = 0;
  activeCrises.forEach(crisisId => {
    const crisis = CRISES[crisisId as import("./crises-missions").CrisisId];
    if (crisis && crisis.passiveEffects.budget) crises += crisis.passiveEffects.budget;
  });

  const totalNet = tax - maintenance + laws + techs + ministerEffects + crises + special;

  return { tax, maintenance, laws, techs, ministers: ministerEffects, crises, special, totalNet };
}

// ============================================
// C. İLİŞKİ ALGORİTMASI
// ============================================
export function calculateRelationship(player: Pick<GameState, "foreignRelations" | "military" | "stability">, npcCountry: { foreignRelations: number, military: number, stability: number, budget: number }): number {
  // İdeolojik farklılık: Askeri ve İstikrar güçlerindeki farklar yakınlaştıkça (daha benzer ülkeler) ilişki artar.
  const ideologyDiff = Math.abs(player.military - npcCountry.military) + Math.abs(player.stability - npcCountry.stability);
  
  // Zengin ülkeler daha kibirli olabilir, fakir ülkeler daha muhtaç. Küçük bir çarpan.
  const wealthModifier = npcCountry.budget > 6000 ? -5 : (npcCountry.budget < 3000 ? 5 : 0);
  
  // Temel ilişki: Oyuncunun global dış ilişkileri ile ülkenin kendi dış ilişkilerinin ortalaması
  const baseRel = (player.foreignRelations * 0.6) + (npcCountry.foreignRelations * 0.4);
  
  // Formül: Temel ilişki - İdeolojik Farklılığın etkisi + Zenginlik Çarpanı
  const relationship = baseRel - (ideologyDiff * 0.25) + wealthModifier;
  
  return clampStat(relationship);
}

// ============================================
// D. STAT SINIR KONTROLÜ (Clamp 0-100)
// ============================================
export function clampStat(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

// ============================================
// E. OLAY ETKİLERİNİ UYGULA
// ============================================
export function applyEffects(
  state: GameState,
  effects: StatEffects,
  isBankrupt: boolean
): GameState {
  const costMultiplier = isBankrupt ? 1.5 : 1;
  const benefitMultiplier = isBankrupt ? 0.5 : 1;

  const newState = { ...state };

  for (const [key, value] of Object.entries(effects)) {
    if (value === undefined || value === 0) continue;

    if (key === "budget") {
      const adjustedValue =
        value < 0
          ? Math.round(value * costMultiplier)
          : Math.round(value * benefitMultiplier);
      newState.budget += adjustedValue;
    } else {
      const statKey = key as keyof GameState | "westernRelations" | "easternRelations";
      if (
        (typeof newState[statKey as keyof GameState] === "number" && statKey !== "turn" && statKey !== "bankruptTurns") ||
        statKey === "westernRelations" ||
        statKey === "easternRelations"
      ) {
        const adjustedValue =
          value < 0
            ? Math.round(value * costMultiplier)
            : Math.round(value * benefitMultiplier);
        
        if (statKey === "politicalCapital") {
          (newState[statKey] as number) = Math.min(999, Math.max(0, (newState[statKey] as number) + adjustedValue));
        } else if (statKey === "westernRelations" || statKey === "easternRelations") {
          try {
            const dipState = JSON.parse(newState.diplomacyState || "{}");
            dipState[statKey] = clampStat((dipState[statKey] || 50) + adjustedValue);
            newState.diplomacyState = JSON.stringify(dipState);
          } catch {}
        } else {
          (newState[statKey] as number) = clampStat(
            (newState[statKey] as number) + adjustedValue
          );
        }
      }
    }
  }

  return newState;
}

// ============================================
// H. ERA HESAPLAMA (Dinamik UI Evrimi İçin)
// ============================================
export function calculateEra(state: Partial<GameState>): number {
  let unlockedTechs: string[] = [];
  try { unlockedTechs = JSON.parse(state.unlockedTechs || "[]"); } catch {}

  let megaProjects: string[] = [];
  try { megaProjects = JSON.parse(state.megaProjects || "[]"); } catch {}
  
  const completedProjectsCount = megaProjects.length;
  const techsCount = unlockedTechs.length;

  if (techsCount >= 10 && completedProjectsCount >= 3) return 4; // Era 4: UTOPIA
  if (techsCount >= 6 || completedProjectsCount >= 2) return 3;  // Era 3: Biomimicry & Tech
  if (techsCount >= 3 || completedProjectsCount >= 1) return 2;  // Era 2: Chronos Matrix
  return 1;                                                      // Era 1: Blueprint
}

export interface StatPressure {
  source: string;
  value: number;
}
export type StatPressuresBreakdown = Record<string, StatPressure[]>;

export function calculateStatPressures(
  state: GameState,
  activeLaws: string[],
  unlockedTechs: string[],
  activeCrises: string[],
  ministers: Record<string, string>,
  eventFlags: string[]
): StatPressuresBreakdown {
  const breakdown: StatPressuresBreakdown = {
    happiness: [],
    stability: [],
    health: [],
    education: [],
    environment: [],
    military: [],
    foreignRelations: []
  };

  const addPressure = (stat: string, source: string, value: number) => {
    if (value !== 0 && breakdown[stat]) {
      breakdown[stat].push({ source, value });
    }
  };

  // 1. Yasalar
  activeLaws.forEach(lawId => {
    const law = POLICIES[lawId as keyof typeof POLICIES];
    if (!law) return;
    if (law.passiveEffects.happiness) addPressure("happiness", `Yasa: ${law.name}`, law.passiveEffects.happiness);
    if (law.passiveEffects.stability) addPressure("stability", `Yasa: ${law.name}`, law.passiveEffects.stability);
    if (law.passiveEffects.health) addPressure("health", `Yasa: ${law.name}`, law.passiveEffects.health);
    if (law.passiveEffects.education) addPressure("education", `Yasa: ${law.name}`, law.passiveEffects.education);
    if (law.passiveEffects.environment) addPressure("environment", `Yasa: ${law.name}`, law.passiveEffects.environment);
    if (law.passiveEffects.military) addPressure("military", `Yasa: ${law.name}`, law.passiveEffects.military);
    if (law.passiveEffects.foreignRelations) addPressure("foreignRelations", `Yasa: ${law.name}`, law.passiveEffects.foreignRelations);
  });

  // 2. Teknolojiler
  unlockedTechs.forEach(techId => {
    const tech = TECH_TREE[techId as keyof typeof TECH_TREE];
    if (!tech || !tech.passiveEffects) return;
    if (tech.passiveEffects.happiness) addPressure("happiness", `Ar-Ge: ${tech.name}`, tech.passiveEffects.happiness);
    if (tech.passiveEffects.stability) addPressure("stability", `Ar-Ge: ${tech.name}`, tech.passiveEffects.stability);
    if (tech.passiveEffects.health) addPressure("health", `Ar-Ge: ${tech.name}`, tech.passiveEffects.health);
    if (tech.passiveEffects.education) addPressure("education", `Ar-Ge: ${tech.name}`, tech.passiveEffects.education);
    if (tech.passiveEffects.environment) addPressure("environment", `Ar-Ge: ${tech.name}`, tech.passiveEffects.environment);
    if (tech.passiveEffects.military) addPressure("military", `Ar-Ge: ${tech.name}`, tech.passiveEffects.military);
    if (tech.passiveEffects.foreignRelations) addPressure("foreignRelations", `Ar-Ge: ${tech.name}`, tech.passiveEffects.foreignRelations);
  });

  // 3. Krizler
  activeCrises.forEach(crisisId => {
    const crisis = CRISES[crisisId as keyof typeof CRISES];
    if (!crisis || !crisis.passiveEffects) return;
    if (crisis.passiveEffects.happiness) addPressure("happiness", `Kriz: ${crisis.name}`, crisis.passiveEffects.happiness);
    if (crisis.passiveEffects.stability) addPressure("stability", `Kriz: ${crisis.name}`, crisis.passiveEffects.stability);
    if (crisis.passiveEffects.health) addPressure("health", `Kriz: ${crisis.name}`, crisis.passiveEffects.health);
  });

  // 4. İflas
  if (state.isBankrupt) {
    if (state.budget < 0) {
      addPressure("happiness", "İflas (Bütçe Açığı)", -5);
      addPressure("stability", "İflas (Bütçe Açığı)", -5);
    }
  }

  // 5. Özel Durumlar (Kıtlık, Kaynak Krizleri vb. processNextTurn içindeki passif eksiler)
  if (state.food !== undefined && state.food <= 0) {
    addPressure("health", "Kıtlık (Gıda Yok)", -5);
    addPressure("happiness", "Açlık (Gıda Yok)", -5);
  }
  if (state.energy !== undefined && state.energy <= 0) {
    addPressure("stability", "Elektrik Kesintisi", -5);
  }
  if (state.materials !== undefined && state.materials <= 0) {
    addPressure("military", "Hammadde Yokluğu", -5);
    addPressure("education", "Hammadde Yokluğu", -2);
  }

  return breakdown;
}

// ============================================
// B. AYLIK BÜTÇE (NET GELİR) HESAPLAMASI
// ============================================
export function processNextTurn(currentState: GameState, tradeIncome: number = 0, usedEventIds: string[] = [], eventFlags: string[] = []): TurnResult {
  const state = { ...currentState };
  
  const countryTemplate = COUNTRIES.find(c => c.name === state.countryName);
  const difficulty = countryTemplate?.difficulty || "Orta";
  
  // JSON parse
  let factions: FactionsState = INITIAL_FACTIONS;
  try { factions = JSON.parse(state.factions); } catch { factions = INITIAL_FACTIONS; }
  if (Object.keys(factions).length === 0) factions = INITIAL_FACTIONS;

  let activeCrises: CrisisId[] = [];
  try { activeCrises = JSON.parse(state.activeCrises); } catch {}

  let activeLaws: PolicyId[] = [];
  try { activeLaws = JSON.parse(state.activeLaws); } catch {}

  let ministers: Record<string, MinisterId> = {};
  try { ministers = JSON.parse(state.ministers); } catch {}

  let activePetitions: string[] = [];
  try { activePetitions = JSON.parse(state.activePetitions); } catch {}

  let unlockedTechs: string[] = [];
  try { unlockedTechs = JSON.parse(state.unlockedTechs || "[]"); } catch {}

  const turnReports: string[] = [];
  turnReports.push(`📅 Tur ${state.turn} sona erdi.`);
  const taxIncome = calculateTaxIncome(
    state.education,
    state.health,
    state.environment,
    state.military,
    state.stability,
    state.happiness,
    factions.capitalists?.support || 50,
    eventFlags,
    difficulty,
    state.inflation,
    state.population
  );
  let maintenanceCost = calculateMaintenanceCost(
    state.military, 
    state.health, 
    state.education, 
    state.environment,
    state.stability,
    eventFlags, 
    state.budget, 
    difficulty,
    unlockedTechs,
    state.inflation,
    state.population,
    factions
  );
  let finalTradeIncome = tradeIncome;

  // 3.5 Nüfus Büyümesi
  let growthRate = (state.health - 50) * 0.005 + (state.stability - 50) * 0.002 + (state.environment - 50) * 0.001; // % cinsinden büyüme/küçülme
  // Aşırı hızlı büyümeyi ve küçülmeyi engelle (min %-2, max %+2)
  growthRate = Math.max(-2, Math.min(2, growthRate)); 
  
  if (state.health < 20) growthRate -= 0.5; // Kötü sağlık ekstra ölüm
  
  const popChange = state.population * (growthRate / 100);
  state.population = Math.max(0.1, Number((state.population + popChange).toFixed(2))); // En az 0.1 milyon
  
  if (popChange > 0.05) {
    turnReports.push(`📈 Nüfus Arttı: Doğum oranları ve göçlerle nüfus yaklaşık ${(popChange * 1000000).toLocaleString('tr-TR', {maximumFractionDigits:0})} kişi arttı (Toplam: ${state.population}M).`);
  } else if (popChange < -0.05) {
    turnReports.push(`📉 Nüfus Azaldı: Kötü yaşam şartları nedeniyle nüfus yaklaşık ${Math.abs(popChange * 1000000).toLocaleString('tr-TR', {maximumFractionDigits:0})} kişi azaldı (Toplam: ${state.population}M).`);
  }

  // ==========================================
  // 🇰🇵 KUZEY KORE ÖZEL REJİM MODU (HARDCORE+)
  // ==========================================
  if (state.countryName === "Kuzey Kore") {
    // 0. ZORUNLU ASKERLİK (Askeriye Bakım İndirimi)
    // Devasa orduyu beslemek bütçeyi anında sıfırlıyordu. Askerlerin ücretsiz zorunlu hizmeti sayesinde masraf %50 azalır.
    const conscriptionDiscount = Math.round(maintenanceCost * 0.5);
    maintenanceCost -= conscriptionDiscount;
    turnReports.push(`🎖️ ZORUNLU ASKERLİK: Ordu bakımı için yapılan devasa harcamalar, zorunlu hizmet sayesinde $${conscriptionDiscount} azaltıldı.`);

    // 1. KARA BORSA KAÇAKÇILIĞI (Kısmi Ambargo)
    if (finalTradeIncome > 0) {
      const originalIncome = finalTradeIncome;
      finalTradeIncome = Math.round(finalTradeIncome * 0.25);
      turnReports.push(`🚨 KARA BORSA: Ambargolar nedeniyle +$${originalIncome} ticaret gelirinin büyük kısmı bloke edildi. Sadece +$${finalTradeIncome} ülkeye sokulabildi.`);
    }

    // 2. KRONİK AÇLIK: Her tur sağlık ve mutluluk düşer (Ama 15'te durur, oyuncuyu hemen öldürmez)
    if (state.health > 15) state.health = Math.max(15, state.health - 1);
    if (state.happiness > 15) state.happiness = Math.max(15, state.happiness - 1);
    turnReports.push(`🚨 KUZEY KORE REJİM ETKİSİ: Gıda yetersizliği ve izolasyon nedeniyle halk acı çekiyor (-1 Sağlık, -1 Mutluluk).`);

    // 3. KORKU DUVARI & JUCHE BONUSU
    if (state.stability < 80) {
      state.happiness = Math.max(0, state.happiness - 5);
      turnReports.push(`🚨 KORKU DUVARI YIKILDI: Otoriteniz %80'in altına düştüğü için halk artık konuşmaya cüret ediyor! Kaos kapıda (-5 Mutluluk).`);
    } else {
      let jucheMsg = `🔒 KORKU İMPARATORLUĞU: Rejimin demir yumruğu sayesinde isyan sesleri bastırılıyor (İstikrar > %80).`;
      if (state.stability >= 85) {
        state.budget += 1500;
        jucheMsg += ` Ayrıca JUCHE (Öz Yeterlilik) politikası meyvesini verdi: +$1500 Hazineye eklendi.`;
      }
      turnReports.push(jucheMsg);
    }
  }
  // ==========================================

  state.budget += taxIncome;
  state.budget -= maintenanceCost;
  state.budget += finalTradeIncome;
  turnReports.push(`💰 Vergi ve Ticaret gelirleri toplandı: +$${taxIncome + finalTradeIncome}`);
  turnReports.push(`🏢 Devlet altyapı bakım giderleri: -$${maintenanceCost}`);

  // ==========================================
  // ANTİ-HOARDING: ZENGİNLİK CEZASI (Yolsuzluk & İsraf)
  // ==========================================
  if (state.budget > 500000) {
    const excessBudget = state.budget - 500000;
    const wasteRate = Math.min(0.08, 0.02 + (excessBudget / 10000000)); // %2-%8 arası israf
    const wasteAmount = Math.round(excessBudget * wasteRate);
    state.budget -= wasteAmount;
    state.stability = clampStat(state.stability - 1); // Yolsuzluk istikrarı düşürür
    turnReports.push(`🏛️ BÜROKRATİK İSRAF: Devasa hazineniz yolsuzluk ve israfı körüklüyor. -$${wasteAmount.toLocaleString()} bürokratik kayıp, -1 İstikrar.`);
  }

  // ==========================================
  // AR-GE PUANI (RESEARCH POINTS) ÜRETİMİ
  // ==========================================
  let baseRP = 0; 
  
  // 1. Eğitim Katkısı (Eğitim 75'i geçerse)
  if (state.education >= 75) {
    baseRP += Math.floor((state.education - 70) / 10);
  }
  
  // 2. Bakan Katkısı (Eğitim Bakanı varsa)
  const hasEduMinister = Object.values(ministers).includes("min_edu" as any);
  if (hasEduMinister) baseRP += 1;
  
  // 3. Mega Proje Katkısı (Uzay Programı)
  let megaProjectsRP: string[] = [];
  try { megaProjectsRP = JSON.parse(state.megaProjects || "[]"); } catch {}
  const hasSpaceProgram = megaProjectsRP.includes("space_program");
  if (hasSpaceProgram) baseRP += 2;
  
  // 4. Eksi Yaptırım (Eğitim düşükse veya bütçe eksi ise Ar-Ge yavaşlar)
  if (state.education < 40) baseRP = 0;
  
  // 5. Kuantum Çarpanı
  if (unlockedTechs.includes("quantum_computing")) {
    baseRP = Math.round(baseRP * 1.5);
  }
  
  // Güvenlik
  baseRP = Math.max(0, baseRP);
  
  // Zorluk bazlı RP çarpanı
  let rpDiffMultiplier = 1.0;
  if (difficulty === "Kolay") rpDiffMultiplier = 1.5;
  else if (difficulty === "Zor") rpDiffMultiplier = 0.75;
  else if (difficulty === "Çok Zor") rpDiffMultiplier = 0.5;
  
  baseRP = Math.floor(baseRP * rpDiffMultiplier);
  
  state.researchPoints += baseRP;
  turnReports.push(`🔬 Araştırma Puanı (RP) kazanıldı: +${baseRP}`);

  // ==========================================
  // ZORLUK DERECESİNE GÖRE SİYASİ SERMAYE (POLITICAL CAPITAL) DEĞİŞİMİ
  // ==========================================
  let basePoliticalCapitalGain = 5; // Taban kazanım (Orta zorluk için)
  if (difficulty === "Kolay") basePoliticalCapitalGain += 5; // Toplam +10
  else if (difficulty === "Zor") basePoliticalCapitalGain -= 3; // Toplam +2
  else if (difficulty === "Çok Zor") basePoliticalCapitalGain -= 5; // Toplam +0
  
  if (basePoliticalCapitalGain !== 0) {
    state.politicalCapital = Math.max(0, Math.min(500, state.politicalCapital + basePoliticalCapitalGain));
    if (basePoliticalCapitalGain > 0) {
      turnReports.push(`📜 Siyasi Sermaye kazanıldı: +${basePoliticalCapitalGain} PC`);
    }
  }
  // ==========================================

  // 4. Kriz Kontrolü ve Etkileri
  const remainingCrises: CrisisId[] = [];
  for (const crisisId of activeCrises) {
    const crisis = CRISES[crisisId];
    if (crisis.resolutionCondition(state, activeLaws, factions)) {
      turnReports.push(`✅ KRİZ ÇÖZÜLDÜ: ${crisis.name} başarıyla atlatıldı!`);
      factions = modifyFactionSupport(factions, { capitalists: 5, workers: 5, intellectuals: 5 });
      state.politicalCapital = Math.min(999, Math.max(0, state.politicalCapital + 10));
    } else {
      // Hala devam ediyor, hasar ver
      remainingCrises.push(crisisId);
      if (crisis.passiveEffects.budget) state.budget += crisis.passiveEffects.budget;
      if (crisis.passiveEffects.stability) state.stability = clampStat(state.stability + crisis.passiveEffects.stability);
      if (crisis.passiveEffects.happiness) state.happiness = clampStat(state.happiness + crisis.passiveEffects.happiness);
      if (crisis.passiveEffects.health) state.health = clampStat(state.health + crisis.passiveEffects.health);
      turnReports.push(`⚠️ DEVAM EDEN KRİZ (${crisis.name}): Ülkeye zarar vermeye devam ediyor.\n💡 ${crisis.description}`);
    }
  }

  // 5. Yeni Kriz Tetikleyicileri
  for (const [id, crisis] of Object.entries(CRISES)) {
    const cId = id as CrisisId;
    if (!remainingCrises.includes(cId) && crisis.triggerCondition(state, factions, activeLaws)) {
      remainingCrises.push(cId);
      turnReports.push(`🚨 YENİ KRİZ PATLAK VERDİ: ${crisis.name}!\n💡 ${crisis.description}`);
    }
  }
  activeCrises = remainingCrises;

  // 6. Fraksiyon Domino Etkileri ve Radikalleşme
  const isNKPropaganda = state.countryName === "Kuzey Kore" && state.military > 80;

  if (state.happiness < 40) {
    if (isNKPropaganda) {
      factions = modifyFactionSupport(factions, { workers: -1, intellectuals: -1 });
      turnReports.push(`📢 DEMİR YUMRUK: Askeri baskı sayesinde halkın mutsuzluğuna rağmen isyan engelleniyor (İşçi düşüşü yavaşladı).`);
    } else {
      factions = modifyFactionSupport(factions, { workers: -2, intellectuals: -1 });
      turnReports.push(`📉 Halkın mutsuzluğu işçileri ve aydınları tedirgin ediyor.`);
    }
  }
  if (state.health < 40) {
    factions = modifyFactionSupport(factions, { workers: isNKPropaganda ? -1 : -2 });
  }
  if (state.budget < 0) {
    factions = modifyFactionSupport(factions, { capitalists: -2 }); // -5'ti, iflas ölüm sarmalını engellemek için -2 yapıldı.
    turnReports.push(`📉 Bütçe açığı sermayedarları korkutuyor.`);
  }

  // Radikalleşme: Desteği %20'nin altına düşen fraksiyonlar istikrarı bozar
  let radicalizationPenalty = 0;
  for (const fId in factions) {
    if (factions[fId as keyof typeof factions].support < 20) {
      radicalizationPenalty += 2;
    }
  }
  if (radicalizationPenalty > 0) {
    state.stability = clampStat(state.stability - radicalizationPenalty);
    turnReports.push(`⚠️ MARJİNALLEŞME: Destek bulamayan fraksiyonların radikalleşmesi istikrarı sarsıyor (-${radicalizationPenalty}).`);
  }

  // 6.5 Fraksiyon Pozitif Bonusları (>75 Destek)
  for (const fId in factions) {
    if (factions[fId as keyof typeof factions].support >= 75) {
      if (fId === "workers") {
        state.health = clampStat(state.health + 1);
        state.happiness = clampStat(state.happiness + 1);
        turnReports.push(`👷 İŞÇİ DESTEĞİ: Mutlu işçi sınıfı sayesinde üretim ve yaşam standartları artıyor (+1 Sağlık, +1 Mutluluk).`);
      } else if (fId === "intellectuals") {
        state.researchPoints += 2;
        turnReports.push(`🎓 AYDINLARIN DESTEĞİ: Entelijansiya hükümeti destekliyor, bilimsel atılımlar hızlandı (+2 RP).`);
      } else if (fId === "nationalists") {
        state.stability = clampStat(state.stability + 1);
        turnReports.push(`🦅 MİLLİYETÇİ DESTEĞİ: Muhafazakar kesimin tam desteği sayesinde ülkede asayiş berkemal (+1 İstikrar).`);
      }
    }
  }

  // 7. İflas Kontrolü ve IMF Müdahalesi
  const popScale = Math.max(0.8, Math.sqrt(state.population / 10));
  const dynamicBailoutLimit = -(taxIncome * 3); // Dinamik İflas Sınırı (Verginin 3 katı)

  if (state.budget < dynamicBailoutLimit) {
    // IMF Kurtarma Paketi (Bailout)
    state.budget = 0;
    state.politicalCapital = 0;
    state.stability = Math.max(5, clampStat(state.stability - 30));
    state.foreignRelations = Math.max(5, clampStat(state.foreignRelations - 30));
    state.happiness = Math.max(5, clampStat(state.happiness - 20));
    state.isBankrupt = false;
    state.bankruptTurns = 0;
    turnReports.push(`🚨 IMF MÜDAHALESİ: Ekonomi tamamen çöktü! Dış güçler yönetime el koydu. Bütçe sıfırlandı ancak Siyasi Sermaye tükendi, ülkenin itibarı ve istikrarı yerle bir oldu!`);
  } else if (state.budget < 0 && !state.isBankrupt) {
    state.isBankrupt = true;
    state.bankruptTurns = BANKRUPTCY_DURATION;
    state.happiness = clampStat(state.happiness - 15);
    state.stability = clampStat(state.stability - 15);
    turnReports.push(`📉 İFLAS EŞİĞİ: Bütçe açığı kritik seviyede! Ülke iflas riski taşıyor (Mutluluk ve İstikrar -15).`);
  } else if (state.isBankrupt) {
    if (state.budget < 0) {
      // Ölüm sarmalını yavaşlatmak için ceza düşürüldü (-5)
      state.happiness = clampStat(state.happiness - 5);
      state.stability = clampStat(state.stability - 5);
      turnReports.push(`🚨 İFLAS SÜRÜYOR: Hükümet felç durumda (Mutluluk ve İstikrar -5).`);
    }
    
    if (state.bankruptTurns > 0) {
      state.bankruptTurns--;
    }
    
    if (state.bankruptTurns === 0 && state.budget >= 0) {
      state.isBankrupt = false;
      turnReports.push(`✅ İflas dönemi sona erdi. Ekonomi toparlanıyor.`);
    }
  }

  // 7.5 Enflasyon Soğuma Mekaniği (Pasif)
  if (state.budget > 0 && taxIncome > maintenanceCost && state.inflation > 2.0) {
    // Bütçe artı veriyor ve vergi geliri masrafları karşılıyorsa enflasyon hafifçe düşer
    state.inflation = Math.max(2.0, state.inflation - 0.5);
    if (state.inflation < 50 && state.inflation > 10) {
       // Yüksek enflasyondan dönüş hızlanır
       state.inflation -= 1.0; 
    }
  }

  // 7.8 Mega Projeler Pasif Bonusları
  let completedProjects: string[] = [];
  try { completedProjects = JSON.parse(state.megaProjects || "[]"); } catch {}
  
  if (completedProjects.includes("utopia_city")) {
    state.happiness = clampStat(state.happiness + 2);
    state.health = clampStat(state.health + 2);
    state.stability = clampStat(state.stability + 1);
    turnReports.push(`🏙️ ÜTOPYA ŞEHRİ: Kusursuz yapay zeka yönetimi halkın refahını sürekli artırıyor (+2 Mutluluk/Sağlık, +1 İstikrar).`);
  }
  if (completedProjects.includes("world_peace")) {
    state.foreignRelations = clampStat(state.foreignRelations + 3);
    turnReports.push(`🕊️ KÜRESEL BARIŞ İTTİFAKI: Tüm dünya ülkeleri size saygı duyuyor (+3 Dış İlişkiler).`);
  }
  if (completedProjects.includes("space_program")) {
    state.researchPoints += 3;
    turnReports.push(`🚀 MARS KOLONİSİ: Uzay madenciliği ve dünya dışı araştırmalar bilimi uçuruyor (+3 RP).`);
  }

  // 8. Doğal Yıpranma ve Pasif Bonuslar
  // Doğal azalma hiçbir zaman oyuncuyu 0'a düşürüp doğrudan Game Over yapamaz, en fazla 5'te durur.
  state.military = Math.max(5, clampStat(state.military - 1));
  state.stability = Math.max(5, clampStat(state.stability - 1));
  
  // Çevre bonusu: Temiz çevre sağlığı iyileştirir
  if (state.environment > 70) {
    state.health = clampStat(state.health + 1);
  }
  
  // İstikrar Bonusu: Güvenli ülke dış dünyada itibar kazanır (Diplomasi Puanı)
  if (state.stability > 70) {
    state.foreignRelations = clampStat(state.foreignRelations + 1);
  }
  
  // Mutluluk ve sağlık her 2 turda 1 düşer, çevre doğal olarak düşmez (sadece krizlerle)
  if (state.turn % 2 === 0) {
    state.happiness = Math.max(5, clampStat(state.happiness - 1));
    state.health = Math.max(5, clampStat(state.health - 1));
  }

  // 9. Kaynak Tüketimi ve Üretimi (V8 Özelliği)
  const popScaleForResources = Math.max(0.8, Math.sqrt(state.population / 10));
  
  // Gıda: Çevre üretir, nüfus tüketir.
  const foodProduction = state.environment * 0.15;
  const foodConsumption = popScaleForResources * 1.5;
  state.food = Math.min(100, Math.max(0, (state.food || 50) + foodProduction - foodConsumption));

  // Enerji: Eğitim ve İstikrar üretir (Verimlilik), Ordu ve Nüfus tüketir.
  const energyProduction = (state.education * 0.1) + (state.stability * 0.1);
  const energyConsumption = (state.military * 0.05) + (popScaleForResources * 1.0);
  state.energy = Math.min(100, Math.max(0, (state.energy || 50) + energyProduction - energyConsumption));

  // Materyal: Dış ilişkiler ve Bütçe gücü üretir (İthalat), Çevre koruma ve Ordu tüketir.
  const materialProduction = state.foreignRelations * 0.15;
  const materialConsumption = (state.military * 0.1) + (state.environment > 50 ? 0.5 : 0);
  state.materials = Math.min(100, Math.max(0, (state.materials || 50) + materialProduction - materialConsumption));

  // Kaynak Krizleri ve Bolluk
  if (state.food <= 0) {
    state.health = clampStat(state.health - 5);
    state.happiness = clampStat(state.happiness - 5);
    turnReports.push(`🌾 AÇLIK KRİZİ: Ülkede gıda stokları tükendi! Halk açlıktan kırılıyor (Sağlık ve Mutluluk -5).`);
  } else if (state.food > 90) {
    state.health = clampStat(state.health + 1);
    state.happiness = clampStat(state.happiness + 1);
  }

  if (state.energy <= 0) {
    state.budget = state.budget - (1000 * popScaleForResources);
    state.stability = clampStat(state.stability - 5);
    turnReports.push(`⚡ ENERJİ KRİZİ: Elektrik kesintileri sanayiyi durdurdu! Ekonomi ağır hasar aldı (Bütçe ve İstikrar düştü).`);
  } else if (state.energy > 90) {
    state.budget += (500 * popScaleForResources);
    state.education = clampStat(state.education + 1);
  }

  if (state.materials <= 0) {
    state.military = clampStat(state.military - 5);
    state.education = clampStat(state.education - 2);
    turnReports.push(`⚙️ MATERYAL EKSİKLİĞİ: Hammadde yetersizliğinden ordu ve altyapı bakımları yapılamıyor (Askeriye -5, Eğitim -2).`);
  } else if (state.materials > 90) {
    state.military = clampStat(state.military + 1);
    state.stability = clampStat(state.stability + 1);
  }

  // 10. Tur Artışı
  state.turn += 1;
  
  // 8.5. Fraksiyonların Merkeze Dönüşü (Mean Reversion)
  // Destek %50'nin üzerindeyse -1, altındaysa +1 çekerek zamanla normalleşmelerini sağla
  for (const fId in factions) {
    const faction = factions[fId as keyof typeof factions];
    if (faction.support > 50) {
      faction.support = Math.max(50, faction.support - 1);
    } else if (faction.support < 50) {
      faction.support = Math.min(50, faction.support + 1);
    }
  }

  // Dinamik popülarite hesaplaması (Fraksiyonların ortalaması)

  // Etkileri formatlamak için yardımcı fonksiyon
  const formatEffects = (effects: Record<string, number>) => {
    const parts: string[] = [];
    if (effects.budget) parts.push(`${effects.budget > 0 ? '+' : ''}${effects.budget}$ Bütçe`);
    if (effects.stability) parts.push(`${effects.stability > 0 ? '+' : ''}${effects.stability} İstikrar`);
    if (effects.happiness) parts.push(`${effects.happiness > 0 ? '+' : ''}${effects.happiness} Mutluluk`);
    if (effects.health) parts.push(`${effects.health > 0 ? '+' : ''}${effects.health} Sağlık`);
    if (effects.military) parts.push(`${effects.military > 0 ? '+' : ''}${effects.military} Askeriye`);
    if (effects.environment) parts.push(`${effects.environment > 0 ? '+' : ''}${effects.environment} Çevre`);
    if (effects.education) parts.push(`${effects.education > 0 ? '+' : ''}${effects.education} Eğitim`);
    if (effects.foreignRelations) parts.push(`${effects.foreignRelations > 0 ? '+' : ''}${effects.foreignRelations} Dış İlişkiler`);
    return parts.length > 0 ? parts.join(", ") : "Etki yok";
  };

  // 1. Yasaların (Policies) Pasif Etkileri
  const lawEffects: Record<string, number> = { budget: 0, stability: 0, happiness: 0, health: 0, military: 0, environment: 0, education: 0 };
  
  activeLaws.forEach(lawId => {
    const law = POLICIES[lawId];
    if (law.passiveEffects.budget) { lawEffects.budget += law.passiveEffects.budget; state.budget += law.passiveEffects.budget; }
    if (law.passiveEffects.stability) { lawEffects.stability += law.passiveEffects.stability; state.stability = clampStat(state.stability + law.passiveEffects.stability); }
    if (law.passiveEffects.happiness) { lawEffects.happiness += law.passiveEffects.happiness; state.happiness = clampStat(state.happiness + law.passiveEffects.happiness); }
    if (law.passiveEffects.health) { lawEffects.health += law.passiveEffects.health; state.health = clampStat(state.health + law.passiveEffects.health); }
    if (law.passiveEffects.military) { lawEffects.military += law.passiveEffects.military; state.military = clampStat(state.military + law.passiveEffects.military); }
    if (law.passiveEffects.environment) { lawEffects.environment += law.passiveEffects.environment; state.environment = clampStat(state.environment + law.passiveEffects.environment); }
    if (law.passiveEffects.education) { lawEffects.education += law.passiveEffects.education; state.education = clampStat(state.education + law.passiveEffects.education); }
    
    // Fraksiyonlar üzerindeki pasif etki
    if (law.passiveFactionEffects) {
      factions = modifyFactionSupport(factions, law.passiveFactionEffects);
    }
  });

  if (activeLaws.length > 0) {
    turnReports.push(`📜 Yürürlükteki Yasaların Etkisi: ${formatEffects(lawEffects)}`);
  }


  // 1.2 Teknolojilerin Pasif Etkileri
  const techEffects: Record<string, number> = { budget: 0, stability: 0, happiness: 0, health: 0, military: 0, environment: 0, education: 0, foreignRelations: 0 };
  
  unlockedTechs.forEach(techId => {
    const tech = TECH_TREE[techId as TechId];
    if (tech && tech.passiveEffects) {
      if (tech.passiveEffects.budget) { techEffects.budget += tech.passiveEffects.budget; state.budget += tech.passiveEffects.budget; }
      if (tech.passiveEffects.stability) { techEffects.stability += tech.passiveEffects.stability; state.stability = clampStat(state.stability + tech.passiveEffects.stability); }
      if (tech.passiveEffects.happiness) { techEffects.happiness += tech.passiveEffects.happiness; state.happiness = clampStat(state.happiness + tech.passiveEffects.happiness); }
      if (tech.passiveEffects.health) { techEffects.health += tech.passiveEffects.health; state.health = clampStat(state.health + tech.passiveEffects.health); }
      if (tech.passiveEffects.military) { techEffects.military += tech.passiveEffects.military; state.military = clampStat(state.military + tech.passiveEffects.military); }
      if (tech.passiveEffects.environment) { techEffects.environment += tech.passiveEffects.environment; state.environment = clampStat(state.environment + tech.passiveEffects.environment); }
      if (tech.passiveEffects.education) { techEffects.education += tech.passiveEffects.education; state.education = clampStat(state.education + tech.passiveEffects.education); }
      if (tech.passiveEffects.foreignRelations) { techEffects.foreignRelations += tech.passiveEffects.foreignRelations; state.foreignRelations = clampStat(state.foreignRelations + tech.passiveEffects.foreignRelations); }
    }
  });

  if (unlockedTechs.length > 0) {
    turnReports.push(`🔬 Ar-Ge ve Teknoloji Etkisi: ${formatEffects(techEffects)}`);
  }

  // 1.5 Bakanların (Ministers) Pasif Etkileri ve İstifa Kontrolü
  const currentMinisters = Object.entries(ministers);
  const minEffects: Record<string, number> = { budget: 0, military: 0, happiness: 0, education: 0, stability: 0, foreignRelations: 0, health: 0, environment: 0 };
  
  for (const [key, ministerId] of currentMinisters) {
    const minister = MINISTERS[ministerId as MinisterId];
    if (minister) {
      const requiredFactionSupport = factions[minister.requiredFactionId]?.support || 50;
      if (requiredFactionSupport < 20) {
        if (state.countryName === "Kuzey Kore" && state.military > 80) {
          // Korku İmparatorluğu bakanları zorla görevde tutar
          turnReports.push(`🔒 KORKU KABİNESİ: ${minister.avatar} ${minister.name}, temsil ettiği kesimin desteğini tamamen kaybetmesine rağmen askeri baskı yüzünden istifa edemiyor.`);
        } else {
          // İSTİFA ETTİ
          turnReports.push(`⚠️ BAKAN İSTİFASI: ${minister.avatar} ${minister.name} (${minister.title}), temsil ettiği kesime ters düştüğünüz için istifa etti! İstikrar düştü.`);
          state.stability = clampStat(state.stability - 10);
          delete ministers[key];
          continue;
        }
      }

      if (minister.passiveEffects.budget) { minEffects.budget += minister.passiveEffects.budget; state.budget += minister.passiveEffects.budget; }
      if (minister.passiveEffects.military) { minEffects.military += minister.passiveEffects.military; state.military = clampStat(state.military + minister.passiveEffects.military); }
      if (minister.passiveEffects.happiness) { minEffects.happiness += minister.passiveEffects.happiness; state.happiness = clampStat(state.happiness + minister.passiveEffects.happiness); }
      if (minister.passiveEffects.education) { minEffects.education += minister.passiveEffects.education; state.education = clampStat(state.education + minister.passiveEffects.education); }
      if (minister.passiveEffects.stability) { minEffects.stability += minister.passiveEffects.stability; state.stability = clampStat(state.stability + minister.passiveEffects.stability); }
      if (minister.passiveEffects.foreignRelations) { minEffects.foreignRelations += minister.passiveEffects.foreignRelations; state.foreignRelations = clampStat(state.foreignRelations + minister.passiveEffects.foreignRelations); }
      if (minister.passiveEffects.health) { minEffects.health += minister.passiveEffects.health; state.health = clampStat(state.health + minister.passiveEffects.health); }
      if (minister.passiveEffects.environment) { minEffects.environment += minister.passiveEffects.environment; state.environment = clampStat(state.environment + minister.passiveEffects.environment); }

      if (minister.passiveFactionEffects) {
        factions = modifyFactionSupport(factions, minister.passiveFactionEffects);
      }
    }
  }

  if (Object.keys(ministers).length > 0) {
    turnReports.push(`👔 Kabine Üyelerinin Etkisi: ${formatEffects(minEffects)}`);
  }

  // ============================================
  // SNOWBALL (KARTOPU) EFEKTİ İŞLEME
  // ============================================
  let activeSnowballEffectStr = (state as any).activeSnowballEffect;
  if (activeSnowballEffectStr && activeSnowballEffectStr !== "null") {
    try {
      const snowball = JSON.parse(activeSnowballEffectStr);
      if (snowball && snowball.turnsRemaining > 0) {
        // Efektleri uygula
        const mods = snowball.statModifiers;
        if (mods.budget) state.budget += mods.budget;
        if (mods.stability) state.stability = clampStat(state.stability + mods.stability);
        if (mods.happiness) state.happiness = clampStat(state.happiness + mods.happiness);
        if (mods.health) state.health = clampStat(state.health + mods.health);
        if (mods.military) state.military = clampStat(state.military + mods.military);
        if (mods.environment) state.environment = clampStat(state.environment + mods.environment);
        if (mods.education) state.education = clampStat(state.education + mods.education);
        if (mods.foreignRelations) state.foreignRelations = clampStat(state.foreignRelations + mods.foreignRelations);
        if (mods.energy) state.energy += mods.energy;
        if (mods.food) state.food += mods.food;
        if (mods.materials) state.materials += mods.materials;
        
        turnReports.push(`❄️ KARTOPU ETKİSİ (${snowball.name}): ${formatEffects(mods)} (Kalan Tur: ${snowball.turnsRemaining})`);
        
        snowball.turnsRemaining -= 1;
        if (snowball.turnsRemaining <= 0) {
          turnReports.push(`🔚 KARTOPU ETKİSİ BİTTİ: ${snowball.name} etkisini yitirdi.`);
          (state as any).activeSnowballEffect = "null";
        } else {
          (state as any).activeSnowballEffect = JSON.stringify(snowball);
        }
      } else {
        (state as any).activeSnowballEffect = "null";
      }
    } catch (e) {
      console.error("Snowball Effect Parse Error", e);
    }
  }

  // 1.7 Lider Profili Etkileri (Sistemik)
  if (eventFlags.includes("LEADER_TECHNOCRAT")) {
    state.education = clampStat(state.education + 2);
    state.happiness = clampStat(state.happiness - 1);
    turnReports.push(`🧠 Teknokrat Yönetim: Eğitim +2, Mutluluk -1.`);
  }
  if (eventFlags.includes("LEADER_GENERAL")) {
    state.military = clampStat(state.military + 2);
    state.foreignRelations = clampStat(state.foreignRelations - 1);
    turnReports.push(`🎖️ Askeri Yönetim: Askeri Güç +2, Bakım Masrafı -%20, Dış İlişkiler -1.`);
  }
  if (eventFlags.includes("LEADER_ECONOMIST")) {
    state.environment = clampStat(state.environment - 1);
    turnReports.push(`💼 Şirket Yönetimi: Vergi +%25, ancak Çevre -1 (Sanayi kirliliği).`);
  }
  if (eventFlags.includes("LEADER_POPULIST")) {
    state.happiness = clampStat(state.happiness + 1);
    state.politicalCapital = Math.max(0, state.politicalCapital - 2);
    turnReports.push(`🤝 Popülist Yönetim: Mutluluk +1, Siyasi Sermaye -2.`);
  }

  const totalSupport = 
    (factions.capitalists?.support ?? 50) + 
    (factions.workers?.support ?? 50) + 
    (factions.military?.support ?? 50) + 
    (factions.intellectuals?.support ?? 50) + 
    (factions.nationalists?.support ?? 50);
  
  state.popularity = Math.round(totalSupport / 5);
  
  // Popülarite Etkileri (Kral Tacı Mekaniği)
  let pcGain = 5;
  if (state.popularity >= 80) {
    pcGain += 10;
    turnReports.push(`👑 HALKIN SEVGİLİSİ: Yüksek popülariteniz size ekstra Siyasi Sermaye sağlıyor (+10 PC).`);
  } else if (state.popularity < 30) {
    pcGain = 0;
    state.stability = clampStat(state.stability - 5);
    turnReports.push(`👑 HALK DESTEĞİ ÇÖKTÜ: Düşük popülarite nedeniyle meşruiyetiniz sorgulanıyor (İstikrar -5, Siyasi Sermaye artışı yok).`);
  }

  state.politicalCapital = Math.min(999, Math.max(0, state.politicalCapital + pcGain));
  // 8.6 Aktif Görevlerin Kontrolü (Başarı ve Başarısızlık)
  let activeQuests: any[] = [];
  try { activeQuests = JSON.parse(state.activeQuests || "[]"); } catch {}
  
  const remainingQuests = [];
  let questCompleted = false;

  for (const q of activeQuests) {
    if (q.id && q.id.startsWith("quest_")) {
      // Geriye dönük uyumluluk (Eski rastgele görevler - sadece başarısızlık kontrolü vardı)
      q.turnsRemaining--;
      if (q.turnsRemaining <= 0) {
        turnReports.push(`❌ GÖREV BAŞARISIZ: ${q.title} - ${q.failureText || "Halkın taleplerini yerine getiremediniz."}`);
        if (q.failureEffects) {
          Object.assign(state, applyEffects(state, q.failureEffects, state.isBankrupt));
        }
      } else {
        remainingQuests.push(q);
      }
      continue;
    }

    // Yeni Görev Sistemi
    const questData = QUESTS[q.id as QuestId];
    if (!questData) continue;

    const isSuccess = questData.condition(state, factions);
    if (isSuccess) {
      const result = questData.onSuccess(factions, state);
      factions = result.newFactions;
      Object.assign(state, result.newState);
      turnReports.push(`✅ GÖREV BAŞARILI: ${questData.title} - ${result.message}`);
      questCompleted = true;
    } else {
      q.turnsRemaining--;
      if (q.turnsRemaining <= 0) {
        const result = questData.onFailure(factions, state);
        factions = result.newFactions;
        Object.assign(state, result.newState);
        turnReports.push(`❌ GÖREV BAŞARISIZ: ${questData.title} - ${result.message}`);
        questCompleted = true;
      } else {
        remainingQuests.push(q);
      }
    }
  }
  
  // Eğer görev yoksa %25 ihtimalle yeni bir görev ver
  if (remainingQuests.length === 0 && !questCompleted && Math.random() < 0.25) {
    const availableQuestIds = (Object.keys(QUESTS) as QuestId[]).filter(id => !activeQuests.find(q => q.id === id));
    if (availableQuestIds.length > 0) {
      const randomQuestId = availableQuestIds[Math.floor(Math.random() * availableQuestIds.length)];
      const newQuest = QUESTS[randomQuestId];
      remainingQuests.push({ id: randomQuestId, turnsRemaining: newQuest.deadlineTurns, title: newQuest.title, description: newQuest.description });
      turnReports.push(`📜 YENİ GÖREV: ${newQuest.title} - ${newQuest.description}`);
    }
  }
  
  state.activeQuests = JSON.stringify(remainingQuests);

  // 9. Seçim Kontrolü
  if (state.turn === state.nextElectionTurn) {
    if (state.popularity < 40) {
      turnReports.push(`🗳️ SEÇİMLERİ KAYBETTİNİZ! Hükümet düştü.`);
      state.popularity = 0; // Trigger game over
      state.isGameOver = true;
      state.gameOverReason = "SEÇİM HEZİMETİ! Halkın desteğini kaybettiniz.";
    } else {
      turnReports.push(`🗳️ SEÇİMLERİ KAZANDINIZ! Siyasi sermaye (+50).`);
      state.politicalCapital = Math.min(999, Math.max(0, state.politicalCapital + 50));
      state.nextElectionTurn += 10;
    }
  }

  // 10. Game Over / Victory Kontrolü (Eğer seçimden dolayı bitmediyse)
  if (!state.isGameOver) {
    const victoryCheck = checkVictory(state);
    if (victoryCheck) {
      state.isGameOver = true;
      state.gameOverReason = "ZAFER! " + victoryCheck;
    } else {
      const gameOverCheck = checkGameOver(state);
      if (gameOverCheck) {
        state.isGameOver = true;
        state.gameOverReason = gameOverCheck;
      }
    }
  }

  // 11. Tur sayısını artır
  state.turn += 1;

  // 12. Yeni olayları seç (1 ila 4 arası)
  const eventCount = Math.floor(Math.random() * 4) + 1; // 1, 2, 3 veya 4
  let newEvents = getRandomEvents(eventCount, usedEventIds, eventFlags, state);

  // --- BLACK SWAN (SİYAH KUĞU) ETKİNLİKLERİ TETİKLEYİCİLERİ ---
  if (state.bankruptTurns === 2 && !usedEventIds.includes("omnicorp_buyout")) {
    const omniCorp = EVENTS.find(e => e.id === "omnicorp_buyout");
    if (omniCorp && !newEvents.find(e => e.id === "omnicorp_buyout")) newEvents.unshift(omniCorp);
  } else if (state.military >= 90 && !usedEventIds.includes("global_embargo")) {
    const embargo = EVENTS.find(e => e.id === "global_embargo");
    if (embargo && !newEvents.find(e => e.id === "global_embargo")) newEvents.unshift(embargo);
  }

  // Maksimum 4 olay tutmak için Black Swan gelirse listeyi 4'e kırpabiliriz (opsiyonel, şimdilik böyle kalabilir)
  if (newEvents.length > 4) newEvents = newEvents.slice(0, 4);

  // Artık currentEventId yerine array olarak stringleştirip yazacağız (api tarafında da parse edeceğiz)
  state.currentEventId = JSON.stringify(newEvents.map(e => e.id));

  // 13. Yeni Dilekçe Ekle (Her 3 turda bir)
  if (state.turn % 3 === 0 && activePetitions.length < 3) {
    const newPetition = getRandomPetition(activePetitions);
    if (newPetition) {
      activePetitions.push(newPetition.id);
      turnReports.push(`📝 Yeni bir vatandaş dilekçesi masanıza geldi: ${newPetition.title}`);
    }
  }

  // Stringify state values back
  state.factions = JSON.stringify(factions);
  state.activeCrises = JSON.stringify(activeCrises);
  state.activeLaws = JSON.stringify(activeLaws);
  state.ministers = JSON.stringify(ministers);
  state.activePetitions = JSON.stringify(activePetitions);
  state.turnReports = JSON.stringify(turnReports);

  return {
    taxIncome,
    maintenanceCost,
    dominoEffects: [],
    tradeIncome,
    newEvents,
    gameState: state,
  };
}

// ============================================
// G. OYUN SONU KONTROLÜ
// ============================================
export function checkGameOver(state: GameState): string | null {
  // Tur limiti yok — oyun sadece stat başarısızlıkları veya seçim kaybıyla biter
  if (state.popularity <= 0) return "SEÇİM HEZİMETİ! Halk desteği sıfıra indi.";
  if (state.stability <= 0) return "İÇ SAVAŞ! İstikrar sıfıra düştü.";
  if (state.health <= 0) return "SAĞLIK FELAKETİ! Salgın hastalıklar ülkeyi kasıp kavurdu.";
  if (state.military <= 0 && state.foreignRelations < 20) return "İŞGAL! Ülkeniz işgal edildi.";

  try {
    const factions = JSON.parse(state.factions);
    if (factions?.military?.support < 10) return "ASKERİ DARBE! Ordu yönetime el koydu.";
    if (factions?.workers?.support < 10) return "GENEL GREV VE İSYAN! İşçi sınıfı ülkeyi kilitledi ve rejim düştü.";
    if (factions?.capitalists?.support < 10) return "SERMAYE KAÇIŞI! Ekonomik çöküş nedeniyle hükümet düştü.";
  } catch (e) {}

  return null;
}

// ============================================
// H. YATIRIM UYGULA
// ============================================
export function applyInvestment(
  state: GameState,
  sector: string,
  amount: number
): { newState: GameState; actualAmount: number } {
  const actualAmount = Math.min(amount, Math.max(0, state.budget));
  if (actualAmount <= 0) return { newState: state, actualAmount: 0 };

  const efficiencyMultiplier = 1 + (state.education > 50 ? (state.education - 50) / 100 : 0);
  const effectiveAmount = actualAmount * efficiencyMultiplier;

  let currentStat = 50;
  if (sector === "popularityFund") {
    const popGained = Math.floor(effectiveAmount / 5000);
    if (popGained <= 0) return { newState: state, actualAmount: 0 };
    
    const finalAmount = Math.ceil((popGained * 5000) / efficiencyMultiplier);
    const newState = { ...state, budget: state.budget - finalAmount };
    
    newState.popularity = clampStat(newState.popularity + popGained);
    // Fraksiyonları da otomatik yükselt
    let factions: FactionsState = INITIAL_FACTIONS;
    try { factions = JSON.parse(newState.factions); } catch { factions = INITIAL_FACTIONS; }
    factions = modifyFactionSupport(factions, {
      workers: popGained, capitalists: popGained, intellectuals: popGained, nationalists: popGained, military: popGained
    });
    newState.factions = JSON.stringify(factions);
    return { newState, actualAmount: finalAmount };
  }
  
  if (sector === "politicalFund") {
    const pcGained = Math.floor(effectiveAmount / 400);
    if (pcGained <= 0) return { newState: state, actualAmount: 0 };
    
    const finalAmount = Math.ceil((pcGained * 400) / efficiencyMultiplier);
    const newState = { ...state, budget: state.budget - finalAmount };
    
    newState.politicalCapital += pcGained;
    return { newState, actualAmount: finalAmount };
  }

  switch (sector) {
    case "military": currentStat = state.military; break;
    case "health": currentStat = state.health; break;
    case "education": currentStat = state.education; break;
    case "environment": currentStat = state.environment; break;
    case "stability": currentStat = state.stability; break;
    case "foreignRelations": currentStat = state.foreignRelations; break;
  }

  // Üstel Azalan Getiri (Exponential Diminishing Returns)
  // Maliyetler statü yükseldikçe inanılmaz bir hızla artar.
  // Oyuncunun açık (exploit) yapmasını engellemek için maliyetler her puan için ayrı hesaplanır.
  let pointsGained = 0;
  let totalEffectiveCost = 0;
  let tempStat = currentStat;

  while (tempStat < 100) {
    const costForNext = 250 * Math.pow(1.045, tempStat);
    if (totalEffectiveCost + costForNext <= effectiveAmount) {
      pointsGained++;
      totalEffectiveCost += costForNext;
      tempStat++;
    } else {
      break;
    }
  }

  if (pointsGained <= 0) return { newState: state, actualAmount: 0 };

  // Fazla yatırılan (kullanılmayan) parayı bütçeye iade et
  const finalActualAmount = Math.ceil(totalEffectiveCost / efficiencyMultiplier);
  const newState = { ...state, budget: state.budget - finalActualAmount };

  switch (sector) {
    case "military": newState.military = clampStat(newState.military + pointsGained); break;
    case "health": newState.health = clampStat(newState.health + pointsGained); break;
    case "education": newState.education = clampStat(newState.education + pointsGained); break;
    case "environment": newState.environment = clampStat(newState.environment + pointsGained); break;
    case "stability": newState.stability = clampStat(newState.stability + pointsGained); break;
    case "foreignRelations": newState.foreignRelations = clampStat(newState.foreignRelations + pointsGained); break;
  }

  // Yatırım yapıldığında fraksiyonlara anlık destek ver (Kazanılan statü puanına oranla)
  let factions: FactionsState = INITIAL_FACTIONS;
  try { factions = JSON.parse(newState.factions); } catch { factions = INITIAL_FACTIONS; }
  
  const factionGain = pointsGained;
  if (factionGain > 0) {
    if (sector === "military") factions = modifyFactionSupport(factions, { military: factionGain, nationalists: Math.floor(factionGain / 2) });
    if (sector === "health" || sector === "education") factions = modifyFactionSupport(factions, { workers: factionGain, intellectuals: Math.floor(factionGain / 2) });
  }
  
  newState.factions = JSON.stringify(factions);

  return { newState, actualAmount: finalActualAmount };
}

// ============================================
// I. ZAFER KONTROLÜ
// ============================================
export function checkVictory(state: GameState): string | null {
  // TEK ZAFER KOŞULU: Tüm Teknolojiler (8/8) + Tüm Mega Projeler (4/4)
  let unlockedTechs: string[] = [];
  try { unlockedTechs = JSON.parse(state.unlockedTechs || "[]"); } catch {}

  let completedProjects: string[] = [];
  try { completedProjects = JSON.parse(state.megaProjects || "[]"); } catch {}

  const ALL_TECH_IDS: TechId[] = ["modern_agriculture", "ai_infrastructure", "advanced_robotics", "cyber_warfare", "gene_therapy", "quantum_computing", "fusion_power", "space_mining"];
  const ALL_MEGA_IDS = Object.keys(MEGA_PROJECTS);

  const allTechsDone = ALL_TECH_IDS.every(t => unlockedTechs.includes(t));
  const allMegaDone = ALL_MEGA_IDS.every(m => completedProjects.includes(m));

  if (allTechsDone && allMegaDone) {
    return "ÜTOPYA ÇAĞI! Tüm teknolojileri araştırdınız, tüm mega projeleri tamamladınız ve insanlığı yeni bir çağa taşıdınız. Ülkeniz tarihin en büyük medeniyeti olarak anılacak!";
  }

  return null;
}

// ============================================
// I. DİNAMİK TİCARET VE RİSK PROFİLİ
// ============================================

export interface TradeRiskProfile {
  level: "Düşük" | "Orta" | "Yüksek" | "Çok Yüksek";
  successChance: number;
  minReturn: number; 
  maxReturn: number; 
  minLoss: number;   
  maxLoss: number;   
  diplomaticCost: number; 
}

export function calculateTradeRiskProfile(
  isPlayer: boolean, 
  stability: number, 
  military: number, 
  relationship: number
): TradeRiskProfile {
  let successChance = 0;
  
  if (isPlayer) {
    // İç Ticaret (Yerel)
    successChance = 0.5 + (stability / 200); // %50 ile %100 arası başarı
    return {
      level: stability > 70 ? "Düşük" : (stability < 40 ? "Yüksek" : "Orta"),
      successChance,
      minReturn: 0.10, // %10
      maxReturn: 0.30, // %30
      minLoss: 0.20,
      maxLoss: 0.50,
      diplomaticCost: 0
    };
  }

  // Dış Ticaret (Yabancı)
  successChance = relationship / 100;

  if (stability > 75) {
    // Güvenli ama düşük kar
    return {
      level: "Düşük",
      successChance: Math.min(0.95, successChance + 0.15),
      minReturn: 0.05,
      maxReturn: 0.20,
      minLoss: 0.10,
      maxLoss: 0.25,
      diplomaticCost: 5
    };
  } else if (stability < 40 || military > 80) {
    // Yüksek risk, yüksek getiri
    return {
      level: "Çok Yüksek",
      successChance: Math.max(0.1, successChance - 0.25), // Çok riskli
      minReturn: 0.50,
      maxReturn: 1.50, // %150 kar
      minLoss: 0.60,
      maxLoss: 1.00,   // %100 zarar
      diplomaticCost: 5
    };
  } else {
    // Ortalama
    return {
      level: "Orta",
      successChance: successChance,
      minReturn: 0.20,
      maxReturn: 0.50,
      minLoss: 0.30,
      maxLoss: 0.70,
      diplomaticCost: 5
    };
  }
}

// ============================================
// J. BAŞARIM (ACHIEVEMENT) KONTROLÜ
// ============================================
import { Achievement } from "./types";

export const ACHIEVEMENTS_DATA: Achievement[] = [
  { id: "mars_30", title: "Uzay Öncüsü", description: "Mars Kolonisini 30 Turda Kuran İlk Başkan", icon: "🚀" },
  { id: "utopia_peace", title: "Barışçıl Ütopya", description: "Yüksek dış ilişkilerle Ütopya Şehrini İnşa Eden Lider", icon: "🕊️" },
  { id: "pop_idol", title: "Halkın Sevgilisi", description: "Başkanlık desteğini %95'in üzerine çıkar", icon: "💖" },
  { id: "economic_miracle", title: "Ekonomik Mucize", description: "Enflasyonu %2'ye düşürüp devasa bütçe yap", icon: "💹" },
  { id: "eco_warrior", title: "Eko Savaşçı", description: "Çevreyi %95 yapıp kıtlığı bitir", icon: "🌳" }
];

export function checkAchievements(state: GameState): { newAchievements: Achievement[], updatedAchievementsStr: string } {
  let unlockedIds: string[] = [];
  try { unlockedIds = JSON.parse(state.achievements || "[]"); } catch {}

  let completedProjects: string[] = [];
  try { completedProjects = JSON.parse(state.megaProjects || "[]"); } catch {}

  const newlyUnlocked: Achievement[] = [];

  // Check conditions
  if (!unlockedIds.includes("mars_30") && state.turn <= 30 && completedProjects.includes("mars_colony")) {
    newlyUnlocked.push(ACHIEVEMENTS_DATA.find(a => a.id === "mars_30")!);
  }
  if (!unlockedIds.includes("utopia_peace") && state.foreignRelations >= 70 && completedProjects.includes("utopia_city")) {
    newlyUnlocked.push(ACHIEVEMENTS_DATA.find(a => a.id === "utopia_peace")!);
  }
  if (!unlockedIds.includes("pop_idol") && state.popularity >= 95) {
    newlyUnlocked.push(ACHIEVEMENTS_DATA.find(a => a.id === "pop_idol")!);
  }
  if (!unlockedIds.includes("economic_miracle") && state.budget >= 1000000 && state.inflation <= 2) {
    newlyUnlocked.push(ACHIEVEMENTS_DATA.find(a => a.id === "economic_miracle")!);
  }
  if (!unlockedIds.includes("eco_warrior") && state.environment >= 95 && state.food >= 90) {
    newlyUnlocked.push(ACHIEVEMENTS_DATA.find(a => a.id === "eco_warrior")!);
  }

  const allUnlockedIds = [...unlockedIds, ...newlyUnlocked.map(a => a.id)];
  
  return {
    newAchievements: newlyUnlocked,
    updatedAchievementsStr: JSON.stringify(allUnlockedIds)
  };
}
