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

    // Raporları temizle
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        turnReports: "[]"
      }
    });

    return NextResponse.json({ game: updatedGame });
  } catch (error) {
    console.error("Rapor okuma hatası:", error);
    return NextResponse.json(
      { error: "İşlem gerçekleştirilemedi" },
      { status: 500 }
    );
  }
}
