import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Bond } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { gameId, amount } = await request.json(); // e.g., amount = 10000

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
    }

    // Faiz oranı (Faiz, enflasyona ve istikrara bağlıdır)
    // Örn: Baz faiz %10, ama enflasyon %20 ise faiz %25 falan olmalı.
    const baseInterestRate = 0.10;
    const inflationRisk = game.inflation / 100;
    const stabilityRisk = Math.max(0, (50 - game.stability) / 200); // 50'den düşükse ek risk
    
    let currentInterestRate = baseInterestRate + inflationRisk + stabilityRisk;
    if (currentInterestRate > 0.6) currentInterestRate = 0.6; // Max %60 faiz (tefeci)
    if (currentInterestRate < 0.05) currentInterestRate = 0.05; // Min %5 faiz

    const duration = 5; // Tahvilin vadesi (5 tur)
    const totalToRepay = Math.round(amount * (1 + currentInterestRate));

    let activeBonds: Bond[] = [];
    try { activeBonds = JSON.parse(game.activeBonds); } catch {}
    
    const newBond: Bond = {
      id: "bond_" + Date.now(),
      amount,
      interestRate: currentInterestRate,
      totalToRepay,
      turnIssued: game.turn,
      duration
    };

    activeBonds.push(newBond);

    let turnReports: string[] = [];
    try { turnReports = JSON.parse(game.turnReports); } catch {}
    
    turnReports.push(`📜 Hazine, %${(currentInterestRate * 100).toFixed(1)} faizle $${amount.toLocaleString()} borçlandı. ${duration} tur sonra $${totalToRepay.toLocaleString()} ödenecek.`);

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        budget: game.budget + amount,
        activeBonds: JSON.stringify(activeBonds),
        turnReports: JSON.stringify(turnReports)
      }
    });

    return NextResponse.json({ game: updatedGame });
  } catch (error) {
    console.error("Tahvil ihracı hatası:", error);
    return NextResponse.json(
      { error: "İşlem gerçekleştirilemedi" },
      { status: 500 }
    );
  }
}
