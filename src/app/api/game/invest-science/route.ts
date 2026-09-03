import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { gameId } = await request.json();

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
    }

    const COST = 5000;
    const RP_GAIN = 5;

    if (game.budget < COST) {
      return NextResponse.json({ error: `Ar-Ge fonlaması için en az $${COST} bütçe gerekiyor.` }, { status: 400 });
    }

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        budget: game.budget - COST,
        researchPoints: game.researchPoints + RP_GAIN
      }
    });

    return NextResponse.json({ 
      success: true, 
      game: updatedGame,
      message: `Bilimsel araştırmalara $${COST} fon sağlandı. +${RP_GAIN} Ar-Ge Puanı üretildi!`
    });
  } catch (error) {
    console.error("Bilim yatırımı hatası:", error);
    return NextResponse.json({ error: "İşlem gerçekleştirilemedi." }, { status: 500 });
  }
}
