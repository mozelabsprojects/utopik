import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEventById } from "@/lib/events-data";
import { applyEffects } from "@/lib/game-engine";
import { GameState } from "@/lib/types";
import { INITIAL_FACTIONS, modifyFactionSupport } from "@/lib/factions";

export async function POST(request: Request) {
  try {
    const { gameId, choiceLabel, eventId } = await request.json();

    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
    }

    if (game.isGameOver) {
      return NextResponse.json({ error: "Oyun bitti" }, { status: 400 });
    }

    if (!game.currentEventId) {
      return NextResponse.json({ error: "Aktif olay yok" }, { status: 400 });
    }

    let currentEventIds: string[] = [];
    try {
      currentEventIds = JSON.parse(game.currentEventId);
      if (!Array.isArray(currentEventIds)) {
        currentEventIds = [game.currentEventId];
      }
    } catch (e) {
      // Geriye dönük uyumluluk: eski save'lerde JSON formatında değildi
      currentEventIds = [game.currentEventId];
    }

    if (eventId && !currentEventIds.includes(eventId)) {
       return NextResponse.json({ error: "Bu olay mevcut aktif olaylar arasında değil" }, { status: 400 });
    }

    // Eğer eventId gönderilmediyse, backward compatibility için ilkini al
    const targetEventId = eventId || currentEventIds[0];

    const event = getEventById(targetEventId);
    if (!event) {
      return NextResponse.json({ error: "Olay bulunamadı" }, { status: 400 });
    }

    const choice = event.choices.find((c) => c.label === choiceLabel);
    if (!choice) {
      return NextResponse.json({ error: "Geçersiz seçim" }, { status: 400 });
    }

    // Mevcut durumu GameState formatına çevir
    const currentState: GameState = {
      id: game.id,
      countryName: game.countryName,
      turn: game.turn,
      budget: game.budget,
      military: game.military,
      happiness: game.happiness,
      health: game.health,
      environment: game.environment,
      education: game.education,
      stability: game.stability,
      foreignRelations: game.foreignRelations,
      popularity: game.popularity,
      politicalCapital: game.politicalCapital,
      activeQuests: game.activeQuests,
      nextElectionTurn: game.nextElectionTurn,
      isGameOver: game.isGameOver,
      gameOverReason: game.gameOverReason,
      isBankrupt: game.isBankrupt,
      bankruptTurns: game.bankruptTurns,
      currentEventId: game.currentEventId,
      turnReports: game.turnReports,
      activeCrises: game.activeCrises,
      factions: game.factions,
      activeLaws: game.activeLaws,
      megaProjects: game.megaProjects,
      ministers: game.ministers,
      activePetitions: game.activePetitions,
      diplomacyState: game.diplomacyState,
      marketState: game.marketState,
      eventFlags: game.eventFlags,
      researchPoints: game.researchPoints,
      unlockedTechs: game.unlockedTechs,
      inflation: game.inflation,
      activeBonds: game.activeBonds,
    };

    // Etkileri uygula
    const newState = applyEffects(currentState, choice.effects, game.isBankrupt);

    // Fraksiyon etkilerini uygula
    let factionsStr = newState.factions;
    if (choice.factionEffects) {
      let factions = INITIAL_FACTIONS;
      try { factions = JSON.parse(newState.factions); } catch { factions = INITIAL_FACTIONS; }
      factions = modifyFactionSupport(factions, choice.factionEffects);
      factionsStr = JSON.stringify(factions);
    }

    // Kelebek Etkisi Bayraklarını Ekle
    let eventFlagsStr = game.eventFlags;
    if (choice.flagsToSet && choice.flagsToSet.length > 0) {
      let currentFlags: string[] = [];
      try { currentFlags = JSON.parse(game.eventFlags || "[]"); } catch {}
      const newFlags = [...new Set([...currentFlags, ...choice.flagsToSet])];
      eventFlagsStr = JSON.stringify(newFlags);
    }

    // Listeden çözülen eventi çıkar
    const remainingEventIds = currentEventIds.filter(id => id !== targetEventId);
    const newCurrentEventIdValue = remainingEventIds.length > 0 ? JSON.stringify(remainingEventIds) : null;

    // Piyasayı (Borsayı) Etkile (Kelebek Etkisi / Piyasa Manipülasyonu)
    let marketStateStr = game.marketState;
    if (choice.marketEffects) {
      try {
        const marketState = JSON.parse(game.marketState);
        for (const [key, multiplier] of Object.entries(choice.marketEffects)) {
          if (marketState.prices[key]) {
            marketState.prices[key] = Math.round(Math.max(10, marketState.prices[key] * (multiplier as number)));
          }
        }
        marketStateStr = JSON.stringify(marketState);
      } catch (e) {
        console.error("Market state parse error:", e);
      }
    }

    // Veritabanını güncelle
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
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
        factions: factionsStr,
        eventFlags: eventFlagsStr,
        currentEventId: newCurrentEventIdValue,
        marketState: marketStateStr
      },
    });

    return NextResponse.json({
      game: updatedGame,
      appliedEffects: choice.effects,
      choiceText: choice.text,
    });
  } catch (error) {
    console.error("Seçim hatası:", error);
    return NextResponse.json({ error: "Seçim uygulanamadı" }, { status: 500 });
  }
}
