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

// ============================================
// SABITLER
// ============================================
const BASE_INCOME = 4500; // Artırıldı (Eskiden 3500)
const CRITICAL_THRESHOLD = 30;
const BANKRUPTCY_BUDGET_LIMIT = -5000;
const BANKRUPTCY_DURATION = 3;

// ============================================
// A. BAKIM MALİYETLERİ
import { COUNTRIES } from "./countries-data";

export function getDetailedMaintenanceCost(military: number, health: number, education: number, environment: number, stability: number, eventFlags: string[] = [], budget: number = 0, difficulty: string = "Orta") {
  let militaryCost = military * 1.5;
  let healthCost = health * 1.0;
  let educationCost = education * 1.0;
  let environmentCost = environment * 0.5; // Çevre koruma maliyeti
  
  if (military > 50) militaryCost += Math.pow(military - 50, 1.2) * 0.7; // Ölçekleme biraz yumuşatıldı
  if (health > 50) healthCost += Math.pow(health - 50, 1.2) * 0.4;
  if (education > 50) educationCost += Math.pow(education - 50, 1.2) * 0.4;
  if (environment > 50) environmentCost += Math.pow(environment - 50, 1.2) * 0.3;

  let total = militaryCost + healthCost + educationCost + environmentCost;
  
  let leaderDiscount = 0;
  if (eventFlags.includes("LEADER_GENERAL")) {
    leaderDiscount = total * 0.2;
    total -= leaderDiscount; 
  }

  let sickPenalty = 0;
  if (health < 40) {
    sickPenalty = (40 - health) * 2;
    total += sickPenalty;
  }

  let corruptionPenalty = 0;
  // Yeni Yolsuzluk Mekaniği: İstikrar 50'nin altındaysa direkt olarak sabit yüksek bir ceza (ülkenin gelirlerine çöküyorlar).
  // Kasada para olmasa bile eksiye düşürebilir (borçlandırır).
  if (stability < 50) {
    const instabilityFactor = (50 - stability); // 1 ile 50 arası
    corruptionPenalty = instabilityFactor * 150; // Max 7500$ ceza (İstikrar 0 ise)
    total += corruptionPenalty;
  }

  let difficultyMultiplier = 1.0;
  if (difficulty === "Kolay") difficultyMultiplier = 0.8;
  if (difficulty === "Zor") difficultyMultiplier = 1.2;
  if (difficulty === "Çok Zor") difficultyMultiplier = 1.5;

  const baseTotal = total;
  total = total * difficultyMultiplier;

  return {
    total: Math.round(total),
    militaryCost: Math.round(militaryCost),
    healthCost: Math.round(healthCost),
    educationCost: Math.round(educationCost),
    environmentCost: Math.round(environmentCost),
    leaderDiscount: Math.round(leaderDiscount),
    sickPenalty: Math.round(sickPenalty),
    corruptionPenalty: Math.round(corruptionPenalty),
    difficultyMultiplier: Number(difficultyMultiplier.toFixed(2))
  };
}

