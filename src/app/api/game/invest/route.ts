import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applyInvestment } from "@/lib/game-engine";
import { GameState } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { gameId, sector, amount } = await request.json();

    if (!gameId || !sector || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "gameId, sector ve amount (>0) gerekli" },
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
      marketState: game.marketState
    };

    // Yatırımı uygula
    const { newState, actualAmount } = applyInvestment(currentState, sector, amount);

    if (actualAmount === 0) {
      return NextResponse.json(
        { error: "Yetersiz bütçe" },
        { status: 400 }
      );
    }

    // Yatırım kaydı oluştur
    await prisma.investment.create({
      data: {
        gameId,
        sector,
        amount: actualAmount,
        turn: game.turn,
      },
    });

    // Oyun durumunu güncelle
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        budget: newState.budget,
        military: newState.military,
        health: newState.health,
        education: newState.education,
        environment: newState.environment,
        stability: newState.stability,
        foreignRelations: newState.foreignRelations,
        factions: newState.factions,
      },
    });

    return NextResponse.json({
      game: updatedGame,
      investedAmount: actualAmount,
      sector,
    });
  } catch (error) {
    console.error("Yatırım hatası:", error);
    return NextResponse.json(
      { error: "Yatırım yapılamadı" },
      { status: 500 }
    );
  }
}
