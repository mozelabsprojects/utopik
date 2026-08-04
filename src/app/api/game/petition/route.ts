import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PETITIONS } from "@/lib/petitions";
import { applyEffects } from "@/lib/game-engine";
import { GameState } from "@/lib/types";
import { modifyFactionSupport, FactionsState } from "@/lib/factions";

export async function POST(request: Request) {
  try {
    const { gameId, petitionId, action } = await request.json(); // action: "accept" | "reject"

    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
    if (game.isGameOver) return NextResponse.json({ error: "Oyun bitti" }, { status: 400 });

    const petition = PETITIONS.find(p => p.id === petitionId);
    if (!petition) return NextResponse.json({ error: "Dilekçe bulunamadı" }, { status: 400 });

    let activePetitions: string[] = [];
    try { activePetitions = JSON.parse(game.activePetitions); } catch {}
    
    if (!activePetitions.includes(petitionId)) {
      return NextResponse.json({ error: "Bu dilekçe aktif değil" }, { status: 400 });
    }

    const state: GameState = {
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
      nextElectionTurn: game.nextElectionTurn,
      activeQuests: game.activeQuests,
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

    const effects = action === "accept" ? petition.acceptEffects : petition.rejectEffects;
    const factionEffects = action === "accept" ? petition.acceptFactionEffects : petition.rejectFactionEffects;

    const newState = applyEffects(state, effects, game.isBankrupt);

    let factions: FactionsState;
    try { factions = JSON.parse(newState.factions); } catch { factions = {} as any; }
    if (factionEffects) {
      factions = modifyFactionSupport(factions, factionEffects);
    }

    // Remove from active
    activePetitions = activePetitions.filter(id => id !== petitionId);

    let turnReports: string[];
    try { turnReports = JSON.parse(newState.turnReports); } catch { turnReports = []; }
    turnReports.push(`📋 Dilekçe: '${petition.title}' ${action === 'accept' ? 'kabul' : 'red'} edildi.`);

    await prisma.game.update({
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
        factions: JSON.stringify(factions),
        activePetitions: JSON.stringify(activePetitions),
        turnReports: JSON.stringify(turnReports)
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Dilekçe işlemi başarısız" }, { status: 500 });
  }
}
