import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateRelationship, calculateTradeRiskProfile } from "@/lib/game-engine";
import { COUNTRIES } from "@/lib/countries-data";
import { DiplomacyState } from "@/lib/types";

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

    const activeAgreementsWithPartnerCount = await prisma.tradeAgreement.count({
      where: { gameId: game.id, partnerName: partner.name }
    });
    if (activeAgreementsWithPartnerCount >= 2) {
      return NextResponse.json({ error: `${partner.name} ile aynı anda maksimum 2 aktif ticaret anlaşmanız olabilir. Önceki anlaşmaların süresinin bitmesini bekleyin.` }, { status: 400 });
    }

    let marketState: any = {};
    try { marketState = JSON.parse(game.marketState || "{}"); } catch {}

    const isSuccess = Math.random() < riskProfile.successChance;
    
    if (!isSuccess) {
      // Başarısız anlaşma - Anlaşma kurulamadı, paranızın bir kısmı heba oldu
      let lossSeverity = 0.60;
      if (riskProfile.level === "Düşük") lossSeverity = 0.10;
      else if (riskProfile.level === "Orta") lossSeverity = 0.30;

      const lostAmount = Math.round(investmentAmount * lossSeverity);
      
      const updatedGame = await prisma.game.update({
        where: { id: gameId },
        data: {
          budget: game.budget - lostAmount,
          foreignRelations: Math.max(0, game.foreignRelations - riskProfile.diplomaticCost),
        }
      });
      return NextResponse.json({ success: false, message: `Ticaret görüşmeleri başarısız oldu. Gümrük ve bürokrasi masrafları nedeniyle $${lostAmount} zarar ettiniz.`, newBudget: updatedGame.budget });
    }

    // Başarılı anlaşma
    const actualReturnPerc = riskProfile.minReturn + (Math.random() * (riskProfile.maxReturn - riskProfile.minReturn));
    const totalExpectedReturn = investmentAmount * (1 + actualReturnPerc);
    // Base income per turn (will fluctuate in next-turn)
    const baseIncomePerTurn = Math.round(totalExpectedReturn / 5);

    if (!partner.isPlayer) {
      game.foreignRelations = Math.min(100, game.foreignRelations + 2);
    }

    // --- FAZ 4: KÜRESEL EKSEN KAYMASI ---
    let diplomacyState: DiplomacyState = { westernRelations: 50, easternRelations: 50, activeEmbargoes: [] };
    try { diplomacyState = JSON.parse(game.diplomacyState || "{}"); } catch {}
    if (diplomacyState.westernRelations === undefined) diplomacyState.westernRelations = 50;
    if (diplomacyState.easternRelations === undefined) diplomacyState.easternRelations = 50;

    const countryTemplate = COUNTRIES.find(c => c.name === partner.name);
    if (countryTemplate) {
      if (countryTemplate.regime === "Demokrasi") {
        diplomacyState.westernRelations = Math.min(100, diplomacyState.westernRelations + 5);
        diplomacyState.easternRelations = Math.max(0, diplomacyState.easternRelations - 2);
      } else if (countryTemplate.regime === "Otokrasi") {
        diplomacyState.easternRelations = Math.min(100, diplomacyState.easternRelations + 5);
        diplomacyState.westernRelations = Math.max(0, diplomacyState.westernRelations - 2);
      }
    }

    await prisma.game.update({
      where: { id: gameId },
      data: {
        budget: game.budget - investmentAmount,
        foreignRelations: game.foreignRelations,
        diplomacyState: JSON.stringify(diplomacyState),
        marketState: JSON.stringify(marketState)
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

    return NextResponse.json({ agreement, newBudget: game.budget - investmentAmount, returnPercentage: Math.round(actualReturnPerc * 100) });
  } catch (error) {
    console.error("Ticaret hatası:", error);
    return NextResponse.json(
      { error: "Ticaret yapılamadı" },
      { status: 500 }
    );
  }
}
