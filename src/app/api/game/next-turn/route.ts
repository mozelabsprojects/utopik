import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processNextTurn, clampStat, calculateRelationship } from "@/lib/game-engine";
import { GameState, MarketState } from "@/lib/types";
import { INITIAL_FACTIONS, modifyFactionSupport, FactionsState } from "@/lib/factions";

export async function POST(request: Request) {
  try {
    const { gameId } = await request.json();

    const game = await prisma.game.findUnique({ 
      where: { id: gameId },
      include: {
        tradeAgreements: true,
        worldCountries: true,
      }
    });

    if (!game) {
      return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
    }

    if (game.isGameOver) {
      return NextResponse.json({ error: "Oyun bitti" }, { status: 400 });
    }

    if (game.currentEventId) {
      return NextResponse.json(
        { error: "Önce mevcut olayda bir seçim yapmalısınız!" },
        { status: 400 }
      );
    }

    // Turn reports ve ticaret gelirleri
    let currentReports: string[] = [];
    try { currentReports = JSON.parse(game.turnReports); } catch {}

    let tradeIncome = 0;
    const activeAgreements = [];
    for (const trade of game.tradeAgreements) {
      if (trade.turnsRemaining > 0) {
        tradeIncome += trade.incomePerTurn;
        activeAgreements.push({
          id: trade.id,
          turnsRemaining: trade.turnsRemaining - 1
        });
      }
    }

    // Ticaret sürelerini güncelle (süresi bitenleri sil, bitmeyenlerin süresini azalt)
    await prisma.tradeAgreement.deleteMany({
      where: { gameId: game.id, turnsRemaining: { lte: 1 } }
    });
    for (const active of activeAgreements) {
      if (active.turnsRemaining > 0) {
        await prisma.tradeAgreement.update({
          where: { id: active.id },
          data: { turnsRemaining: active.turnsRemaining }
        });
      }
    }

    let totalAiAttackDamage = 0;
    let aiFinancialAid = 0;
    let totalWarExhaustion = 0;
    let isAtWar = false;
    let activeAlliesCount = 0;
    const aiMessages: string[] = [];

    // Diplomacy ve Market State'lerini parse et
    let diplomacyState: Record<string, { type: 'war' | 'alliance', turnsRemaining: number }> = {};
    try { diplomacyState = JSON.parse(game.diplomacyState); } catch {}
    
    // Fraksiyonları parse et (Savaş domino etkileri için)
    let factions: FactionsState = INITIAL_FACTIONS;
    try { factions = JSON.parse(game.factions); } catch { factions = INITIAL_FACTIONS; }
    if (Object.keys(factions).length === 0) factions = INITIAL_FACTIONS;

    let marketState: MarketState = { 
      prices: { energy: 100, food: 50, tech: 200, medical: 150, arms: 300, minerals: 80 }, 
      inventory: { energy: 0, food: 0, tech: 0, medical: 0, arms: 0, minerals: 0 },
      history: []
    };
    try {
      const parsedMarket = JSON.parse(game.marketState);
      if (parsedMarket.prices && parsedMarket.inventory) {
        marketState = {
          ...parsedMarket,
          prices: { ...marketState.prices, ...parsedMarket.prices },
          inventory: { ...marketState.inventory, ...parsedMarket.inventory },
          history: parsedMarket.history || []
        };
      }
    } catch {}

    let eventFlags: string[] = [];
    try { eventFlags = JSON.parse(game.eventFlags || "[]"); } catch {}

    // Borsa Fiyat Dalgalanması (Event'lere Göre Dinamik)
    const multipliers = { energy: 1, food: 1, tech: 1, medical: 1, arms: 1, minerals: 1 };
    
    // Uzman süresini düş ve manipülasyon riskini hesapla
    let triggeredInvestigation = false;
    if (marketState.expertTurnsRemaining && marketState.expertTurnsRemaining > 0) {
      const riskChance = marketState.activeExpertLevel === 3 ? 0.15 : (marketState.activeExpertLevel === 2 ? 0.10 : 0.05);
      if (Math.random() < riskChance) {
        triggeredInvestigation = true;
      }

      marketState.expertTurnsRemaining -= 1;
      if (marketState.expertTurnsRemaining === 0) {
        marketState.activeExpertLevel = 0;
      }
    }

    if (!marketState.trends) {
      marketState.trends = {};
    }

    // ------------------------------------------
    // YENİ EŞSİZ EMTİA PROFİLLERİ (Tiers & Risk)
    // ------------------------------------------
    const COMMODITY_PROFILES = {
      food: { min: 10, max: 50, volatility: 0.03 },      // 3% max shift (Çok Düşük Risk, Güvenli)
      minerals: { min: 20, max: 120, volatility: 0.06 }, // 6% max shift (Düşük Risk)
      energy: { min: 50, max: 400, volatility: 0.10 },   // 10% max shift (Orta Risk)
      medical: { min: 100, max: 800, volatility: 0.12 }, // 12% max shift (Orta Yüksek Risk)
      arms: { min: 300, max: 2000, volatility: 0.18 },   // 18% max shift (Yüksek Risk)
      tech: { min: 500, max: 4000, volatility: 0.30 }    // 30% max shift (Balina / Kripto Sınıfı, Aşırı Risk)
    };

    // Mevcut (Eski) fiyatları arşive al (Bu sayede yüzdelik değişim UX bug'ı çözülür)
    marketState.history.push({
      turn: game.turn,
      prices: { ...marketState.prices }
    });
    // Sadece son 30 turu tut (optimizasyon)
    if (marketState.history.length > 30) {
      marketState.history.shift();
    }

    // Trend tabanlı dalgalanma (Yeni Risk Profilleriyle)
    const products = Object.keys(multipliers) as (keyof typeof multipliers)[];
    for (const key of products) {
      // Trend yoksa veya süresi bittiyse yeni trend oluştur
      if (!marketState.trends[key] || marketState.trends[key]!.turnsRemaining <= 0) {
        const r = Math.random();
        let dir: 'up' | 'down' | 'flat' = 'flat';
        if (r > 0.65) dir = 'up';
        else if (r < 0.35) dir = 'down';

        marketState.trends[key] = {
          direction: dir,
          turnsRemaining: Math.floor(Math.random() * 3) + 2 // 2 to 4 turns
        };
      } else {
        marketState.trends[key]!.turnsRemaining -= 1;
      }

      const dir = marketState.trends[key]!.direction;
      const vol = COMMODITY_PROFILES[key].volatility;
      
      if (dir === 'up') {
        multipliers[key] = 1.01 + (Math.random() * vol); 
      } else if (dir === 'down') {
        multipliers[key] = 1.0 - (0.01 + Math.random() * vol); 
      } else {
        multipliers[key] = 1.0 + (Math.random() * (vol/2) - (vol/4)); 
      }
    }

    // Event etkileri
    // Event etkileri (Kısmi olarak yumuşatıldı)
    if (eventFlags.includes("ENERGY_CRISIS")) multipliers.energy *= 1.30;
    if (eventFlags.includes("WAR_PREPARATION") || isAtWar) multipliers.arms *= 1.35;
    if (eventFlags.includes("WAR_PREPARATION") || isAtWar) multipliers.food *= 1.15;
    if (eventFlags.includes("PANDEMIC") || eventFlags.includes("VIRUS_OUTBREAK")) multipliers.medical *= 1.40;
    if (eventFlags.includes("TECH_BOOM")) multipliers.tech *= 1.25;
    if (eventFlags.includes("MINING_STRIKE")) multipliers.minerals *= 1.30;
    if (eventFlags.includes("ECONOMIC_BOOM")) {
      multipliers.energy *= 1.15;
      multipliers.minerals *= 1.20;
      multipliers.tech *= 1.15;
    }

    for (const key of products) {
      const prof = COMMODITY_PROFILES[key];
      marketState.prices[key] = Math.min(prof.max, Math.max(prof.min, marketState.prices[key] * multipliers[key]));
    }

    // ARTIK TAM SAYIYA YUVARLAMA YAPMIYORUZ (Fiyatlar arka planda ondalıklı tutulacak)
    // Böylece küçük yüzdelik değişimler kaybolmayacak ve grafikler düz çizgi kalmayacak.
    
    // --- Borsa Envanteri Stratejik Tüketim Sistemi ---
    const inv = marketState.inventory;
    const consumeAmt = 5;
    
    if (inv.energy >= consumeAmt) {
      inv.energy -= consumeAmt;
      game.budget += 150;
      currentReports.push(`⚡ Stratejik Tüketim: ${consumeAmt} birim Enerji tüketildi. Sanayi çarkları hızlandı (Bütçe +$150).`);
    }
    if (inv.food >= consumeAmt) {
      inv.food -= consumeAmt;
      game.happiness = clampStat(game.happiness + 1);
      game.health = clampStat(game.health + 1);
      currentReports.push(`🌾 Stratejik Tüketim: ${consumeAmt} birim Gıda tüketildi. Halkın refahı arttı (+1 Mutluluk, +1 Sağlık).`);
    }
    if (inv.medical >= consumeAmt) {
      inv.medical -= consumeAmt;
      game.health = clampStat(game.health + 2);
      currentReports.push(`🏥 Stratejik Tüketim: ${consumeAmt} birim Medikal ürün tüketildi. Hastaneler rahatladı (+2 Sağlık).`);
    }
    if (inv.arms >= consumeAmt) {
      inv.arms -= consumeAmt;
      game.military = clampStat(game.military + 2);
      currentReports.push(`🛡️ Stratejik Tüketim: ${consumeAmt} birim Silah tüketildi. Ordunun gücü artırıldı (+2 Askeriye).`);
    }
    if (inv.tech >= consumeAmt) {
      inv.tech -= consumeAmt;
      game.education = clampStat(game.education + 1);
      game.stability = clampStat(game.stability + 1);
      currentReports.push(`💻 Stratejik Tüketim: ${consumeAmt} birim Teknoloji tüketildi. Okullar ve altyapı modernleşti (+1 Eğitim, +1 İstikrar).`);
    }
    if (inv.minerals >= consumeAmt) {
      inv.minerals -= consumeAmt;
      game.budget += 200;
      currentReports.push(`🪨 Stratejik Tüketim: ${consumeAmt} birim Maden tüketildi. İhracat ve ağır sanayi desteklendi (Bütçe +$200).`);
    }
    // ------------------------------------------------

    // --- Borsa Envanteri Depo Bakım Masrafı (Hoarding Engeli) ---
    const totalInventory = Object.values(inv).reduce((sum, val) => sum + val, 0);
    if (totalInventory > 100) {
      // Her 10 birim ekstra mal için $5 bakım masrafı kesilir (veya her 100 için 50)
      const maintenanceCost = Math.floor(totalInventory / 10) * 5;
      game.budget = Math.max(0, game.budget - maintenanceCost);
      currentReports.push(`🏭 Depo Masrafı: Devasa borsa stoklarınızın (${totalInventory} birim) depolama ve lojistik masrafları için bütçeden $${maintenanceCost} kesildi.`);
    }
    // ------------------------------------------------

    // SPK Baskını (Piyasa Manipülasyonu Soruşturması)
    if (triggeredInvestigation) {
      currentReports.push(`🚨 SPK BASKINI: Borsada içeriden bilgi sızdırma (manipülasyon) tespit edildi! Ağır para cezası kesildi.`);
      game.budget = Math.max(0, game.budget - 15000);
      game.stability = Math.max(0, game.stability - 15);
      game.popularity = Math.max(0, game.popularity - 15);
    }

    // AI Ülkeleri ve Diplomasi simülasyonu
    for (const ai of game.worldCountries) {
      if (!ai.isPlayer) {
        let newMilitary = clampStat(ai.military + (Math.random() * 4 - 2));
        let newBudget = Math.max(0, ai.budget + (Math.random() * 400 - 200));
        let newStability = clampStat(ai.stability + (Math.random() * 4 - 2));

        const relationship = calculateRelationship(game, ai);
        const dip = diplomacyState[ai.name];

        if (dip?.type === 'war') {
          isAtWar = true;
          // Devam eden savaş - Dinamik hasar hesabı
          dip.turnsRemaining--; // Starts at -1, goes more negative
          const warDuration = Math.abs(dip.turnsRemaining);

          // Güç oranı (Ratio)
          const playerMil = Math.max(1, game.military);
          const aiMil = Math.max(1, newMilitary);
          const ratio = aiMil / playerMil; // AI güçlü ise ratio > 1

          // Hasar hesaplama (Düşman güçlüyse daha çok hasar verir)
          const baseDamage = 10;
          const warDamage = Math.round(baseDamage * Math.min(3, Math.max(0.3, ratio)));
          
          totalAiAttackDamage += warDamage;
          aiFinancialAid -= 500; // Savaş maliyeti
          
          // AI'nın kayıpları (Oyuncu güçlüyse AI daha çok kayıp verir)
          const aiLossMultiplier = 1 / Math.min(3, Math.max(0.3, ratio));
          newMilitary -= Math.round(10 * aiLossMultiplier);
          newBudget -= 300;
          newStability -= Math.round(10 * aiLossMultiplier);

          // Savaş Yorgunluğu (War Exhaustion)
          if (warDuration > 3) {
            totalWarExhaustion += (warDuration - 3);
          }

          // Savaşın sonucunu kontrol et
          const playerEffectiveMilitary = game.military - warDamage;
          if (playerEffectiveMilitary > newMilitary + 30) {
            // Oyuncu savaşı kazandı
            aiMessages.push(`🏆 ZAFER! ${ai.name} orduları yenildi! Ganimet olarak $${Math.round(newBudget / 2)} ele geçirildi.`);
            aiFinancialAid += Math.round(newBudget / 2);
            newBudget = 0;
            newMilitary = 0;
            newStability = 0;
            delete diplomacyState[ai.name];
          } else if (newMilitary > playerEffectiveMilitary + 30) {
            // AI savaşı kazandı
            aiMessages.push(`💀 HEZİMET! ${ai.name} orduları bizi ağır bir yenilgiye uğrattı. Devam eden savaş sona erdi, ancak savaş tazminatı ödemek zorunda kaldık!`);
            aiFinancialAid -= 2000;
            delete diplomacyState[ai.name];
          } else {
            aiMessages.push(`⚔️ CEPHE RAPORU: ${ai.name} ile savaş devam ediyor. Ağır askeri ve ekonomik kayıplarımız var.`);
          }
        } else if (dip?.type === 'alliance') {
          // Aktif ittifak bonusları
          activeAlliesCount++;
          aiFinancialAid += 200; // İttifaktan gelen pasif ticaret/destek geliri
          aiMessages.push(`🤝 İTTİFAK: ${ai.name} ile ortaklığımız ekonomiye $200 katkı sağladı.`);
          dip.turnsRemaining--;
          if (dip.turnsRemaining <= 0) {
            delete diplomacyState[ai.name];
            aiMessages.push(`📜 BİLGİ: ${ai.name} ile olan ittifak anlaşmamızın süresi doldu.`);
          }
        } else {
          // Savaş veya ittifak yoksa dinamik AI hamleleri
          if (relationship < 15 && newMilitary > game.military + 20) {
            // AI Savaş İlan Edebilir
            if (Math.random() < 0.2) {
              diplomacyState[ai.name] = { type: 'war', turnsRemaining: -1 };
              aiMessages.push(`⚠️ BEKLENMEDİK SALDIRI: ${ai.name} bize savaş ilan etti! Ordularımız çatışmaya girdi.`);
            }
          }
        }

        await prisma.worldCountry.update({
          where: { id: ai.id },
          data: {
            military: clampStat(newMilitary),
            happiness: clampStat(ai.happiness + (Math.random() * 4 - 2)),
            health: clampStat(ai.health + (Math.random() * 4 - 2)),
            environment: clampStat(ai.environment + (Math.random() * 4 - 2)),
            education: clampStat(ai.education + (Math.random() * 4 - 2)),
            stability: clampStat(newStability),
            budget: newBudget,
          }
        });
      }
    }

    // currentReports has already been initialized at the top
    
    if (isAtWar && activeAlliesCount > 0) {
      const damageReduction = Math.round(totalAiAttackDamage * (0.3 * Math.min(3, activeAlliesCount)));
      totalAiAttackDamage -= damageReduction;
      if (damageReduction > 0) {
        aiMessages.push(`🛡️ MÜTTEFİK DESTEĞİ: İttifak olduğumuz ülkeler cepheye destek göndererek savaş hasarımızı ${damageReduction} birim hafifletti!`);
      }
    }

    if (totalWarExhaustion > 0) {
      aiMessages.push(`⚠️ SAVAŞ YORGUNLUĞU: Uzayan savaşlar halkı canından bezdirdi (İstikrar ve Mutluluk -${totalWarExhaustion}).`);
    }

    if (isAtWar) {
      factions = modifyFactionSupport(factions, { military: 2, nationalists: 1, intellectuals: -2 });
    }

    currentReports.push(...aiMessages);

    const currentState: GameState = {
      id: game.id,
      countryName: game.countryName,
      turn: game.turn,
      budget: game.budget + aiFinancialAid,
      military: clampStat(game.military - Math.min(100, Math.max(0, totalAiAttackDamage))),
      happiness: clampStat(game.happiness - totalWarExhaustion),
      health: game.health,
      environment: game.environment,
      education: game.education,
      stability: clampStat(game.stability - Math.min(100, Math.max(0, totalAiAttackDamage / 2)) - totalWarExhaustion),
      foreignRelations: game.foreignRelations,
      popularity: game.popularity,
      politicalCapital: game.politicalCapital,
      nextElectionTurn: game.nextElectionTurn,
      activeQuests: game.activeQuests,
      isGameOver: game.isGameOver,
      gameOverReason: game.gameOverReason,
      isBankrupt: game.isBankrupt,
      bankruptTurns: game.bankruptTurns,
      currentEventId: game.currentEventId,
      turnReports: JSON.stringify(currentReports),
      activeCrises: game.activeCrises,
      factions: JSON.stringify(factions),
      activeLaws: game.activeLaws,
      megaProjects: game.megaProjects,
      ministers: game.ministers,
      activePetitions: game.activePetitions,
      diplomacyState: JSON.stringify(diplomacyState),
      marketState: JSON.stringify(marketState),
      researchPoints: game.researchPoints,
      unlockedTechs: game.unlockedTechs,
    };

    // Tur hesaplamalarını çalıştır (usedEventIds ve eventFlags aktarılıyor)
    const usedIds: string[] = JSON.parse(game.usedEventIds || '[]');
    const turnResult = processNextTurn(currentState, tradeIncome, usedIds, eventFlags);
    const newState = turnResult.gameState;

    // Kullanılmış olay ID'lerini güncelle
    if (turnResult.newEvents && turnResult.newEvents.length > 0) {
      turnResult.newEvents.forEach(e => usedIds.push(e.id));
    }

    // Veritabanını güncelle
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        turn: game.turn + 1,
        budget: newState.budget,
        military: newState.military,
        happiness: newState.happiness,
        health: newState.health,
        environment: newState.environment,
        education: newState.education,
        stability: newState.stability,
        foreignRelations: newState.foreignRelations,
        popularity: newState.popularity,
        politicalCapital: newState.politicalCapital,
        nextElectionTurn: newState.nextElectionTurn,
        isGameOver: newState.isGameOver,
        gameOverReason: newState.gameOverReason,
        isBankrupt: newState.isBankrupt,
        bankruptTurns: newState.bankruptTurns,
        currentEventId: newState.currentEventId,
        usedEventIds: JSON.stringify(usedIds),
        turnReports: newState.turnReports,
        activeCrises: newState.activeCrises,
        factions: newState.factions,
        activeLaws: newState.activeLaws,
        megaProjects: newState.megaProjects,
        ministers: newState.ministers,
        activePetitions: newState.activePetitions,
        diplomacyState: newState.diplomacyState,
        marketState: newState.marketState,
        researchPoints: newState.researchPoints,
        unlockedTechs: newState.unlockedTechs,
      },
      include: {
        worldCountries: true,
        tradeAgreements: true,
        investments: true,
      }
    });

    // Oyuncunun worldCountry kaydını da güncelle
    const playerWorldCountry = game.worldCountries.find(c => c.isPlayer);
    if (playerWorldCountry) {
      await prisma.worldCountry.update({
        where: { id: playerWorldCountry.id },
        data: {
          budget: newState.budget,
          military: newState.military,
          happiness: newState.happiness,
          health: newState.health,
          environment: newState.environment,
          education: newState.education,
          stability: newState.stability,
          foreignRelations: newState.foreignRelations,
        }
      });
    }

    return NextResponse.json({
      game: updatedGame,
      turnResult: {
        taxIncome: turnResult.taxIncome,
        maintenanceCost: turnResult.maintenanceCost,
        dominoEffects: turnResult.dominoEffects,
        tradeIncome: turnResult.tradeIncome,
        newEvents: turnResult.newEvents,
      },
    });
  } catch (error) {
    console.error("Tur atlama hatası:", error);
    return NextResponse.json(
      { error: "Tur atlanamadı" },
      { status: 500 }
    );
  }
}
