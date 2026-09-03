import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Bond } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { gameId, bondId } = await request.json();

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
    }

    let activeBonds: Bond[] = [];
    try { activeBonds = JSON.parse(game.activeBonds); } catch {}
    
    const bondIndex = activeBonds.findIndex(b => b.id === bondId);
    if (bondIndex === -1) {
      return NextResponse.json({ error: "Tahvil bulunamadı veya zaten ödenmiş" }, { status: 400 });
    }

    const bond = activeBonds[bondIndex];

    if (game.budget < bond.totalToRepay) {
      return NextResponse.json({ error: `Yetersiz bütçe. Gereken: $${bond.totalToRepay.toLocaleString()}` }, { status: 400 });
    }

    // Erken ödeme!
    activeBonds.splice(bondIndex, 1);

    let turnReports: string[] = [];
    try { turnReports = JSON.parse(game.turnReports); } catch {}
    
    turnReports.push(`💸 ERKEN TAHVİL ÖDEMESİ: Vadesi gelmeyen tahvil borcu ($${bond.totalToRepay.toLocaleString()}) Merkez Bankası rezervlerinden ödendi ve kapatıldı.`);

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        budget: game.budget - bond.totalToRepay,
        activeBonds: JSON.stringify(activeBonds),
        turnReports: JSON.stringify(turnReports)
      }
    });

    return NextResponse.json({ game: updatedGame });
  } catch (error) {
    console.error("Erken tahvil ödemesi hatası:", error);
    return NextResponse.json(
      { error: "İşlem gerçekleştirilemedi" },
      { status: 500 }
    );
  }
}
