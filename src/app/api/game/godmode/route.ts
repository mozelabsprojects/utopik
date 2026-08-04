import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { gameId } = await request.json();

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        budget: 999999,
        military: 100,
        happiness: 100,
        health: 100,
        environment: 100,
        education: 100,
        stability: 100,
        foreignRelations: 100,
        popularity: 100,
        politicalCapital: 9999,
        isBankrupt: false,
        bankruptTurns: 0,
      }
    });

    return NextResponse.json({ game: updatedGame });
  } catch (error) {
    console.error("God mode hatası:", error);
    return NextResponse.json(
      { error: "Hile aktifleştirilemedi" },
      { status: 500 }
    );
  }
}
