import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateRelationship, calculateTradeRiskProfile } from "@/lib/game-engine";

export async function POST(request: Request) {
  try {
    const { gameId, partnerName, investmentAmount } = await request.json();

    if (investmentAmount <= 0 || isNaN(investmentAmount)) {
      return NextResponse.json({ error: "Geçersiz yatırım miktarı" }, { status: 400 });
    }

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { worldCountries: { orderBy: { name: 'asc' } } },
    });

    if (!game) {
      return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
    }

    if (game.budget < investmentAmount) {
      return NextResponse.json({ error: "Yetersiz bütçe" }, { status: 400 });
    }
    
    const partner = game.worldCountries.find(c => c.name === partnerName);
    if (!partner) {
      return NextResponse.json({ error: "Ülke bulunamadı" }, { status: 404 });
    }

    let relationship = 0;

    if (partner.isPlayer) {
      relationship = game.stability;
    } else {
      relationship = calculateRelationship(game, partner);
      if (relationship < 30) {
        return NextResponse.json({ error: "Bu ülke ile ilişkileriniz ticaret yapmak için çok kötü." }, { status: 400 });
      }
    }

    // Dinamik Risk Profili Hesaplama
    const riskProfile = calculateTradeRiskProfile(partner.isPlayer, partner.stability, partner.military, relationship);

    // Maksimum aktif anlaşma kontrolü
    const activeAgreementsCount = await prisma.tradeAgreement.count({
      where: { gameId: game.id }
    });
    if (activeAgreementsCount >= 5) {
      return NextResponse.json({ error: "Aynı anda maksimum 5 ticaret anlaşmanız olabilir." }, { status: 400 });
    }

    const isSuccess = Math.random() < riskProfile.successChance;
    
    let totalExpectedReturn = 0;
    if (isSuccess) {
      // Başarılı anlaşma
      const baseReturn = 1 + riskProfile.minReturn;
      const variableReturn = Math.random() * (riskProfile.maxReturn - riskProfile.minReturn);
      totalExpectedReturn = investmentAmount * (baseReturn + variableReturn);
      // Başarılı dış ticaret diplomasimizi güçlendirir
      if (!partner.isPlayer) {
        game.foreignRelations = Math.min(100, game.foreignRelations + 2);
      }
    } else {
      // Başarısız anlaşma (Zarar)
      const lossSeverity = riskProfile.minLoss + (Math.random() * (riskProfile.maxLoss - riskProfile.minLoss));
      totalExpectedReturn = investmentAmount * (1 - lossSeverity);
    }
    const incomePerTurn = Math.round(totalExpectedReturn / 5);

    // Bütçeden ve dış ilişkilerden düş
    await prisma.game.update({
      where: { id: gameId },
      data: {
        budget: game.budget - investmentAmount,
        foreignRelations: Math.max(0, game.foreignRelations - riskProfile.diplomaticCost),
      }
    });

    // Anlaşmayı kaydet
    const agreement = await prisma.tradeAgreement.create({
      data: {
        gameId: game.id,
        partnerName: partner.name,
        incomePerTurn: incomePerTurn,
        turnsRemaining: 5,
      }
    });

    return NextResponse.json({ agreement, newBudget: game.budget - investmentAmount });
  } catch (error) {
    console.error("Ticaret hatası:", error);
    return NextResponse.json(
      { error: "Ticaret yapılamadı" },
      { status: 500 }
    );
  }
}
