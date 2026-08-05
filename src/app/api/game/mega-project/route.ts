import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MEGA_PROJECTS, MegaProjectId, canStartMegaProject } from "@/lib/mega-projects";
import { applyEffects, checkVictory } from "@/lib/game-engine";
import { GameState } from "@/lib/types";
import { modifyFactionSupport, FactionsState } from "@/lib/factions";

export async function POST(request: Request) {
  try {
    const { gameId, projectId } = await request.json();

    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
    if (game.isGameOver) return NextResponse.json({ error: "Oyun bitti" }, { status: 400 });

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
      marketState: game.marketState,
      researchPoints: game.researchPoints,
      unlockedTechs: game.unlockedTechs,
    };

    if (!canStartMegaProject(state, projectId as MegaProjectId)) {
      return NextResponse.json({ error: "Bu projeyi başlatmak için gereksinimleri karşılamıyorsunuz" }, { status: 400 });
    }

    let completedProjects: string[] = [];
    try { completedProjects = JSON.parse(game.megaProjects); } catch {}
    
    if (completedProjects.includes(projectId)) {
      return NextResponse.json({ error: "Bu proje zaten tamamlanmış" }, { status: 400 });
    }

    const project = MEGA_PROJECTS[projectId as MegaProjectId];

    // Apply effects
    const newState = applyEffects(state, project.bonusEffects, game.isBankrupt);
    newState.budget -= project.cost;

    let factions: FactionsState;
    try { factions = JSON.parse(newState.factions); } catch { factions = {} as any; }
    factions = modifyFactionSupport(factions, project.factionEffects);

    completedProjects.push(projectId);
    newState.megaProjects = JSON.stringify(completedProjects);

    let turnReports: string[];
    try { turnReports = JSON.parse(newState.turnReports); } catch { turnReports = []; }
    
    let isGameOver: boolean = game.isGameOver;
    let gameOverReason: string | null = game.gameOverReason;

    const victoryCheck = checkVictory(newState);
    if (victoryCheck) {
      isGameOver = true;
      gameOverReason = "ZAFER! " + victoryCheck;
      turnReports.push(`🌟 OYUN BİTTİ: ${victoryCheck}`);
    } else {
      turnReports.push(`🌟 MEGA PROJE TAMAMLANDI: ${project.name}!`);
    }

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
        politicalCapital: newState.politicalCapital,
        isGameOver,
        gameOverReason,
        factions: JSON.stringify(factions),
        megaProjects: JSON.stringify(completedProjects),
        turnReports: JSON.stringify(turnReports)
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Proje başlatılamadı" }, { status: 500 });
  }
}
