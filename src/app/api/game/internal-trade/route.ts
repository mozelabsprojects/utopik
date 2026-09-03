import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { gameId, investmentAmount } = await request.json();

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
    }

    if (game.budget < investmentAmount) {
      return NextResponse.json({ error: "Yetersiz bütçe" }, { status: 400 });
    }
    
    if (game.stability < 30) {
      return NextResponse.json({ error: "İstikrar çok düşük, yerel şirketler risk almak istemiyor." }, { status: 400 });
    }

    // Maksimum aktif anlaşma kontrolü (iç ve dış toplamı veya sadece iç?)
    // Oyuncu toplam 5 ticaret anlaşması yapabilsin
    const activeAgreementsCount = await prisma.tradeAgreement.count({
      where: { gameId: game.id }
    });
    if (activeAgreementsCount >= 5) {
      return NextResponse.json({ error: "Aynı anda maksimum 5 ticaret anlaşmanız olabilir." }, { status: 400 });
    }

    let marketState: any = {};
    try { marketState = JSON.parse(game.marketState || "{}"); } catch {}
    if (!marketState.tradesThisTurn || marketState.tradesThisTurn.turn !== game.turn) {
      marketState.tradesThisTurn = { turn: game.turn, counts: {} };
    }
    const currentTradesCount = marketState.tradesThisTurn.counts["Yerel Endüstri"] || 0;
    if (currentTradesCount >= 2) {
      return NextResponse.json({ error: "İç piyasaya bu turda maksimum yatırım (2) limitine ulaştınız. Sonraki tur tekrar deneyin." }, { status: 400 });
    }

    // İstikrar maliyeti (Bürokratik yük)
    const stabilityCost = 1;

    // İç ticaret formülü: Daha güvenli ama risk barındırıyor
    // İstikrara göre başarı şansı (Örn: İstikrar 80 ise %80 şans)
    const successChance = game.stability / 100;
    const isSuccess = Math.random() < successChance;
    
    if (!isSuccess) {
      let lossSeverity = 0.60;
      if (successChance >= 0.70) lossSeverity = 0.10; // Düşük Risk
      else if (successChance >= 0.40) lossSeverity = 0.30; // Orta Risk

      const lostAmount = Math.round(investmentAmount * lossSeverity);

      const updatedGame = await prisma.game.update({
        where: { id: gameId },
        data: {
          budget: game.budget - lostAmount,
          stability: Math.max(0, game.stability - stabilityCost),
        }
      });
      return NextResponse.json({ success: false, message: `Yerel yatırım başarısız oldu. Yolsuzluk ve bürokrasi nedeniyle $${lostAmount} zarar ettiniz.`, newBudget: updatedGame.budget });
    }

    // Başarılı yatırım: +%20 ile +%50 arası kar
    const baseReturn = 0.20;
    const variableReturn = Math.random() * 0.30;
    const actualReturnPerc = baseReturn + variableReturn;
    const totalExpectedReturn = investmentAmount * (1 + actualReturnPerc);
    const incomePerTurn = Math.round(totalExpectedReturn / 5);

    marketState.tradesThisTurn.counts["Yerel Endüstri"] = currentTradesCount + 1;

    // Bütçeden ve istikrardan düş
    await prisma.game.update({
      where: { id: gameId },
      data: {
        budget: game.budget - investmentAmount,
        stability: Math.max(0, game.stability - stabilityCost),
        marketState: JSON.stringify(marketState)
      }
    });

    // Anlaşmayı "Yerel Endüstri" olarak kaydet
    const agreement = await prisma.tradeAgreement.create({
      data: {
        gameId: game.id,
        partnerName: "Yerel Endüstri",
        incomePerTurn: incomePerTurn,
        turnsRemaining: 5,
      }
    });

    return NextResponse.json({ agreement, newBudget: game.budget - investmentAmount, returnPercentage: Math.round(actualReturnPerc * 100) });
  } catch (error) {
    console.error("İç Ticaret hatası:", error);
    return NextResponse.json(
      { error: "Yerel yatırım yapılamadı" },
      { status: 500 }
    );
  }
}
