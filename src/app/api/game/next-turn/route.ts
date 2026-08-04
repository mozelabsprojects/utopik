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

    // Ticaret gelirlerini topla ve sürelerini azalt
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
    let aiMessages: string[] = [];

    // Diplomacy ve Market State'lerini parse et
    let diplomacyState: Record<string, { type: 'war' | 'alliance', turnsRemaining: number }> = {};
    try { diplomacyState = JSON.parse(game.diplomacyState); } catch {}
    
    // Fraksiyonları parse et (Savaş domino etkileri için)
    let factions: FactionsState = INITIAL_FACTIONS;
    try { factions = JSON.parse(game.factions); } catch { factions = INITIAL_FACTIONS; }
    if (Object.keys(factions).length === 0) factions = INITIAL_FACTIONS;

    let marketState: MarketState = { prices: { energy: 100, food: 50, tech: 200 }, inventory: { energy: 0, food: 0, tech: 0 } };
    try {
      const parsedMarket = JSON.parse(game.marketState);
      if (parsedMarket.prices && parsedMarket.inventory) marketState = parsedMarket;
    } catch {}

    // Borsa Fiyat Dalgalanması (±%20) ve Limitler
    marketState.prices.energy = Math.min(250, Math.max(20, marketState.prices.energy * (0.8 + Math.random() * 0.4)));
    marketState.prices.food = Math.min(150, Math.max(10, marketState.prices.food * (0.8 + Math.random() * 0.4)));
    marketState.prices.tech = Math.min(500, Math.max(50, marketState.prices.tech * (0.8 + Math.random() * 0.4)));

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

    let currentReports: string[] = [];
    try { currentReports = JSON.parse(game.turnReports); } catch {}
    
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
    };

    // Tur hesaplamalarını çalıştır (usedEventIds ve eventFlags aktarılıyor)
    const usedIds: string[] = JSON.parse(game.usedEventIds || '[]');
    const eventFlags: string[] = JSON.parse(game.eventFlags || '[]');
    const turnResult = processNextTurn(currentState, tradeIncome, usedIds, eventFlags);
    const newState = turnResult.gameState;

    // Kullanılmış olay ID'lerini güncelle
    if (turnResult.newEvent) {
      usedIds.push(turnResult.newEvent.id);
    }

    // Veritabanını güncelle
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        turn: newState.turn,
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
        newEvent: turnResult.newEvent,
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
