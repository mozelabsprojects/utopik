import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MINISTERS, MinisterId } from "@/lib/ministers";

export async function POST(request: Request) {
  try {
    const { gameId, ministerId } = await request.json();

    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
    if (game.isGameOver) return NextResponse.json({ error: "Oyun bitti" }, { status: 400 });

    const minister = MINISTERS[ministerId as MinisterId];
    if (!minister) return NextResponse.json({ error: "Bakan bulunamadı" }, { status: 400 });

    if (game.politicalCapital < minister.hireCost) {
      return NextResponse.json({ error: "Yetersiz siyasi sermaye" }, { status: 400 });
    }

    let factions: Record<string, { support: number }> = {};
    try {
      factions = JSON.parse(game.factions);
    } catch {}

    const reqFaction = factions[minister.requiredFactionId];
    if (reqFaction && reqFaction.support < 20) {
      return NextResponse.json({ error: "Bu bakanın temsil ettiği grubun halk desteği %20'nin altında olduğu için atama yapılamaz." }, { status: 400 });
    }

    let ministers: Record<string, string> = {};
    try { ministers = JSON.parse(game.ministers); } catch {}

    // Aynı bakanlığa başka biri atanmışsa değiştir (üzerine yaz)
    ministers[minister.ministry] = minister.id;

    await prisma.game.update({
      where: { id: gameId },
      data: {
        politicalCapital: game.politicalCapital - minister.hireCost,
        ministers: JSON.stringify(ministers),
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Atama başarısız" }, { status: 500 });
  }
}
