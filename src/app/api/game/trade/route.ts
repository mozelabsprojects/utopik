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
    
    if (!isSuccess) {
      // Başarısız anlaşma - Anlaşma kurulamadı, paranızın bir kısmı heba oldu
      const lossSeverity = riskProfile.minLoss + (Math.random() * (riskProfile.maxLoss - riskProfile.minLoss));
      const lostAmount = Math.round(investmentAmount * lossSeverity);
      
      await prisma.game.update({
        where: { id: gameId },
        data: {
          budget: game.budget - lostAmount,
          foreignRelations: Math.max(0, game.foreignRelations - riskProfile.diplomaticCost),
        }
      });
      return NextResponse.json({ error: `Ticaret görüşmeleri başarısız oldu. Gümrük ve bürokrasi masrafları nedeniyle $${lostAmount} zarar ettiniz.` }, { status: 400 });
    }

    // Başarılı anlaşma
    const baseReturn = 1 + riskProfile.minReturn;
    const totalExpectedReturn = investmentAmount * baseReturn;
    // Base income per turn (will fluctuate in next-turn)
    const baseIncomePerTurn = Math.round(totalExpectedReturn / 5);

    if (!partner.isPlayer) {
      game.foreignRelations = Math.min(100, game.foreignRelations + 2);
    }

    await prisma.game.update({
      where: { id: gameId },
      data: {
        budget: game.budget - investmentAmount,
        foreignRelations: game.foreignRelations,
      }
    });

    // Anlaşmayı kaydet (Dalgalanma için base income'u kaydediyoruz)
    const agreement = await prisma.tradeAgreement.create({
      data: {
        gameId: game.id,
        partnerName: partner.name,
        incomePerTurn: baseIncomePerTurn,
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
