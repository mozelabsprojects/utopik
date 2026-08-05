import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TECH_TREE, TechId } from "@/lib/tech-tree";

export async function POST(request: Request) {
  try {
    const { gameId, techId } = await request.json();

    if (!gameId || !techId) {
      return NextResponse.json({ error: "Eksik parametre" }, { status: 400 });
    }

    const tech = TECH_TREE[techId as TechId];
    if (!tech) {
      return NextResponse.json({ error: "Geçersiz teknoloji" }, { status: 400 });
    }

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
    }

    let unlockedTechs: string[] = [];
    try {
      unlockedTechs = JSON.parse(game.unlockedTechs);
    } catch {}

    if (unlockedTechs.includes(techId)) {
      return NextResponse.json({ error: "Bu teknoloji zaten açık" }, { status: 400 });
    }

    // Check prerequisites
    for (const req of tech.requires) {
      if (!unlockedTechs.includes(req)) {
        return NextResponse.json({ error: "Ön gereksinimler sağlanmamış" }, { status: 400 });
      }
    }

    if (game.researchPoints < tech.cost) {
      return NextResponse.json({ error: "Yetersiz araştırma puanı" }, { status: 400 });
    }

    unlockedTechs.push(techId);

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        researchPoints: game.researchPoints - tech.cost,
        unlockedTechs: JSON.stringify(unlockedTechs),
      },
    });

    return NextResponse.json({
      success: true,
      researchPoints: updatedGame.researchPoints,
      unlockedTechs: updatedGame.unlockedTechs,
    });
  } catch (error) {
    console.error("Tech unlock error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
