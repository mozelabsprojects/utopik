// =============================================
// YourUtopia — Oyun Motoru (Game Engine)
// Tüm hesaplamalar, domino etkileri ve denge
// =============================================
import { StatEffects, DominoEffect, TurnResult, GameState } from "./types";
import { getRandomEvents, EVENTS } from "./events-data";
import { FactionsState, modifyFactionSupport, INITIAL_FACTIONS, FactionId } from "./factions";
import { CRISES, CrisisId } from "./crises-missions";
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

export function getDetailedMaintenanceCost(military: number, health: number, education: number, environment: number, stability: number, eventFlags: string[] = [], budget: number = 0, difficulty: string = "Orta", unlockedTechs: string[] = [], inflation: number = 5.0, population: number = 10.0) {
  // Nüfus ölçeklendirmesi: Karesel kök (Square Root) yaklaşımı
  // Eskiden 1400m pop -> çarpan 140'tı. Şimdi 1400 -> çarpan ~3.7, 10 -> çarpan ~1.
  const popScale = Math.max(0.8, Math.sqrt(population / 10));
  
  let militaryCost = military * 12 * popScale;
  let healthCost = health * 10 * popScale;
  let educationCost = education * 10 * popScale;
  let environmentCost = environment * 8 * popScale; // Çevre koruma maliyeti
  
  if (military > 50) militaryCost += Math.pow(military - 50, 1.5) * 4 * popScale; 
  if (health > 50) healthCost += Math.pow(health - 50, 1.5) * 3 * popScale;
  if (education > 50) educationCost += Math.pow(education - 50, 1.5) * 3 * popScale;
  if (environment > 50) environmentCost += Math.pow(environment - 50, 1.5) * 2 * popScale;

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

export function calculateMaintenanceCost(military: number, health: number, education: number, environment: number, stability: number, eventFlags: string[] = [], budget: number = 0, difficulty: string = "Orta", unlockedTechs: string[] = [], inflation: number = 5.0, population: number = 10.0): number {
  return getDetailedMaintenanceCost(military, health, education, environment, stability, eventFlags, budget, difficulty, unlockedTechs, inflation, population).total;
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
  // Nüfus ölçeklendirmesi: Karesel kök (Square Root) yaklaşımı
  const popScale = Math.max(0.8, Math.sqrt(population / 10));

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
    eventFlags, state.budget, difficulty, unlockedTechs, currentInflation, state.population
  );

  let special = 0;
  if (state.countryName === "Kuzey Kore") {
    // Zorunlu askerlik indirimi
    const conscriptionDiscount = Math.round(maintenance * 0.5);
    maintenance -= conscriptionDiscount;
    if (state.stability >= 85) special += 1500; // Juche bonus
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
      const statKey = key as keyof GameState;
      if (typeof newState[statKey] === "number" && statKey !== "turn" && statKey !== "bankruptTurns") {
        const adjustedValue =
          value < 0
            ? Math.round(value * costMultiplier)
            : Math.round(value * benefitMultiplier);
        
        if (statKey === "politicalCapital") {
          (newState[statKey] as number) = Math.min(999, Math.max(0, (newState[statKey] as number) + adjustedValue));
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
// F. TUR ATLAMA — ANA HESAPLAMA
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
    state.population
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
  // AR-GE PUANI (RESEARCH POINTS) ÜRETİMİ
  // ==========================================
  let baseRP = 2; // Başlangıçta kazanmak artık çok daha zor
  
  if (state.education > 60) {
    baseRP += Math.round((state.education - 60) / 3);
  } else if (state.education < 40) {
    baseRP = Math.max(0, baseRP - 1);
  }

  if (unlockedTechs.includes("quantum_computing")) {
    baseRP = Math.round(baseRP * 1.5);
  }
  
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

  // 7. İflas Kontrolü ve IMF Müdahalesi
  const popScale = Math.max(0.8, Math.sqrt(state.population / 10));
  const dynamicBailoutLimit = -5000 * popScale;

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
    turnReports.push(`☠️ DEVLET İFLAS ETTİ! Memur maaşları ödenemiyor, halk isyan eşiğinde (Mutluluk ve İstikrar -15).`);
  } else if (state.isBankrupt) {
    if (state.budget < 0) {
      // Ölüm sarmalını yavaşlatmak için ceza düşürüldü
      state.happiness = clampStat(state.happiness - 5);
      state.stability = clampStat(state.stability - 5);
      turnReports.push(`🚨 İFLAS SÜRÜYOR: Ülke iflas durumunda olduğu için halk çok mutsuz (Mutluluk ve İstikrar -5).`);
    }
    
    if (state.bankruptTurns > 0) {
      state.bankruptTurns--;
    }
    if (state.bankruptTurns === 0 && state.budget >= 0) {
      state.isBankrupt = false;
      turnReports.push(`✅ İflas dönemi sona erdi. Ekonomi toparlanıyor.`);
    }
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

  // Kaynak Krizleri
  if (state.food <= 0) {
    state.health = clampStat(state.health - 5);
    state.happiness = clampStat(state.happiness - 5);
    turnReports.push(`🌾 AÇLIK KRİZİ: Ülkede gıda stokları tükendi! Halk açlıktan kırılıyor (Sağlık ve Mutluluk -5).`);
  } else if (state.food > 90) {
    state.health = clampStat(state.health + 1);
  }

  if (state.energy <= 0) {
    state.budget = state.budget - (1000 * popScaleForResources);
    state.stability = clampStat(state.stability - 5);
    turnReports.push(`⚡ ENERJİ KRİZİ: Elektrik kesintileri sanayiyi durdurdu! Ekonomi ağır hasar aldı (Bütçe ve İstikrar düştü).`);
  }

  if (state.materials <= 0) {
    state.military = clampStat(state.military - 5);
    state.education = clampStat(state.education - 2);
    turnReports.push(`⚙️ MATERYAL EKSİKLİĞİ: Hammadde yetersizliğinden ordu ve altyapı bakımları yapılamıyor (Askeriye -5, Eğitim -2).`);
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
  state.politicalCapital = Math.min(999, Math.max(0, state.politicalCapital + 5));

  // 8.6 Aktif Görevlerin Süresini Düşür ve Başarısızlıkları Kontrol Et
  let activeQuests: any[] = [];
  try { activeQuests = JSON.parse(state.activeQuests || "[]"); } catch {}
  
  const remainingQuests = [];
  for (const quest of activeQuests) {
    quest.turnsRemaining--;
    if (quest.turnsRemaining <= 0) {
      turnReports.push(`❌ GÖREV BAŞARISIZ: ${quest.title} - ${quest.failureText || "Halkın taleplerini yerine getiremediniz."}`);
      if (quest.failureEffects) {
        Object.assign(state, applyEffects(state, quest.failureEffects, state.isBankrupt));
      }
    } else {
      remainingQuests.push(quest);
    }
  }
  
  // Eğer görev yoksa %20 ihtimalle yeni bir görev ver
  if (remainingQuests.length === 0 && Math.random() < 0.20) {
    const sectors = ["health", "education", "environment", "military", "popularity"];
    const randSector = sectors[Math.floor(Math.random() * sectors.length)];
    const currentValue = state[randSector as keyof GameState] as number;
    const targetVal = Math.min(100, Math.round(currentValue + 15));
    const isBudgetReward = Math.random() > 0.5;
    
    let sectorName = "";
    if (randSector === "health") sectorName = "Sağlık";
    else if (randSector === "education") sectorName = "Eğitim";
    else if (randSector === "environment") sectorName = "Çevre";
    else if (randSector === "military") sectorName = "Askeriye";
    else sectorName = "Başkanlık Desteği (Popülarite)";

    const newQuest = {
      id: "quest_" + Date.now().toString(),
      title: "Halkın Yeni Talebi",
      description: `Halk, önümüzdeki 4 tur içinde ${sectorName} seviyesinin ${targetVal} olmasını talep ediyor.`,
      targetSector: randSector,
      targetValue: targetVal,
      turnsRemaining: 4,
      rewardText: isBudgetReward ? "Hazine Geliri ($2000)" : "Siyasi Sermaye (+20)",
      rewardEffects: isBudgetReward ? { budget: 2000 } : { politicalCapital: 20 },
      failureText: "Talep karşılanamadı, halk desteği düşüyor.",
      failureEffects: { popularity: -10, stability: -5 }
    };
    remainingQuests.push(newQuest);
    turnReports.push(`📜 YENİ HALK TALEBİ: ${newQuest.description}`);
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
  if (state.turn >= 150) return "SÜRE DOLDU! 150 Tur süreniz doldu ve nihai hedeflerinize ulaşamadınız. İktidarınız sıradan bir şekilde sona erdi.";
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
  // 1. Bilimsel & Teknoloji Zaferi
  let unlockedTechs: string[] = [];
  try { unlockedTechs = JSON.parse(state.unlockedTechs || "[]"); } catch {}
  
  if (unlockedTechs.includes("space_mining") || unlockedTechs.length >= 8) {
    return "BİLİMSEL HAKİMİYET: Tüm teknoloji ağacını tamamladınız, uzay madenciliğine başladınız ve insanlığı yeni bir bilim çağına taşıdınız!";
  }

  // 2. Ekonomik Süper Güç Zaferi
  if (state.budget >= 300000) {
    return "EKONOMİK SÜPER GÜÇ: Ülke hazinesini $300,000 seviyesinin üzerine çıkararak dünya ekonomisinin tek hakimi oldunuz!";
  }

  // 3. Askeri Hegemonya Zaferi
  if (state.military >= 95 && state.stability >= 85) {
    return "ASKERİ HEGEMONYA: Dünyanın en caydırıcı ordusunu kurdunuz ve uluslararası dengeleri mutlak askeri gücünüzle belirlediniz!";
  }

  // 4. Diplomatik / Ütopik Barış Zaferi
  if (state.foreignRelations >= 95 && state.happiness >= 85 && state.stability >= 85) {
    return "KÜRESEL BARIŞ İTTİFAKI: Tüm uluslar arasında sarsılmaz bir barış köprüsü kurdunuz ve Ütopya toplumunu yarattınız!";
  }

  // 5. 100 Tur Dayanma Ütopya Zaferi
  if (state.turn >= 100) {
    if (state.education > 80 && state.health > 80 && state.stability > 80 && state.happiness > 80) {
      return "ÜTOPYA ÇAĞI: 100 Tur boyunca devleti yüksek bir refah seviyesinde başarıyla yönettiniz!";
    }
  }

  // 6. Mega Proje Zaferleri
  let completedProjects: string[] = [];
  try { completedProjects = JSON.parse(state.megaProjects || "[]"); } catch {}
  
  for (const projId of completedProjects) {
    const project = MEGA_PROJECTS[projId as keyof typeof MEGA_PROJECTS];
    if (project && project.isVictoryCondition) {
      return `${project.name} projesini başarıyla tamamlayarak zafer kazandınız!`;
    }
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