export function calculateMaintenanceCost(military: number, health: number, education: number, environment: number, stability: number, eventFlags: string[] = [], budget: number = 0, difficulty: string = "Orta"): number {
  return getDetailedMaintenanceCost(military, health, education, environment, stability, eventFlags, budget, difficulty).total;
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
  difficulty: string = "Orta"
) {
  // Statların kalıcı getiri (Passive Income) sağlaması
  const educationBonus = education > 50 ? (education - 50) * 15 : 0; // İnovasyon
  const healthBonus = health > 50 ? (health - 50) * 12 : 0; // Sağlıklı iş gücü verimliliği
  const environmentBonus = environment > 50 ? (environment - 50) * 10 : 0; // Yeşil ekonomi / Eko Turizm
  const militaryBonus = military > 60 ? (military - 60) * 8 : 0; // Silah sanayisi ihracatı

  const statBonusTotal = educationBonus + healthBonus + environmentBonus + militaryBonus;

  const stabilityMultiplier = 0.5 + (stability / 200); 
  const happinessMultiplier = 0.5 + (happiness / 200); 
  const capitalistsBonus = capitalistsSupport > 70 ? 1.2 : (capitalistsSupport < 30 ? 0.8 : 1);

  const baseTotal = BASE_INCOME + statBonusTotal;
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

  return {
    total: Math.round(total),
    baseIncome: BASE_INCOME,
    educationBonus: Math.round(educationBonus),
    healthBonus: Math.round(healthBonus),
    environmentBonus: Math.round(environmentBonus),
    militaryBonus: Math.round(militaryBonus),
    stabilityMultiplier: Number(stabilityMultiplier.toFixed(2)),
    happinessMultiplier: Number(happinessMultiplier.toFixed(2)),
    capitalistsBonus: Number(capitalistsBonus.toFixed(2)),
    leaderBonus: Math.round(leaderBonus),
    multipliersCombined: Number((stabilityMultiplier * happinessMultiplier * capitalistsBonus).toFixed(2)),
    difficultyMultiplier: Number(difficultyMultiplier.toFixed(2))
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
  difficulty: string = "Orta"
): number {
  return getDetailedTaxIncome(education, health, environment, military, stability, happiness, capitalistsSupport, eventFlags, difficulty).total;
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
  let relationship = baseRel - (ideologyDiff * 0.25) + wealthModifier;
  
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
  let state = { ...currentState };
  
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

  let turnReports: string[] = [];
  turnReports.push(`📅 Tur ${state.turn} başladı.`);

  // 1. Yasaların (Policies) Pasif Etkileri
  activeLaws.forEach(lawId => {
    const law = POLICIES[lawId];
    if (law.passiveEffects.budget) state.budget += law.passiveEffects.budget;
    if (law.passiveEffects.stability) state.stability = clampStat(state.stability + law.passiveEffects.stability);
    if (law.passiveEffects.happiness) state.happiness = clampStat(state.happiness + law.passiveEffects.happiness);
    if (law.passiveEffects.health) state.health = clampStat(state.health + law.passiveEffects.health);
    if (law.passiveEffects.military) state.military = clampStat(state.military + law.passiveEffects.military);
    if (law.passiveEffects.environment) state.environment = clampStat(state.environment + law.passiveEffects.environment);
    if (law.passiveEffects.education) state.education = clampStat(state.education + law.passiveEffects.education);
    
    // Fraksiyonlar üzerindeki pasif etki
    if (law.passiveFactionEffects) {
      factions = modifyFactionSupport(factions, law.passiveFactionEffects);
    }
  });

  // 1.5 Bakanların (Ministers) Pasif Etkileri ve İstifa Kontrolü
  const currentMinisters = Object.entries(ministers);
  for (const [key, ministerId] of currentMinisters) {
    const minister = MINISTERS[ministerId as MinisterId];
    if (minister) {
      const requiredFactionSupport = factions[minister.requiredFactionId]?.support || 50;
      if (requiredFactionSupport < 20) {
        // İSTİFA ETTİ
        turnReports.push(`⚠️ BAKAN İSTİFASI: ${minister.avatar} ${minister.name} (${minister.title}), temsil ettiği kesime ters düştüğünüz için istifa etti! İstikrar düştü.`);
        state.stability = clampStat(state.stability - 10);
        delete ministers[key];
        continue;
      }

      if (minister.passiveEffects.budget) state.budget += minister.passiveEffects.budget;
      if (minister.passiveEffects.military) state.military = clampStat(state.military + minister.passiveEffects.military);
      if (minister.passiveEffects.happiness) state.happiness = clampStat(state.happiness + minister.passiveEffects.happiness);
      if (minister.passiveEffects.education) state.education = clampStat(state.education + minister.passiveEffects.education);
      if (minister.passiveEffects.stability) state.stability = clampStat(state.stability + minister.passiveEffects.stability);
      if (minister.passiveEffects.foreignRelations) state.foreignRelations = clampStat(state.foreignRelations + minister.passiveEffects.foreignRelations);
      
      if (minister.passiveFactionEffects) {
        factions = modifyFactionSupport(factions, minister.passiveFactionEffects);
      }
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

  // 3. Vergi ve Bakım Hesaplamaları
  const taxIncome = calculateTaxIncome(
    state.education,
    state.health,
    state.environment,
    state.military,
    state.stability,
    state.happiness,
    factions.capitalists?.support || 50,
    eventFlags,
    difficulty
  );
  const maintenanceCost = calculateMaintenanceCost(
    state.military, 
    state.health, 
    state.education, 
    state.environment,
    state.stability,
    eventFlags, 
    state.budget, 
    difficulty
  );
  state.budget += taxIncome;
  state.budget -= maintenanceCost;
  state.budget += tradeIncome;
  turnReports.push(`💰 Vergi ve Ticaret gelirleri toplandı: +$${taxIncome + tradeIncome}`);
  turnReports.push(`🏢 Devlet altyapı bakım giderleri: -$${maintenanceCost}`);

  // ==========================================
  // ZORLUK DERECESİNE GÖRE SİYASİ SERMAYE (POLITICAL CAPITAL) DEĞİŞİMİ
  // ==========================================
  let diffPoliticalCapitalGain = 0;
  if (difficulty === "Kolay") diffPoliticalCapitalGain = 5;
  else if (difficulty === "Zor") diffPoliticalCapitalGain = -2;
  else if (difficulty === "Çok Zor") diffPoliticalCapitalGain = -5;
  
  if (diffPoliticalCapitalGain !== 0) {
    state.politicalCapital = Math.max(0, Math.min(500, state.politicalCapital + diffPoliticalCapitalGain));
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
  if (state.happiness < 40) {
    factions = modifyFactionSupport(factions, { workers: -2, intellectuals: -1 });
    turnReports.push(`📉 Halkın mutsuzluğu işçileri ve aydınları tedirgin ediyor.`);
  }
  if (state.health < 40) {
    factions = modifyFactionSupport(factions, { workers: -2 });
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

  // 7. İflas Kontrolü
  if (state.budget < 0 && !state.isBankrupt) {
    state.isBankrupt = true;
    state.bankruptTurns = BANKRUPTCY_DURATION;
    state.happiness = clampStat(state.happiness - 15);
    state.stability = clampStat(state.stability - 15);
    turnReports.push(`☠️ DEVLET İFLAS ETTİ! Memur maaşları ödenemiyor, halk isyan eşiğinde (Mutluluk ve İstikrar -15).`);
  } else if (state.isBankrupt) {
    if (state.budget < 0) {
      state.happiness = clampStat(state.happiness - 10);
      state.stability = clampStat(state.stability - 10);
      turnReports.push(`🚨 İFLAS SÜRÜYOR: Ülke iflas durumunda olduğu için halk çok mutsuz (Mutluluk ve İstikrar -10).`);
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
  state.military = clampStat(state.military - 1);
  state.stability = clampStat(state.stability - 1);
  
  // Çevre bonusu: Temiz çevre sağlığı iyileştirir
  if (state.environment > 70) {
    state.health = clampStat(state.health + 1);
  }
  
  // Mutluluk ve sağlık her 2 turda 1 düşer, çevre doğal olarak düşmez (sadece krizlerle)
  if (state.turn % 2 === 0) {
    state.happiness = clampStat(state.happiness - 1);
    state.health = clampStat(state.health - 1);
  }
  
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
  const totalSupport = 
    (factions.capitalists?.support ?? 50) + 
    (factions.workers?.support ?? 50) + 
    (factions.military?.support ?? 50) + 
    (factions.intellectuals?.support ?? 50) + 
    (factions.nationalists?.support ?? 50);
  
  state.popularity = Math.round(totalSupport / 5);
  state.politicalCapital = Math.min(999, Math.max(0, state.politicalCapital + 5));

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
  if (state.popularity <= 0) return "SEÇİM HEZİMETİ! Halk desteği sıfıra indi.";
  if (state.stability <= 0) return "İÇ SAVAŞ! İstikrar sıfıra düştü.";
  if (state.budget < BANKRUPTCY_BUDGET_LIMIT) return "DEVLET İFLASI! IMF ülkenin yönetimini devraldı.";
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

  const newState = { ...state };
  newState.budget -= actualAmount;

  const efficiencyMultiplier = 1 + (state.education > 50 ? (state.education - 50) / 100 : 0);
  const effectiveAmount = actualAmount * efficiencyMultiplier;

  let currentStat = 50;
  switch (sector) {
    case "military": currentStat = state.military; break;
    case "health": currentStat = state.health; break;
    case "education": currentStat = state.education; break;
    case "environment": currentStat = state.environment; break;
    case "stability": currentStat = state.stability; break;
    case "foreignRelations": currentStat = state.foreignRelations; break;
  }

  // Üstel Azalan Getiri (Exponential Diminishing Returns)
  // Maliyetler statü yükseldikçe inanılmaz bir hızla artar. Fulleme hilesini engeller.
  // 10 Stat -> ~179$, 50 Stat -> ~1842$, 90 Stat -> ~18946$, 99 Stat -> ~32000$
  const costPerPoint = 100 * Math.pow(1.06, currentStat);
  const pointsGained = Math.round(effectiveAmount / costPerPoint);

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
  
  const factionGain = Math.floor(pointsGained / 2); // Her 2 puan için 1 fraksiyon desteği
  if (factionGain > 0) {
    if (sector === "military") factions = modifyFactionSupport(factions, { military: factionGain, nationalists: Math.floor(factionGain / 2) });
    if (sector === "health" || sector === "education") factions = modifyFactionSupport(factions, { workers: factionGain, intellectuals: Math.floor(factionGain / 2) });
  }
  
  newState.factions = JSON.stringify(factions);

  return { newState, actualAmount };
}

// ============================================
// I. ZAFER KONTROLÜ
// ============================================
export function checkVictory(state: GameState): string | null {
  if (state.turn >= 100) {
    if (state.education > 90 && state.health > 90 && state.stability > 90 && state.happiness > 90) {
      return "ÜTOPYA ÇAĞI: 100 Tur boyunca devleti bir ütopya seviyesinde yönettiniz!";
    }
  }

  // Mega projelere bak
  let completedProjects: string[] = [];
  try { completedProjects = JSON.parse(state.megaProjects || "[]"); } catch {}
  
  for (const projId of completedProjects) {
    const project = MEGA_PROJECTS[projId as keyof typeof MEGA_PROJECTS];
    if (project && project.isVictoryCondition) {
      return `${project.name} projesini başarıyla tamamladınız!`;
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
