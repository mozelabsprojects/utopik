import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { gameId, amount } = await request.json(); // e.g., amount = 10000

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
    }

    // Para basmak = +Nakit, ama +Enflasyon
    // Örn: Her $10.000 para basmak enflasyonu %15 artırır.
    const inflationIncrease = (amount / 10000) * 15;
    
    let turnReports: string[] = [];
    try { turnReports = JSON.parse(game.turnReports); } catch {}
    
    turnReports.push(`🖨️ Merkez Bankası $${amount.toLocaleString()} karşılıksız para bastı. Enflasyon +%${inflationIncrease.toFixed(1)} fırladı!`);

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        budget: game.budget + amount,
        inflation: game.inflation + inflationIncrease,
        turnReports: JSON.stringify(turnReports)
      }
    });

    return NextResponse.json({ game: updatedGame });
  } catch (error) {
    console.error("Para basma hatası:", error);
    return NextResponse.json(
      { error: "İşlem gerçekleştirilemedi" },
      { status: 500 }
    );
  }
}
