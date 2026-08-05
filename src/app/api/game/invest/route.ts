import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applyInvestment } from "@/lib/game-engine";
import { GameState } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { gameId, sector, amount, investments } = await request.json();

    if (!gameId) {
      return NextResponse.json(
        { error: "gameId gerekli" },
        { status: 400 }
      );
    }

    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
    }

    if (game.isGameOver) {
      return NextResponse.json({ error: "Oyun bitti" }, { status: 400 });
    }

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
      researchPoints: game.researchPoints,
      unlockedTechs: game.unlockedTechs,
    };

    // Yatırımları sırayla uygula
    let updatedState = { ...currentState };
    let totalInvestedAmount = 0;
    const recordsToCreate: any[] = [];

    const processInvestment = (sec: string, amt: number) => {
      if (amt <= 0) return;
      const { newState, actualAmount } = applyInvestment(updatedState, sec, amt);
      if (actualAmount > 0) {
        updatedState = newState;
        totalInvestedAmount += actualAmount;
        recordsToCreate.push({
          gameId,
          sector: sec,
          amount: actualAmount,
          turn: game.turn,
        });
      }
    };

    if (investments) {
      for (const [sec, amt] of Object.entries(investments)) {
        processInvestment(sec, amt as number);
      }
    } else if (sector && amount) {
      processInvestment(sector, amount);
    }

    if (recordsToCreate.length === 0) {
      return NextResponse.json(
        { error: "Geçerli bir yatırım veya yeterli bütçe bulunamadı" },
        { status: 400 }
      );
    }

    // Yatırım kayıtlarını oluştur
    await prisma.investment.createMany({
      data: recordsToCreate,
    });

    // Oyun durumunu güncelle
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        budget: updatedState.budget,
        military: updatedState.military,
        health: updatedState.health,
        education: updatedState.education,
        environment: updatedState.environment,
        stability: updatedState.stability,
        foreignRelations: updatedState.foreignRelations,
        factions: updatedState.factions,
      },
    });

    return NextResponse.json({
      game: updatedGame,
      investedAmount: totalInvestedAmount,
      investments: recordsToCreate,
    });
  } catch (error) {
    console.error("Yatırım hatası:", error);
    return NextResponse.json(
      { error: "Yatırım yapılamadı" },
      { status: 500 }
    );
  }
}
