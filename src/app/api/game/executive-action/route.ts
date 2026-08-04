import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EXECUTIVE_ACTIONS, ExecutiveActionId } from "@/lib/executive-actions";
import { applyEffects } from "@/lib/game-engine";

export async function POST(request: Request) {
  try {
    const { gameId, actionId } = await request.json();

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
    }

    const execAction = EXECUTIVE_ACTIONS[actionId as ExecutiveActionId];
    if (!execAction) {
      return NextResponse.json({ error: "Geçersiz eylem" }, { status: 400 });
    }

    if (game.politicalCapital < execAction.cost) {
      return NextResponse.json({ error: "Yetersiz siyasi sermaye" }, { status: 400 });
    }

    // Apply effects
    const newState = applyEffects(game, execAction.effects, game.isBankrupt);

    // Update PC
    newState.politicalCapital -= execAction.cost;

    // Add turn report
    let turnReports: string[] = [];
    try { turnReports = JSON.parse(game.turnReports); } catch {}
    turnReports.push(`🏛️ KARARNAME: ${execAction.name} uygulandı. (-${execAction.cost} Siyasi Sermaye)`);

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
        politicalCapital: newState.politicalCapital,
        turnReports: JSON.stringify(turnReports)
      }
    });

    return NextResponse.json({ game: updatedGame });
  } catch (error) {
    console.error("Kararname işlem hatası:", error);
    return NextResponse.json(
      { error: "Kararname işlemi gerçekleştirilemedi" },
      { status: 500 }
    );
  }
}
