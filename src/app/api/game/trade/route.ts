import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateRelationship } from "@/lib/game-engine";

export async function POST(request: Request) {
  try {
    const { gameId, partnerName, investmentAmount } = await request.json();

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { worldCountries: true },
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
    let successChance = 0;
    let relationCost = 0;

    if (partner.isPlayer) {
      // İç Ticaret (Yerel Yatırım): İstikrara bağlıdır, dış ilişki düşürmez.
      relationship = game.stability;
      successChance = relationship / 100;
      relationCost = 0; // Kendi ülkene yatırım yapmanın diplomatik bedeli yoktur
    } else {
      // Dış Ticaret: İlişkilere bağlıdır
      relationship = calculateRelationship(game, partner);
      if (relationship < 30) {
        return NextResponse.json({ error: "Bu ülke ile ilişkileriniz ticaret yapmak için çok kötü." }, { status: 400 });
      }
      successChance = relationship / 100;
      relationCost = 5; // Eskiden 2'ydi, artırıldı. Dış ticaret daha maliyetli.
    }

    // Maksimum aktif anlaşma kontrolü
    const activeAgreementsCount = await prisma.tradeAgreement.count({
      where: { gameId: game.id }
    });
    if (activeAgreementsCount >= 5) {
      return NextResponse.json({ error: "Aynı anda maksimum 5 ticaret anlaşmanız olabilir." }, { status: 400 });
    }

    const isSuccess = Math.random() < successChance;
    
    let totalExpectedReturn = 0;
    if (isSuccess) {
      // Başarılı anlaşma: +%10 ile +%50 arası kar
      const baseReturn = 1.10;
      const variableReturn = Math.random() * 0.40;
      totalExpectedReturn = investmentAmount * (baseReturn + variableReturn);
    } else {
      // Başarısız anlaşma (Zarar): %20 ile %70 arası zarar (Risk artırıldı)
      const lossSeverity = 0.2 + (Math.random() * 0.5); // 0.2 - 0.7
      totalExpectedReturn = investmentAmount * (1 - lossSeverity);
    }
    const incomePerTurn = Math.round(totalExpectedReturn / 5);

    // Bütçeden ve dış ilişkilerden düş
    await prisma.game.update({
      where: { id: gameId },
      data: {
        budget: game.budget - investmentAmount,
        foreignRelations: Math.max(0, game.foreignRelations - relationCost),
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
